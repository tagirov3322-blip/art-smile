import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/services — публичный
router.get("/", async (_req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" },
  });
  res.json(services);
});

// POST /api/services — admin
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const service = await prisma.service.create({ data: req.body });
  res.status(201).json(service);
});

// PUT /api/services/:id — admin
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  const service = await prisma.service.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(service);
});

// DELETE /api/services/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Услуга удалена" });
});

export default router;
