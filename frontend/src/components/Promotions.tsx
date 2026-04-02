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
}

const ACCENTS = [
  { accent: "from-[#2a3250]/8 to-[#2a3250]/4", border: "border-[#2a3250]/10" },
  { accent: "from-slate-100 to-gray-100", border: "border-slate-200" },
  { accent: "from-gray-100 to-slate-100", border: "border-gray-200" },
  { accent: "from-[#2a3250]/6 to-[#2a3250]/3", border: "border-[#2a3250]/8" },
];

const FALLBACK_PROMOTIONS: Promo[] = [
  { title: "Бесплатная консультация", description: "Первичный осмотр и составление плана лечения — бесплатно.", badge: "Для новых пациентов", deadline: null, cta: "Записаться", ...ACCENTS[0] },
  { title: "Профчистка –20%", description: "Скидка 20% на комплексную профессиональную гигиену.", badge: "Хит", deadline: "30.06.2026", cta: "Записаться", ...ACCENTS[1] },
];

export default function Promotions() {
<<<<<<< HEAD
  const sectionRef = useRef<HTMLElement>(null);
  const [promotions, setPromotions] = useState<Promo[]>(FALLBACK_PROMOTIONS);

  useEffect(() => {
    api.get<ApiPromotion[]>("/promotions").then((data) => {
      if (data.length > 0) {
        setPromotions(data.map((p, i) => ({
          title: p.title,
          description: p.description || "",
          badge: p.endDate ? "Ограниченное предложение" : "Бессрочно",
          deadline: p.endDate ? new Date(p.endDate).toLocaleDateString("ru-RU") : null,
          cta: "Записаться",
          ...ACCENTS[i % ACCENTS.length],
        })));
      }
    }).catch(console.error);
  }, []);
=======
  
>>>>>>> 7425ed765e7c40b7f164e48d68af126d6c1a8ed4


  return (
    <section id="promotions" className="relative bg-background pb-28 pt-16 sm:pt-20">
      {/* Accent orb */}
      <div className="pointer-events-none absolute right-1/4 top-0 h-80 w-80 rounded-full bg-primary/4 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="promotions-heading mb-14">
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-muted-foreground">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">Акции</h2>
        </div>

        <div className="promos-grid grid grid-cols-1 gap-5 md:grid-cols-2">
          {promotions.map((promo, i) => (
            <div
              key={i}
              className={cn(
                "promo-card group relative min-h-[320px] overflow-hidden rounded-3xl border p-8 sm:p-10",
                "flex flex-col justify-between",
                "bg-gradient-to-br",
                promo.accent,
                promo.border,
                "liquid-glass-light",
                "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/8 hover:scale-[1.015]"
              )}
            >
              {/* Decorative blurred orb inside card */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/6 blur-2xl transition-transform duration-700 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-8 right-16 h-32 w-32 rounded-full bg-primary/4 blur-2xl transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-4" />

              {/* Badge */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {promo.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto">
                <h3 className="font-[var(--font-heading)] text-2xl font-bold leading-tight text-foreground sm:text-3xl">
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

              {/* CTA */}
              <div className="relative z-10 mt-6">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 border-b-2 border-foreground pb-1 text-base font-semibold text-foreground transition-all duration-300 group-hover:gap-3"
                >
                  {promo.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave → Booking (dark) */}
    </section>
  );
}
