import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createBookingSchema, updateBookingSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";
import { broadcast } from "../lib/sse";
import { notifyNewBooking } from "../lib/telegram";
import { sendBookingCreatedSms, sendBookingConfirmedSms, sendBookingCancelledSms } from "../lib/sms";
import logger from "../lib/logger";

const router = Router();

// GET /api/bookings — admin
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  const { status, doctorId, page = "1", limit = "20", search } = req.query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = Number(doctorId);
  if (search) {
    where.OR = [
      { patientName: { contains: search as string, mode: "insensitive" } },
      { phone: { contains: search as string } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { doctor: true, service: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({ bookings, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// POST /api/bookings — публичный
router.post("/", validate(createBookingSchema), async (req: Request, res: Response): Promise<void> => {
  const data = sanitizeObject(req.body);
  const { patientName, phone, doctorId, serviceId, date, time, comment } = data;

  // Один номер = одна активная заявка
  const existing = await prisma.booking.findFirst({
    where: { phone: phone as string, status: { in: ["new", "confirmed"] } },
  });

  if (existing) {
    res.status(400).json({ error: "У вас уже есть активная заявка" });
    return;
  }

  // Проверка существования врача и услуги
  const [doctor, service] = await Promise.all([
    prisma.doctor.findUnique({ where: { id: Number(doctorId) } }),
    prisma.service.findUnique({ where: { id: Number(serviceId) } }),
  ]);

  if (!doctor || !doctor.isActive) {
    res.status(400).json({ error: "Врач не найден или неактивен" });
    return;
  }
  if (!service || !service.isActive) {
    res.status(400).json({ error: "Услуга не найдена или неактивна" });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      patientName: patientName as string,
      phone: phone as string,
      doctorId: Number(doctorId),
      serviceId: Number(serviceId),
      date: new Date(date as string),
      time: time as string,
      comment: (comment as string) || null,
    },
    include: { doctor: true, service: true },
  });

  // SSE уведомление в админку
  broadcast("new_booking", booking);

  // Telegram уведомление менеджеру
  notifyNewBooking(booking).catch((err) => logger.error({ err }, "Telegram notify failed"));

  // SMS пациенту
  sendBookingCreatedSms(booking.phone, booking.patientName).catch((err) =>
    logger.error({ err }, "SMS send failed")
  );

  res.status(201).json(booking);
});

// PUT /api/bookings/:id — admin
router.put("/:id", requireAdmin, validate(updateBookingSchema), async (req: Request, res: Response): Promise<void> => {
  const oldBooking = await prisma.booking.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!oldBooking) {
    res.status(404).json({ error: "Запись не найдена" });
    return;
  }

  const booking = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: req.body,
    include: { doctor: true, service: true },
  });

  // SMS при смене статуса
  if (req.body.status && req.body.status !== oldBooking.status) {
    if (req.body.status === "confirmed") {
      sendBookingConfirmedSms(
        booking.phone,
        booking.patientName,
        booking.date.toLocaleDateString("ru-RU"),
        booking.time
      ).catch((err) => logger.error({ err }, "SMS confirm failed"));
    } else if (req.body.status === "cancelled") {
      sendBookingCancelledSms(booking.phone, booking.patientName).catch((err) =>
        logger.error({ err }, "SMS cancel failed")
      );
    }
  }

  broadcast("booking_updated", booking);
  res.json(booking);
});

// DELETE /api/bookings/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.booking.delete({ where: { id: Number(req.params.id) } });
  broadcast("booking_deleted", { id: Number(req.params.id) });
  res.json({ message: "Запись удалена" });
});

export default router;
