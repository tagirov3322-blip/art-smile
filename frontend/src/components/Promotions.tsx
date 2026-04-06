"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";


interface ApiPromotion {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
  endDate: string | null;
}

interface Promo {
  title: string;
  description: string;
  badge: string;
  deadline: string | null;
  cta: string;
  accent: string;
  border: string;
  dark: boolean;
}

const ACCENTS = [
  { accent: "from-[#1a1208] via-[#231808] to-[#1c1408]", border: "border-[#C4973B]/20", dark: true },
  { accent: "from-[#1c1408] via-[#1a1208] to-[#231808]", border: "border-[#C4973B]/20", dark: true },
  { accent: "from-[#231808] via-[#1c1408] to-[#1a1208]", border: "border-[#C4973B]/20", dark: true },
  { accent: "from-[#1a1208] via-[#231808] to-[#1c1408]", border: "border-[#C4973B]/20", dark: true },
];

const FALLBACK_PROMOTIONS: Promo[] = [
  { title: "Бесплатная консультация", description: "Первичный осмотр и составление плана лечения — бесплатно.", badge: "Для новых пациентов", deadline: null, cta: "Записаться по акции", ...ACCENTS[0] },
  { title: "Профчистка –20%", description: "Скидка 20% на комплексную профессиональную гигиену.", badge: "Хит", deadline: "30.06.2026", cta: "Записаться по акции", ...ACCENTS[1] },
];

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promo[]>(FALLBACK_PROMOTIONS);

  useEffect(() => {
    api.get<ApiPromotion[]>("/promotions").then((data) => {
      if (data.length > 0) {
        setPromotions(data.map((p, i) => ({
          title: p.title,
          description: p.description || "",
          badge: p.endDate ? "Ограниченное предложение" : "Бессрочно",
          deadline: p.endDate ? new Date(p.endDate).toLocaleDateString("ru-RU") : null,
          cta: "Записаться по акции",
          ...ACCENTS[i % ACCENTS.length],
        })));
      }
    }).catch(console.error);
  }, []);


  return (
    <section id="promotions" className="relative bg-background dark:bg-transparent pb-28 pt-16 sm:pt-20">
      {/* Accent orb */}
      <div className="pointer-events-none absolute right-1/4 top-0 h-80 w-80 rounded-full bg-primary/4 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="promotions-heading mb-14">
          <span className="font-[var(--font-mono)] text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">Акции</h2>
        </div>

        <div className="promos-grid grid grid-cols-1 gap-5 md:grid-cols-2">
          {promotions.map((promo, i) => (
            <div
              key={i}
              className={cn(
                "promo-card group relative overflow-hidden rounded-3xl border p-8 sm:p-10",
                "flex flex-col",
                "bg-gradient-to-br",
                promo.accent,
                promo.border,
                "transition-all duration-500 hover:shadow-2xl hover:scale-[1.015]",
                promo.dark ? "hover:shadow-[#C4973B]/15" : "hover:shadow-primary/8 liquid-glass-light"
              )}
            >
              {/* Decorative blurred orbs */}
              <div className={cn(
                "pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-125",
                promo.dark ? "bg-[#C4973B]/10" : "bg-primary/6"
              )} />
              <div className={cn(
                "pointer-events-none absolute -bottom-8 right-16 h-32 w-32 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-4",
                promo.dark ? "bg-[#D4AF6A]/8" : "bg-primary/4"
              )} />

              {/* Badge */}
              <span className={cn(
                "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm",
                promo.dark ? "bg-white/10 text-white/90" : "bg-white/80 text-foreground"
              )}>
                <span className={cn("h-2 w-2 rounded-full", promo.dark ? "bg-[#D4AF6A]" : "bg-primary")} />
                {promo.badge}
              </span>

              {/* Content */}
              <div className="relative z-10 mt-5 flex-1">
                <h3 className={cn(
                  "font-[var(--font-heading)] text-2xl font-bold leading-tight",
                  promo.dark ? "text-white" : "text-foreground"
                )}>
                  {promo.title}
                </h3>
                <p className={cn(
                  "mt-3 max-w-md text-base leading-relaxed",
                  promo.dark ? "text-white/65" : "text-foreground/70"
                )}>
                  {promo.description}
                </p>
              </div>

              {/* Footer: deadline + CTA */}
              <div className="relative z-10 mt-6 flex items-center justify-between">
                {promo.deadline ? (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-sm",
                    promo.dark ? "text-white/40" : "text-foreground/50"
                  )}>
                    <Clock className="h-3.5 w-3.5" />
                    до {promo.deadline}
                  </span>
                ) : <span />}
                <span />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave → Booking (dark) */}
    </section>
  );
}
