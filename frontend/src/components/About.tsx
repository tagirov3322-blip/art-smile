"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { label: "Ресепшен", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop" },
  { label: "Кабинет терапии", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=800&fit=crop" },
  { label: "Панорамный снимок", img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=450&fit=crop" },
  { label: "Зона ожидания", img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=450&fit=crop" },
  { label: "Хирургический кабинет", img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=800&fit=crop" },
  { label: "Стерилизация", img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop" },
  { label: "Современное оборудование", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=450&fit=crop" },
  { label: "Улыбка пациента", img: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=600&h=800&fit=crop" },
];

/*
 * Layout: ring of 8 cards around a center gap.
 * CSS Grid 4 cols × 3 rows, center 2×1 is empty.
 *
 *  [0] [1] [2] [3]
 *  [4]  ·empty·  [5]
 *  [6] [7] [8] [9]  — we only have 8, so 9 slots with gap
 *
 * Actually simpler: 4 cols × 3 rows, place manually.
 */
const gridPositions = [
  "col-start-1 row-start-1", // 0 — top-left
  "col-start-2 row-start-1", // 1 — top
  "col-start-3 row-start-1", // 2 — top
  "col-start-4 row-start-1", // 3 — top-right
  "col-start-1 row-start-2", // 4 — middle-left
  "col-start-4 row-start-2", // 5 — middle-right
  "col-start-1 row-start-3", // 6 — bottom-left
  "col-start-2 row-start-3 col-span-2", // 7 — bottom-center wide
];

function PhotoCard({
  photo,
  className,
}: {
  photo: (typeof photos)[number];
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 25,
      rotateX: y * -20,
      scale: 1.08,
      zIndex: 10,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 600,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      zIndex: 1,
      duration: 0.6,
      ease: "power3.out",
      transformPerspective: 600,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <img
        src={photo.img}
        alt={photo.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Dark gradient at bottom for label */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Label */}
      <div className="absolute inset-0 flex items-end p-4 sm:p-5">
        <div className="translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg">
            {photo.label}
          </span>
        </div>
      </div>

      {/* Glare */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll parallax on individual cards
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const speed = [50, -30, 60, -45, 40, -55, 35, -25][i % 8];
        gsap.fromTo(
          card,
          { y: speed },
          {
            y: -speed,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Text */}
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <p className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-blue-600">
            О клинике
          </p>
          <h2 className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Современная стоматология
            <br className="hidden sm:block" />
            {" "}в&nbsp;центре города
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg max-w-xl mx-auto">
            <p>
              Клиника{" "}
              <span className="font-semibold text-gray-900">IQ&nbsp;Dental</span>{" "}
              переехала по новому адресу —{" "}
              <span className="font-medium text-gray-900">просп.&nbsp;Мира,&nbsp;34</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой.
            </p>
          </div>
        </div>

        {/* 3D Photo Grid — ring layout with center gap */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          style={{
            gridTemplateRows: "220px 220px 220px",
          }}
        >
          {photos.map((photo, idx) => (
            <div key={idx} data-card className={gridPositions[idx]}>
              <PhotoCard photo={photo} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
