"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Shield, HeartPulse, Monitor, Scan, Cpu, Syringe } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PHOTOS = [1, 2, 3, 4, 5, 6];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = useCallback(() => {
    setLightbox((i) => (i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null));
  }, []);
  const nextPhoto = useCallback(() => {
    setLightbox((i) => (i !== null ? (i + 1) % PHOTOS.length : null));
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prevPhoto, nextPhoto]);

  useGSAP(
    () => {
      // Using `to` + inline opacity:0 for reliability (same pattern as Hero)
      gsap.to(".about-text-item", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-left",
          start: "top 80%",
          once: true,
        },
      });

      gsap.to(".about-photo", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-grid",
          start: "top 80%",
          once: true,
        },
      });

      // Hover — push siblings horizontally (flex-grow) AND vertically (row flex-grow)
      const allRows = gsap.utils.toArray<HTMLElement>(".about-photo-grid");
      allRows.forEach((row) => {
        const cards = gsap.utils.toArray<HTMLElement>(".about-photo", row);
        const otherRows = allRows.filter((r) => r !== row);

        cards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            // Horizontal: grow hovered card, shrink siblings
            gsap.to(card, { flexGrow: 1.8, duration: 0.5, ease: "power2.out" });
            cards.forEach((sibling) => {
              if (sibling !== card) {
                gsap.to(sibling, { flexGrow: 0.6, duration: 0.5, ease: "power2.out" });
              }
            });
            // Vertical: grow this row slightly
            gsap.to(row, { flexGrow: 1.15, duration: 0.5, ease: "power2.out" });
            otherRows.forEach((r) => {
              gsap.to(r, { flexGrow: 0.9, duration: 0.5, ease: "power2.out" });
            });
          });

          card.addEventListener("mouseleave", () => {
            // Reset all cards in this row
            cards.forEach((c) => {
              gsap.to(c, { flexGrow: 1, duration: 0.5, ease: "power2.out" });
            });
            // Reset all rows
            allRows.forEach((r) => {
              gsap.to(r, { flexGrow: 1, duration: 0.5, ease: "power2.out" });
            });
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-[1] overflow-hidden pt-0 pb-20 sm:pb-28 lg:pb-32"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pt-20 sm:px-10 sm:pt-40 lg:px-12 lg:pt-48">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10">
          {/* ── Left — Info ── */}
          <div className="about-left lg:w-[28%] shrink-0">
            <p
              className="about-text-item font-[var(--font-mono)] text-sm font-semibold uppercase tracking-[0.2em] text-white/60"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              О клинике
            </p>

            <p
              className="about-text-item mt-6 max-w-lg text-lg leading-relaxed text-white/80"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              Стоматологический комплекс{" "}
              <span className="font-semibold text-white">Art&nbsp;Smiles</span>{" "}
              — это современная клиника по адресу{" "}
              <span className="font-medium text-white">пр-кт&nbsp;Вахитова,&nbsp;54В</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой. Лучшая стоматология 2025 по версии 2ГИС.
            </p>

            {/* Features */}
            <div
              className="about-text-item mt-8 grid grid-cols-2 gap-4"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Адрес</p>
                  <p className="text-sm text-white/60">пр-кт Вахитова, 54В</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Работаем</p>
                  <p className="text-sm text-white/60">Пн-Пт 8:00–20:00, Сб 8:00–14:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Гарантия</p>
                  <p className="text-sm text-white/60">5 лет на работы</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Технологии</p>
                  <p className="text-sm text-white/60">3D-диагностика</p>
                </div>
              </div>
            </div>

            {/* Оборудование */}
            <div
              className="about-text-item mt-10 rounded-2xl border border-white/10 bg-white/5 p-6"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-white/50">Оборудование</p>
              <p className="mt-3 text-base leading-relaxed text-white/80">
                Клиника оснащена <span className="font-semibold text-white">новейшим оборудованием</span> ведущих мировых производителей для точной диагностики и безболезненного лечения.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Scan className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">КТ Vatech</p>
                    <p className="text-xs text-white/50">3D-томограф</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Monitor className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Визиограф</p>
                    <p className="text-xs text-white/50">Цифровые снимки</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Cpu className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Osstem</p>
                    <p className="text-xs text-white/50">Импланты Корея</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Syringe className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Диодный лазер</p>
                    <p className="text-xs text-white/50">Безболезненно</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#services"
              className="about-text-item mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold tracking-[0.02em] text-[#1a1f2e] transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              Узнать об услугах
            </a>
          </div>

          {/* ── Right — 6 Photo cards ── */}
          <div className="about-grid flex-1 lg:translate-x-4 flex flex-col gap-5">
            {/* Row 1 */}
            <div className="about-photo-grid flex flex-1 gap-5 min-h-[160px] sm:min-h-[220px] lg:min-h-0">
              {PHOTOS.slice(0, 3).map((n, i) => (
                <div
                  key={n}
                  onClick={() => openLightbox(i)}
                  className="about-photo cursor-pointer overflow-hidden rounded-2xl bg-white/10 min-h-[160px] sm:min-h-[220px] lg:min-h-0"
                  style={{ opacity: 0, transform: "translateY(40px)", flexGrow: 1, flexBasis: 0 }}
                >
                  <img
                    src={`/about/${n}.png`}
                    alt={`Фото клиники ${n}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div className="about-photo-grid flex flex-1 gap-5 min-h-[160px] sm:min-h-[220px] lg:min-h-0">
              {PHOTOS.slice(3, 6).map((n, i) => (
                <div
                  key={n}
                  onClick={() => openLightbox(i + 3)}
                  className="about-photo cursor-pointer overflow-hidden rounded-2xl bg-white/10 min-h-[160px] sm:min-h-[220px] lg:min-h-0"
                  style={{ opacity: 0, transform: "translateY(40px)", flexGrow: 1, flexBasis: 0 }}
                >
                  <img
                    src={`/about/${n}.png`}
                    alt={`Фото клиники ${n}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image */}
          <img
            src={`/about/${PHOTOS[lightbox]}.png`}
            alt={`Фото клиники ${PHOTOS[lightbox]}`}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/70">
            {lightbox + 1} / {PHOTOS.length}
          </div>
        </div>
      )}
    </section>
  );
}
