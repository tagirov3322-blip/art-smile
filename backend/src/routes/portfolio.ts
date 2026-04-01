import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/portfolio — публичный
router.get("/", async (req: Request, res: Response) => {
  const { doctorId, category } = req.query;

  const where: Record<string, unknown> = {};
  if (doctorId) where.doctorId = Number(doctorId);
  if (category) where.category = category;

  const works = await prisma.portfolioWork.findMany({
    where,
    include: { doctor: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(works);
});

// POST /api/portfolio — admin
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const work = await prisma.portfolioWork.create({ data: req.body });
  res.status(201).json(work);
});

// DELETE /api/portfolio/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.portfolioWork.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Работа удалена" });
});

export default router;
