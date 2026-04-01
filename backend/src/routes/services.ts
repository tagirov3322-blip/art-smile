import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createServiceSchema, updateServiceSchema } from "../lib/validators";
import { sanitizeObject } from "../lib/sanitize";

const router = Router();

// GET /api/services — публичный
router.get("/", async (req: Request, res: Response) => {
  const { category, active } = req.query;
  const where: Record<string, unknown> = {};
  if (active !== "false") where.isActive = true;
  if (category) where.category = category;

  const services = await prisma.service.findMany({
    where,
    orderBy: { category: "asc" },
  });
  res.json(services);
});

// GET /api/services/:id — публичный
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const service = await prisma.service.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!service) {
    res.status(404).json({ error: "Услуга не найдена" });
    return;
  }
  res.json(service);
});

// POST /api/services — admin
router.post("/", requireAdmin, validate(createServiceSchema), async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  const service = await prisma.service.create({ data });
  res.status(201).json(service);
});

// PUT /api/services/:id — admin
router.put("/:id", requireAdmin, validate(updateServiceSchema), async (req: Request, res: Response) => {
  const data = sanitizeObject(req.body);
  const service = await prisma.service.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(service);
});

// DELETE /api/services/:id — admin
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  await prisma.service.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Услуга удалена" });
});

export default router;
