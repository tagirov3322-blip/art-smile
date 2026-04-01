import dotenv from "dotenv";
dotenv.config();

import prisma from "./prismaClient";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Очищаю старые данные...");
  await prisma.booking.deleteMany();
  await prisma.portfolioWork.deleteMany();
  await prisma.review.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();

  // Админ (если нет)
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash("admin123", 12);
    await prisma.admin.create({ data: { login: "admin", passwordHash } });
    console.log("Админ создан: admin / admin123");
  }

  // Врачи
  console.log("Создаю врачей...");
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Ахметов Ринат Фаридович",
        specialty: "Терапевт-стоматолог",
        experience: 12,
        description: "Специализируется на лечении кариеса, пульпита, периодонтита. Владеет современными методами реставрации зубов.",
        isActive: true,
        schedule: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "16:00" },
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Сафина Алия Маратовна",
        specialty: "Ортодонт",
        experience: 8,
        description: "Исправление прикуса у детей и взрослых. Работает с брекет-системами и элайнерами.",
        isActive: true,
        schedule: {
          monday: { start: "10:00", end: "19:00" },
          wednesday: { start: "10:00", end: "19:00" },
          friday: { start: "10:00", end: "17:00" },
          saturday: { start: "10:00", end: "15:00" },
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Галиев Тимур Рустамович",
        specialty: "Хирург-имплантолог",
        experience: 15,
        description: "Проводит операции по установке имплантатов, удаление зубов любой сложности, костную пластику.",
        isActive: true,
        schedule: {
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          saturday: { start: "09:00", end: "14:00" },
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Камалова Динара Ильясовна",
        specialty: "Детский стоматолог",
        experience: 6,
        description: "Лечение зубов у детей от 1 года. Индивидуальный подход к каждому маленькому пациенту.",
        isActive: true,
        schedule: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "15:00" },
        },
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Нуриев Артур Ильдарович",
        specialty: "Стоматолог-ортопед",
        experience: 10,
        description: "Протезирование зубов: коронки, виниры, мосты. Работает с керамикой E-max и диоксидом циркония.",
        isActive: true,
        schedule: {
          monday: { start: "10:00", end: "18:00" },
          wednesday: { start: "10:00", end: "18:00" },
          thursday: { start: "10:00", end: "18:00" },
          friday: { start: "10:00", end: "16:00" },
        },
      },
    }),
  ]);

  // Услуги
  console.log("Создаю услуги...");
  const services = await Promise.all([
    // Терапия
    prisma.service.create({ data: { name: "Лечение кариеса", description: "Удаление поражённых тканей, восстановление зуба светоотверждаемой пломбой", price: 4500, duration: 60, category: "Терапия" } }),
    prisma.service.create({ data: { name: "Лечение пульпита", description: "Лечение воспаления нерва зуба с пломбировкой каналов", price: 8000, duration: 90, category: "Терапия" } }),
    prisma.service.create({ data: { name: "Реставрация зуба", description: "Художественная реставрация зуба композитным материалом", price: 6000, duration: 60, category: "Терапия" } }),

    // Гигиена
    prisma.service.create({ data: { name: "Профессиональная чистка", description: "Ультразвуковая чистка + Air Flow + полировка + фторирование", price: 4000, duration: 60, category: "Гигиена" } }),
    prisma.service.create({ data: { name: "Отбеливание ZOOM", description: "Профессиональное отбеливание зубов на 6-8 тонов за 1 сеанс", price: 15000, duration: 90, category: "Гигиена" } }),

    // Хирургия
    prisma.service.create({ data: { name: "Удаление зуба простое", description: "Удаление подвижного или однокорневого зуба", price: 3000, duration: 30, category: "Хирургия" } }),
    prisma.service.create({ data: { name: "Удаление зуба мудрости", description: "Сложное удаление ретинированного или дистопированного зуба", price: 8000, duration: 60, category: "Хирургия" } }),
    prisma.service.create({ data: { name: "Имплантация Straumann", description: "Установка импланта Straumann (Швейцария) под ключ", price: 55000, duration: 90, category: "Хирургия" } }),

    // Ортодонтия
    prisma.service.create({ data: { name: "Консультация ортодонта", description: "Осмотр, диагностика, составление плана лечения", price: 1000, duration: 30, category: "Ортодонтия" } }),
    prisma.service.create({ data: { name: "Брекеты металлические", description: "Установка металлической брекет-системы на одну челюсть", price: 35000, duration: 120, category: "Ортодонтия" } }),
    prisma.service.create({ data: { name: "Элайнеры", description: "Набор прозрачных капп для выравнивания зубов", price: 180000, duration: 60, category: "Ортодонтия" } }),

    // Ортопедия
    prisma.service.create({ data: { name: "Коронка E-max", description: "Цельнокерамическая коронка из прессованной керамики", price: 25000, duration: 60, category: "Ортопедия" } }),
    prisma.service.create({ data: { name: "Винир керамический", description: "Тонкая керамическая накладка на переднюю поверхность зуба", price: 30000, duration: 60, category: "Ортопедия" } }),

    // Детская стоматология
    prisma.service.create({ data: { name: "Лечение молочного зуба", description: "Лечение кариеса молочного зуба цветной пломбой", price: 3000, duration: 30, category: "Детская стоматология" } }),
    prisma.service.create({ data: { name: "Герметизация фиссур", description: "Защита жевательной поверхности зуба от кариеса", price: 2000, duration: 20, category: "Детская стоматология" } }),
  ]);

  // Акции
  console.log("Создаю акции...");
  await Promise.all([
    prisma.promotion.create({
      data: {
        title: "Профессиональная чистка за 2990₽",
        description: "Комплексная гигиена полости рта: ультразвук + Air Flow + полировка + фторирование. Акция для новых пациентов!",
        isActive: true,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-04-30"),
      },
    }),
    prisma.promotion.create({
      data: {
        title: "Бесплатная консультация имплантолога",
        description: "Запишитесь на бесплатную консультацию и получите план лечения с точной стоимостью. КТ-снимок в подарок!",
        isActive: true,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-05-31"),
      },
    }),
    prisma.promotion.create({
      data: {
        title: "Отбеливание ZOOM -20%",
        description: "Профессиональное отбеливание зубов ZOOM со скидкой 20%. Белоснежная улыбка за 1 визит!",
        isActive: true,
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-30"),
      },
    }),
  ]);

  // Отзывы
  console.log("Создаю отзывы...");
  await Promise.all([
    prisma.review.create({ data: { authorName: "Анна М.", text: "Лечила кариес у Рината Фаридовича. Очень аккуратный врач, совсем не больно! Пломба стоит уже полгода — как родная.", rating: 5, source: "site", isApproved: true, isVisible: true } }),
    prisma.review.create({ data: { authorName: "Дмитрий К.", text: "Делал чистку зубов. Результат отличный, зубы стали заметно белее. Приятный персонал, удобная запись.", rating: 5, source: "2gis", isApproved: true, isVisible: true } }),
    prisma.review.create({ data: { authorName: "Эльвира Р.", text: "Ребёнку 4 года, боялись идти к стоматологу. Динара Ильясовна нашла подход — дочка теперь сама просится на приём!", rating: 5, source: "yandex", isApproved: true, isVisible: true } }),
    prisma.review.create({ data: { authorName: "Марат И.", text: "Поставил 2 импланта у Тимура Рустамовича. Операция прошла быстро, восстановление без осложнений. Рекомендую!", rating: 5, source: "2gis", isApproved: true, isVisible: true } }),
    prisma.review.create({ data: { authorName: "Лилия С.", text: "Хожу в IQ Dental уже 2 года. Всегда всё на высшем уровне. Особенно нравится, что напоминают о приёме.", rating: 4, source: "site", isApproved: true, isVisible: true } }),
    prisma.review.create({ data: { authorName: "Руслан Г.", text: "Ставил виниры на передние зубы. Результат превзошёл ожидания — улыбка как у голливудской звезды!", rating: 5, source: "yandex", isApproved: true, isVisible: true } }),
  ]);

  // Настройки
  console.log("Создаю настройки...");
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      clinicName: "IQ Dental",
      phone: "+78001234567",
      address: "г. Казань, ул. Баумана, 50",
      workingHours: {
        monday: { start: "09:00", end: "19:00" },
        tuesday: { start: "09:00", end: "19:00" },
        wednesday: { start: "09:00", end: "19:00" },
        thursday: { start: "09:00", end: "19:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "10:00", end: "15:00" },
      },
      telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
      smsEnabled: false,
    },
  });

  console.log("Seed завершён!");
  console.log(`  Врачей: ${doctors.length}`);
  console.log(`  Услуг: ${services.length}`);
  console.log(`  Акций: 3`);
  console.log(`  Отзывов: 6`);
  process.exit(0);
}

seed().catch((e) => {
  console.error("Ошибка seed:", e);
  process.exit(1);
});
