import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient";
import { generateTokens, verifyRefreshToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, refreshSchema } from "../lib/validators";

const router = Router();

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { login } });
  if (!admin) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Неверный логин или пароль" });
    return;
  }

  const tokens = generateTokens(admin.id, admin.role);
  res.json(tokens);
});

// POST /api/auth/refresh
router.post("/refresh", validate(refreshSchema), async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== "refresh") {
      res.status(401).json({ error: "Недействительный refresh-токен" });
      return;
    }

    const tokens = generateTokens(payload.adminId, payload.role);
    res.json(tokens);
  } catch {
    res.status(401).json({ error: "Refresh-токен просрочен" });
  }
});

// POST /api/auth/setup — создание первого админа (только если нет ни одного)
router.post("/setup", async (req: Request, res: Response): Promise<void> => {
  const count = await prisma.admin.count();
  if (count > 0) {
    res.status(403).json({ error: "Админ уже существует" });
    return;
  }

  const { login, password } = req.body;
  if (!login || !password || password.length < 6) {
    res.status(400).json({ error: "Логин и пароль (мин. 6 символов) обязательны" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({
    data: { login, passwordHash },
  });

  const tokens = generateTokens(admin.id, admin.role);
  res.status(201).json(tokens);
});

export default router;
