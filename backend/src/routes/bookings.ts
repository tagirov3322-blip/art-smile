import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/bookings — admin
router.get("/", requireAdmin, async (req: Request, res: Response) => {
  const { status, doctorId } = req.query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = Number(doctorId);

  const bookings = await prisma.booking.findMany({
    where,
    include: { doctor: true, service: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(bookings);
});

// POST /api/bookings — публичный
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { patientName, phone, doctorId, serviceId, date, time, comment, consentGiven } = req.body;

  if (!consentGiven) {
    res.status(400).json({ error: "Необходимо согласие на обработку персональных данных" });
    return;
  }

  // Проверка: один номер = одна активная заявка
  const existingBooking = await prisma.booking.findFirst({
    where: {
      phone,
      status: { in: ["new", "confirmed"] },
    },
  });

  if (existingBooking) {
    res.status(400).json({ error: "У вас уже есть активная заявка" });
    return;
  }

  const booking = await prisma.booking.create({
    data: {
      patientName,
      phone,
      doctorId: Number(doctorId),
      serviceId: Number(serviceId),
      date: new Date(date),
      time,
      comment,
    },
  });

  res.status(201).json(booking);
});

// PUT /api/bookings/:id — admin
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const booking = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(booking);
});

// DELETE /api/bookings/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.booking.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Запись удалена" });
});

export default router;
