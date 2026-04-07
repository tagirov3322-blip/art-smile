import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import prisma from "./prismaClient";

async function scrape2GIS() {
  console.log("Загружаю страницу 2GIS...");

  const res = await axios.get(
    "https://2gis.ru/nabchelny/firm/70000001036298410/tab/reviews",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }
  );

  const html: string = res.data;

  // Извлекаем текст отзывов
  const textRegex = /"text":"((?:[^"\\]|\\.){30,})"/g;
  const allTexts: string[] = [];
  let match;

  while ((match = textRegex.exec(html)) !== null) {
    const text = match[1]
      .replace(/\\n/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\\/g, "");

    // Фильтруем: только реальные отзывы, не ответы клиники и не ссылки
    if (
      text.length > 30 &&
      !text.startsWith("http") &&
      !text.startsWith("Добрый день") &&
      !text.startsWith("Добрый вечер") &&
      !text.startsWith("Здравствуйте") &&
      !text.startsWith("Спасибо") &&
      !text.startsWith("Большое спасибо") &&
      !text.startsWith("Благодарим") &&
      !text.startsWith("Заходите") &&
      !text.startsWith("Вероника") &&
      !text.startsWith("Гузель") &&
      !text.startsWith("Сабина") &&
      !text.startsWith("Фаниль") &&
      !text.startsWith("Алина") &&
      !text.includes("hh.ru") &&
      !text.includes("спасибо за отзыв") &&
      !text.includes("спасибо, что уделили") &&
      !text.includes("Были рады помочь") &&
      !text.includes("приходите к нам ещё") &&
      !text.includes("предложили прийти на прием")
    ) {
      allTexts.push(text);
    }
  }

  console.log(`Найдено ${allTexts.length} отзывов`);

  // Удаляем старые отзывы с 2gis
  await prisma.review.deleteMany({ where: { source: "2gis" } });

  let saved = 0;
  for (let i = 0; i < allTexts.length && i < 30; i++) {
    const text = allTexts[i];
    const authorName = "Пациент Art Smile";
    const sourceId = `2gis_${i}_${Date.now()}`;

    // Определяем рейтинг по тону (все 2GIS отзывы обычно положительные)
    const rating = text.includes("не рекомендую") || text.includes("невозможно") ? 2 : 5;

    await prisma.review.create({
      data: {
        authorName,
        text: text.slice(0, 2000),
        rating,
        source: "2gis",
        sourceId,
        isApproved: true,
        isVisible: true,
      },
    });
    saved++;
    console.log(`  ${saved}. ${authorName}: ${text.slice(0, 60)}...`);
  }

  console.log(`\nСохранено ${saved} отзывов с 2GIS`);
  process.exit(0);
}

scrape2GIS().catch((e) => {
  console.error("Ошибка:", e.message);
  process.exit(1);
});
