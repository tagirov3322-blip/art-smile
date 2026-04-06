"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const animStarted = useRef(false);

  useEffect(() => {
    if (animStarted.current) return;
    animStarted.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3d: true },
        delay: 0.3,
      });

      tl.to(".hero-title", {
        y: 0, opacity: 1, duration: 0.6,
      });

      tl.fromTo(".hero-cta",
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        0.4,
      );

      /* ── Parallax on scroll ── */
      const trigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      };

      gsap.to(".hero-title", {
        y: "-25%",
        ease: "none",
        scrollTrigger: trigger,
      });

      gsap.to(".hero-cta-row", {
        y: "-80%",
        ease: "none",
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] min-h-[70vh] sm:min-h-screen"
      style={{ backgroundColor: "transparent" }}
    >
      {/* decorative effects moved to wrapper level in globals.css */}

      {/* ── Content: centered on mobile, absolute on desktop ── */}
      <div
        className="hero-title relative z-[1] flex min-h-0 flex-col items-center px-6 pt-[45vw] pb-4 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-[10%] md:top-[12%] lg:top-[14%] sm:pt-0 sm:pb-0 sm:px-4"
        style={{ opacity: 0, transform: "translateY(30px)", willChange: "transform, opacity" }}
      >
        <span
          className="hero-subtitle mb-2 sm:mb-5 font-[var(--font-heading)] text-xs font-medium tracking-wide sm:text-lg lg:text-xl"
          style={{ color: "rgba(220, 225, 240, 0.5)" }}
        >
          Стоматология нового поколения
        </span>
        <h1
          className="text-center font-[var(--font-heading)] font-bold uppercase leading-[1.1]"
          style={{
            fontSize: "clamp(2.5rem, 12vw, 14rem)",
            letterSpacing: "-0.04em",
            background: "linear-gradient(180deg, rgba(230,235,250,0.7) 0%, rgba(160,175,210,0.35) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 60px rgba(150,170,220,0.2))",
          }}
        >
          Айкью Дентал
        </h1>

        {/* Mobile buttons — right below title */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:hidden [&_a]:pointer-events-auto">
          <a
            href="#booking"
            className="hero-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 active:scale-[0.97]"
            style={{ visibility: "hidden" }}
          >
            Записаться на приём
            <ArrowRight className="h-5 w-5 text-white/70" />
          </a>
          <a
            href="#promotions"
            className="hero-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 active:scale-[0.97]"
            style={{ visibility: "hidden" }}
          >
            К акциям
            <ArrowRight className="h-5 w-5 text-white/70" />
          </a>
        </div>
      </div>

      {/* ── Desktop buttons (absolute) ── */}
      <div className="hero-cta-row pointer-events-none absolute inset-x-0 bottom-[22%] sm:bottom-[20%] md:bottom-[25%] lg:bottom-[30%] z-[4] hidden sm:flex items-center justify-between px-[5%] md:px-[8%] lg:px-[12%] xl:px-[13%] [&_a]:pointer-events-auto">
        <a
          href="#booking"
          className="hero-cta inline-flex items-center justify-center gap-2 rounded-lg border font-medium tracking-[0.08em] transition-[border-color,background-color,box-shadow] duration-300 active:scale-[0.97] h-14 w-[240px] text-base md:h-16 md:w-[280px] md:text-lg lg:h-20 lg:w-[320px] lg:text-xl border-white/80 bg-white text-[#0a0f1a] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] dark:border-white/20 dark:bg-white/5 dark:text-white/90 dark:hover:border-white/60 dark:hover:bg-white/15 dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          style={{ visibility: "hidden" }}
        >
          Записаться на приём
          <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 text-[#0a0f1a]/60 dark:text-white/70" />
        </a>
        <a
          href="#promotions"
          className="hero-cta inline-flex items-center justify-center gap-2 rounded-lg border font-medium tracking-[0.08em] transition-[border-color,background-color,box-shadow] duration-300 active:scale-[0.97] h-14 w-[240px] text-base md:h-16 md:w-[280px] md:text-lg lg:h-20 lg:w-[320px] lg:text-xl border-white/80 bg-white text-[#0a0f1a] hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] dark:border-white/20 dark:bg-white/5 dark:text-white/90 dark:hover:border-white/60 dark:hover:bg-white/15 dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          style={{ visibility: "hidden" }}
        >
          К акциям
          <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 text-[#0a0f1a]/60 dark:text-white/70" />
        </a>
      </div>
    </section>
  );
}
