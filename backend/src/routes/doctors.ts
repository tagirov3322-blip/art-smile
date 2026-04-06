import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { createDoctorSchema, updateDoctorSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";
import { cacheGet, cacheSet, cacheInvalidate } from "../lib/cache";

const router = Router();

router.get("/", asyncHandler(async (req: Request, res: Response) => {
  const { active } = req.query;
  const cacheKey = `doctors:${active}`;
  const cached = cacheGet(cacheKey);
  if (cached) { res.json(cached); return; }
  const where = active === "false" ? {} : { isActive: true };
  const doctors = await prisma.doctor.findMany({ where, orderBy: { name: "asc" } });
  cacheSet(cacheKey, doctors, 60_000);
  res.json(doctors);
}));

router.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.findUnique({ where: { id: Number(req.params.id) } });
  if (!doctor) { res.status(404).json({ error: "Врач не найден" }); return; }
  res.json(doctor);
}));

// GET /doctors/:id/day-schedule?date=2026-04-08
// Returns the schedule for a specific date (checks week override first, then default)
router.get("/:id/day-schedule", asyncHandler(async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  const { date } = req.query;
  if (!date) { res.status(400).json({ error: "date обязателен" }); return; }

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) { res.status(404).json({ error: "Врач не найден" }); return; }

  const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dateObj = new Date(date as string);
  const dayKey = DAY_KEYS[dateObj.getDay()];

  // Find Monday of this week
  const monday = new Date(dateObj);
  const dow = monday.getDay();
  monday.setDate(monday.getDate() - ((dow + 6) % 7));
  const weekStartStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

  const weekRecord = await prisma.doctorWeekSchedule.findUnique({
    where: { doctorId_weekStart: { doctorId, weekStart: new Date(weekStartStr) } },
  });

  const schedule = (weekRecord?.schedule || doctor.schedule) as Record<string, { start: string; end: string }> | null;
  const daySchedule = schedule?.[dayKey] || null;

  res.json({ available: !!daySchedule, schedule: daySchedule, dayKey });
}));

router.post("/", requireAdmin, validate(createDoctorSchema), asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.create({ data: sanitizeObject(req.body) });
  cacheInvalidate("doctors:");
  res.status(201).json(doctor);
}));

router.put("/:id", requireAdmin, validate(updateDoctorSchema), asyncHandler(async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.update({ where: { id: Number(req.params.id) }, data: sanitizeObject(req.body) });
  cacheInvalidate("doctors:");
  res.json(doctor);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
  cacheInvalidate("doctors:");
  res.json({ message: "Врач удалён" });
}));

// ── Week schedule endpoints ──

// GET /doctors/:id/week-schedule?weekStart=2026-04-06
router.get("/:id/week-schedule", asyncHandler(async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  const { weekStart } = req.query;
  if (!weekStart) { res.status(400).json({ error: "weekStart обязателен" }); return; }

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) { res.status(404).json({ error: "Врач не найден" }); return; }

  const weekRecord = await prisma.doctorWeekSchedule.findUnique({
    where: { doctorId_weekStart: { doctorId, weekStart: new Date(weekStart as string) } },
  });

  res.json({
    schedule: weekRecord?.schedule || doctor.schedule || null,
    isCustom: !!weekRecord,
  });
}));

// PUT /doctors/:id/week-schedule
router.put("/:id/week-schedule", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  const { weekStart, schedule } = req.body;
  if (!weekStart || !schedule) { res.status(400).json({ error: "weekStart и schedule обязательны" }); return; }

  const record = await prisma.doctorWeekSchedule.upsert({
    where: { doctorId_weekStart: { doctorId, weekStart: new Date(weekStart) } },
    update: { schedule },
    create: { doctorId, weekStart: new Date(weekStart), schedule },
  });

  cacheInvalidate("doctors:");
  res.json(record);
}));

// DELETE /doctors/:id/week-schedule?weekStart=2026-04-06 (reset to default)
router.delete("/:id/week-schedule", requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  const { weekStart } = req.query;
  if (!weekStart) { res.status(400).json({ error: "weekStart обязателен" }); return; }

  await prisma.doctorWeekSchedule.deleteMany({
    where: { doctorId, weekStart: new Date(weekStart as string) },
  });

  cacheInvalidate("doctors:");
  res.json({ message: "Расписание недели сброшено к дефолту" });
}));

export default router;
