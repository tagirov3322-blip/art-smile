import rateLimit from "express-rate-limit";

// Записи: 2 заявки за 30 минут с одного IP
export const bookingLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  message: { error: "Вы уже отправили заявку. Подождите 30 минут" },
});

// Отзывы: 1 отзыв за 10 минут с одного IP
export const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: { error: "Вы уже оставили отзыв. Подождите 10 минут" },
});
