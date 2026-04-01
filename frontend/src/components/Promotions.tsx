"use client";

import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const promotions = [
  {
    title: "Бесплатная консультация",
    description: "Первичный осмотр, диагностика и составление плана лечения — бесплатно для всех новых пациентов клиники.",
    badge: "Для новых пациентов",
    badgeColor: "bg-orange-400",
    deadline: null,
    cta: "Записаться",
    bg: "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100",
    decorColor: "from-orange-200/80 to-amber-200/60",
  },
  {
    title: "Профчистка –20%",
    description: "Скидка 20% на комплексную профессиональную гигиену: ультразвук, Air-Flow, полировка и фторирование.",
    badge: "Хит",
    badgeColor: "bg-[var(--foreground)]",
    deadline: "30.06.2026",
    cta: "Записаться",
    bg: "bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200",
    decorColor: "from-gray-300/60 to-slate-300/40",
  },
  {
    title: "Имплантация под ключ от 35 000 ₽",
    description: "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка по фиксированной цене.",
    badge: "Ограниченное предложение",
    badgeColor: "bg-violet-400",
    deadline: "31.05.2026",
    cta: "Узнать подробнее",
    bg: "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100",
    decorColor: "from-violet-200/70 to-purple-200/50",
  },
  {
    title: "Семейная скидка 10%",
    description: "Приходите всей семьёй и получайте скидку 10% на все виды лечения при одновременном обращении от двух членов семьи.",
    badge: "Бессрочно",
    badgeColor: "bg-emerald-400",
    deadline: null,
    cta: "Записаться",
    bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100",
    decorColor: "from-emerald-200/70 to-teal-200/50",
  },
];

export default function Promotions() {
  return (
    <section id="promotions" className="py-[var(--space-section)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-14">
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-muted-foreground">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">
            Акции
          </h2>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {promotions.map((promo, i) => (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-8 sm:p-10 min-h-[340px] flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:scale-[1.01]",
                promo.bg
              )}
            >
              {/* Decorative shapes */}
              <div className={cn("pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br opacity-60 transition-transform duration-700 group-hover:scale-110", promo.decorColor)} />
              <div className={cn("pointer-events-none absolute -right-8 top-20 h-40 w-40 rounded-full bg-gradient-to-br opacity-40 transition-transform duration-700 group-hover:scale-125 group-hover:translate-x-4", promo.decorColor)} />
              <div className={cn("pointer-events-none absolute right-24 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-30 transition-transform duration-700 group-hover:scale-110", promo.decorColor)} />

              {/* Top: badge */}
              <div>
                <span className={cn("inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm")}>
                  <span className={cn("h-3 w-3 rounded-full", promo.badgeColor)} />
                  {promo.badge}
                </span>
              </div>

              {/* Middle: content */}
              <div className="relative z-10 mt-auto">
                <h3 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {promo.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-foreground/70">
                  {promo.description}
                </p>

                {promo.deadline && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground/50">
                    <Clock className="h-3.5 w-3.5" />
                    до {promo.deadline}
                  </span>
                )}
              </div>

              {/* Bottom: CTA link */}
              <div className="relative z-10 mt-6">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 text-base font-semibold text-foreground border-b-2 border-foreground pb-1 transition-all duration-300 group-hover:gap-3"
                >
                  {promo.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
