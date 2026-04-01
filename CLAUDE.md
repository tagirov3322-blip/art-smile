# Dental Clinic — Сайт стоматологии

## Архитектура
- **backend/** — Express + TypeScript + Prisma + PostgreSQL (Supabase)
- **frontend/** — Next.js + TypeScript + Tailwind CSS
- **API_DOCS.md** — контракт между фронтом и бэком

## Разделение зон
- Бэкенд-разработчик: папка backend/
- Фронтенд-разработчик: папка frontend/
- API_DOCS.md — общий документ

## Команды

### Backend
```bash
cd backend
npm run dev        # Запуск dev-сервера (порт 4000)
npm run build      # Сборка TypeScript
npm run db:migrate # Миграция Prisma
npm run db:studio  # Prisma Studio
```

### Frontend
```bash
cd frontend
npm run dev   # Запуск dev-сервера (порт 3000)
npm run build # Сборка
```

## GSAP-анимации
- Скиллы GSAP расположены в `.skills/gsap/`
- При работе с анимациями — читай соответствующий SKILL.md перед использованием
- Доступные скиллы: gsap-core, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-plugins, gsap-performance, gsap-frameworks, gsap-utils

## Git
- Перед работой: `git pull origin master`
- Один репозиторий, две папки
