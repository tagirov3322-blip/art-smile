import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/doctors — публичный
router.get("/", async (_req: Request, res: Response) => {
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  res.json(doctors);
});

// GET /api/doctors/:id — публичный
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!doctor) {
    res.status(404).json({ error: "Врач не найден" });
    return;
  }
  res.json(doctor);
});

// POST /api/doctors — admin
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.create({ data: req.body });
  res.status(201).json(doctor);
});

// PUT /api/doctors/:id — admin
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(doctor);
});

// DELETE /api/doctors/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.doctor.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Врач удалён" });
});

export default router;
