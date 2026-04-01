"use client";

import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const promotions = [
  {
    title: "Бесплатная консультация",
    subtitle: "0 ₽",
    description: "Первичный осмотр, диагностика и составление плана лечения — бесплатно для всех новых пациентов.",
    conditions: "Для новых пациентов",
    deadline: null,
    isHit: false,
    gradient: "from-blue-100 via-indigo-100 to-purple-100",
  },
  {
    title: "Профчистка –20%",
    subtitle: "–20%",
    description: "Скидка 20% на комплексную профессиональную гигиену полости рта: ультразвук, Air-Flow, полировка и фторирование.",
    conditions: "На полный комплекс",
    deadline: "30.06.2026",
    isHit: true,
    gradient: "from-rose-100 via-pink-100 to-orange-100",
  },
  {
    title: "Имплантация под ключ",
    subtitle: "от 35 000 ₽",
    description: "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка.",
    conditions: "Имплант + коронка",
    deadline: "31.05.2026",
    isHit: false,
    gradient: "from-emerald-100 via-teal-100 to-cyan-100",
  },
  {
    title: "Семейная скидка 10%",
    subtitle: "10%",
    description: "Приходите всей семьёй и получайте скидку 10% на все виды лечения.",
    conditions: "От 2 членов семьи",
    deadline: null,
    isHit: false,
    gradient: "from-violet-100 via-purple-100 to-fuchsia-100",
  },
];

export default function Promotions() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="promotions" className="py-[var(--space-section)] bg-[var(--background)]">
      <div className="mx-auto max-w-xl px-4 sm:px-6">

        {/* Title */}
        <h2 className="text-center font-[var(--font-heading)] text-fluid-h1 text-foreground">
          Акции и предложения
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white p-1">
            {promotions.map((promo, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === i
                    ? "bg-[var(--foreground)] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {promo.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured card */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-[var(--muted)] border border-[var(--border)]">
          <div className={cn("relative h-48 bg-gradient-to-br", promotions[activeTab].gradient)}>
            {/* Big subtitle overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-8">
              <div>
                <h3 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
                  {promotions[activeTab].title}
                </h3>
                <p className="mt-1 font-[var(--font-mono)] text-3xl font-bold text-foreground/80">
                  {promotions[activeTab].subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-3">
              {promotions[activeTab].deadline ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                  <Clock className="h-3 w-3" />
                  до {promotions[activeTab].deadline}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  <Clock className="h-3 w-3" />
                  Бессрочно
                </span>
              )}
              <span className="rounded-full bg-[var(--muted)] border border-[var(--border)] px-3 py-1 text-xs font-medium text-muted-foreground">
                {promotions[activeTab].conditions}
              </span>
              {promotions[activeTab].isHit && (
                <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-xs font-bold text-white">
                  Хит
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {promotions[activeTab].description}
            </p>
          </div>
        </div>

        {/* Small cards grid — the rest */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {promotions.filter((_, i) => i !== activeTab).map((promo, idx) => (
            <button
              key={promo.title}
              onClick={() => setActiveTab(promotions.indexOf(promo))}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Gradient top */}
              <div className={cn("h-28 bg-gradient-to-br", promo.gradient)} />
              {/* Label */}
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {promo.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#booking"
          className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-[var(--foreground)] py-4 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          Записаться на приём
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
