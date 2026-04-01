"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { label: "Ресепшен", color: "from-blue-400 to-blue-600" },
  { label: "Кабинет терапии", color: "from-sky-400 to-indigo-500" },
  { label: "Панорамный снимок", color: "from-indigo-400 to-purple-500" },
  { label: "Зона ожидания", color: "from-cyan-400 to-blue-500" },
  { label: "Хирургический кабинет", color: "from-blue-500 to-indigo-600" },
  { label: "Стерилизация", color: "from-violet-400 to-blue-600" },
  { label: "Детский кабинет", color: "from-sky-300 to-blue-500" },
  { label: "Оборудование", color: "from-blue-600 to-indigo-700" },
];

export default function About() {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Smooth mouse follow loop
  useEffect(() => {
    const animate = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.08;
      current.current.y += (mouse.current.y - current.current.y) * 0.08;

      if (gridRef.current) {
        gridRef.current.style.transform = `
          rotateX(${current.current.y}deg)
          rotateY(${current.current.x}deg)
        `;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current.x = x * 20;  // max ±10 degrees
    mouse.current.y = y * -15; // max ±7.5 degrees, inverted
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current.x = 0;
    mouse.current.y = 0;
  }, []);

  // Scroll-driven parallax on individual cards
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-photo]");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const speed = [60, -40, 80, -30, 50, -60, 70, -50][i % 8];
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

        {/* 3D Interactive Grid */}
        <div
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative"
          style={{ perspective: "1000px" }}
        >
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              transition: "none",
            }}
          >
            {photos.map((photo, idx) => (
              <div
                key={idx}
                data-photo
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  aspectRatio: idx % 3 === 0 ? "3/4" : "4/3",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                {/* Gradient placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${photo.color} transition-transform duration-700 ease-out group-hover:scale-110`}
                />

                {/* Label overlay */}
                <div className="absolute inset-0 flex items-end p-4 sm:p-5">
                  <div className="translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-block rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg">
                      {photo.label}
                    </span>
                  </div>
                </div>

                {/* Shine on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
