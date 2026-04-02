import { Router, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { getSupabase } from "../supabaseClient";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import logger from "../lib/logger";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/", requireAdmin, upload.single("file"), asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) { res.status(400).json({ error: "Файл не загружен" }); return; }

  // Сжимаем: ресайз до 600px по ширине, конвертируем в webp
  const compressed = await sharp(file.buffer)
    .resize(600, 800, { fit: "cover", position: "top", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const originalSize = (file.size / 1024).toFixed(0);
  const newSize = (compressed.length / 1024).toFixed(0);
  logger.info(`Upload: ${file.originalname} ${originalSize}KB -> ${newSize}KB webp`);

  const fileName = `${Date.now()}.webp`;
  const supabase = getSupabase();
  const { error } = await supabase.storage.from("photos").upload(fileName, compressed, { contentType: "image/webp" });

  if (error) { res.status(500).json({ error: "Ошибка загрузки файла" }); return; }

  const { data } = supabase.storage.from("photos").getPublicUrl(fileName);
  res.json({ url: data.publicUrl });
}));

export default router;
