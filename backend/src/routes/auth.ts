import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient";
import { generateTokens, verifyRefreshToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../middleware/asyncHandler";
import { loginSchema, refreshSchema } from "../lib/validators";

const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { login } });
  if (!admin) { res.status(401).json({ error: "Неверный логин или пароль" }); return; }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) { res.status(401).json({ error: "Неверный логин или пароль" }); return; }

  res.json(generateTokens(admin.id, admin.role));
}));

router.post("/refresh", validate(refreshSchema), asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== "refresh") { res.status(401).json({ error: "Недействительный refresh-токен" }); return; }
    res.json(generateTokens(payload.adminId, payload.role));
  } catch {
    res.status(401).json({ error: "Refresh-токен просрочен" });
  }
}));

router.post("/setup", asyncHandler(async (req: Request, res: Response) => {
  const count = await prisma.admin.count();
  if (count > 0) { res.status(403).json({ error: "Админ уже существует" }); return; }

  const { login, password } = req.body;
  if (!login || !password || password.length < 6) {
    res.status(400).json({ error: "Логин и пароль (мин. 6 символов) обязательны" }); return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({ data: { login, passwordHash } });
  res.status(201).json(generateTokens(admin.id, admin.role));
}));

export default router;
