"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  photo: string | null;
  description: string | null;
  schedule: Record<string, { start: string; end: string }> | null;
}

function DoctorCard({
  doctor,
  onClick,
}: {
  doctor: Doctor;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const border = borderRef.current;
      if (!border) return;
      const rect = border.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

      gsap.to(border, {
        rotationX: rotateX,
        rotationY: rotateY,
        scale: 1.03,
        zIndex: 10,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });

      border.style.backgroundImage = `radial-gradient(400px circle at ${x}px ${y}px, rgba(42,50,80,0.8), rgba(42,50,80,0.15) 50%, transparent 70%)`;

      if (glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 0.12,
          x: x - rect.width / 2,
          y: y - rect.height / 2,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (borderRef.current) {
      gsap.to(borderRef.current, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        zIndex: 1,
        duration: 0.6,
        ease: "power3.out",
        transformPerspective: 800,
      });
      borderRef.current.style.backgroundImage = "none";
      borderRef.current.style.backgroundColor = "rgba(42,50,80,0.12)";
    }
    if (glareRef.current)
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
  }, []);

  const isMobileCard = typeof window !== "undefined" && window.innerWidth < 640;

  const photoPosition: Record<string, string> = {
    "Шайхелисламов Раушан Рафисович": "scale(1.35) translateY(-18%)",
    "Сабиров Ренат Халитович": "scale(1.35) translateY(-4%)",
  };
  const photoTransform = photoPosition[doctor.name] ?? "scale(1.35) translateY(-8%)";

  return (
    <div
      className="doctor-card group relative z-[1] h-full cursor-pointer hover:z-[10]"
      style={{ perspective: isMobileCard ? "none" : "800px" }}
      onMouseMove={isMobileCard ? undefined : handleMouseMove}
      onMouseLeave={isMobileCard ? undefined : handleMouseLeave}
      onClick={onClick}
    >
      <div
        ref={borderRef}
        className="relative h-full rounded-2xl p-[1.5px] will-change-transform"
        style={{
          background: "rgba(42,50,80,0.12)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={cardRef}
          className={cn(
            "relative h-full overflow-hidden rounded-[14px] bg-card",
            "transition-shadow duration-300",
            "hover:shadow-xl hover:shadow-black/10"
          )}
        >
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-10 rounded-[14px]"
            style={{
              opacity: 0,
              background:
                "radial-gradient(300px circle at center, rgba(255,255,255,0.8), transparent 60%)",
            }}
          />

          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/4" }}
          >
            <img
              src={doctor.photo || "/doctors/default.webp"}
              alt={doctor.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "50% 0%", transform: photoTransform, transformOrigin: "50% 0%" }}
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <div className="p-6">
            <h3 className="font-[var(--font-heading)] text-lg font-semibold leading-snug text-foreground">
              {doctor.name}
            </h3>
            <p className="mt-2 text-sm font-medium text-primary">
              {doctor.specialty}
            </p>
            <p className="mt-2.5 font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Опыт {doctor.experience} лет
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorModal({
  doctor,
  onClose,
}: {
  doctor: Doctor;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationX: y * -10,
        rotationY: x * 10,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current)
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power3.out",
        transformPerspective: 1000,
      });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-h-[90vh] sm:max-w-2xl"
        style={{ perspective: typeof window !== "undefined" && window.innerWidth >= 640 ? "1000px" : "none" }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={typeof window !== "undefined" && window.innerWidth >= 640 ? handleMouseMove : undefined}
        onMouseLeave={typeof window !== "undefined" && window.innerWidth >= 640 ? handleMouseLeave : undefined}
      >
        <div
          ref={cardRef}
          className="relative overflow-y-auto max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-card shadow-2xl"
        >
          <button
            onClick={onClose}
            className="sticky top-3 right-3 z-20 ml-auto mr-3 mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row -mt-8 sm:mt-0">
            <div className="relative shrink-0 sm:w-2/5">
              <div
                className="mx-4 overflow-hidden rounded-2xl sm:m-5 sm:mr-0"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={doctor.photo || "/doctors/default.webp"}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Специалист
              </p>
              <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-bold leading-tight text-foreground">
                {doctor.name}
              </h3>
              <p className="mt-3 text-lg font-medium text-primary">
                {doctor.specialty}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {doctor.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-xl bg-muted px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">
                    Опыт
                  </p>
                  <p className="font-[var(--font-heading)] text-lg font-bold text-foreground">
                    {doctor.experience} лет
                  </p>
                </div>
                {doctor.schedule && (
                <div className="rounded-xl bg-muted px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">
                    График
                  </p>
                  <p className="font-[var(--font-heading)] text-sm font-bold text-foreground">
                    {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].filter(d => d in (doctor.schedule as Record<string,unknown>)).map(d => ({monday:"Пн",tuesday:"Вт",wednesday:"Ср",thursday:"Чт",friday:"Пт",saturday:"Сб",sunday:"Вс"})[d]).join(", ")}
                  </p>
                </div>
                )}
              </div>

              <a
                href="#booking"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("select-doctor", { detail: { doctorId: doctor.id } }));
                  onClose();
                }}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-white transition-all hover:bg-[#353d5c] active:scale-[0.98]"
              >
                Записаться к специалисту
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAll, setShowAll] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const VISIBLE_COUNT = 3;

  useEffect(() => {
    api.get<Doctor[]>("/doctors").then(setDoctors).catch(console.error);
  }, []);

  useGSAP(
    () => {
      // Heading reveal
      gsap.from(".doctors-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".doctors-heading",
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  // Cards stagger entrance — run after doctors are loaded
  useEffect(() => {
    if (doctors.length === 0 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".doctor-card", {
        y: 60,
        opacity: 0,
        scale: 0.93,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".doctors-grid",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [doctors]);

  return (
    <>
      <section
        ref={sectionRef}
        id="doctors"
        className="relative bg-background dark:bg-transparent pb-28 pt-16 sm:pt-20"
      >
        {/* Subtle orb */}
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-primary/4 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="doctors-heading mb-[var(--space-lg)]">
            <div className="mb-3">
              <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Команда
              </span>
            </div>
            <h2 className="text-fluid-h1 font-[var(--font-heading)] text-foreground">
              Наши специалисты
            </h2>
            <p className="mt-4 max-w-xl text-fluid-body text-muted-foreground">
              Команда профессионалов с многолетним опытом работы
            </p>
          </div>

          <div className="doctors-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.slice(0, VISIBLE_COUNT).map((doctor) => (
              <DoctorCard
                key={doctor.name}
                doctor={doctor}
                onClick={() => setSelectedDoctor(doctor)}
              />
            ))}
          </div>

          {doctors.length > VISIBLE_COUNT && (
            <>
              <div
                ref={extraRef}
                className={cn(
                  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ease-in-out",
                  !showAll && "overflow-hidden"
                )}
                style={{
                  maxHeight: showAll ? `${doctors.length * 600}px` : "0px",
                  opacity: showAll ? 1 : 0,
                  marginTop: showAll ? "1.25rem" : "0px",
                }}
              >
                {doctors.slice(VISIBLE_COUNT).map((doctor) => (
                  <DoctorCard
                    key={doctor.name}
                    doctor={doctor}
                    onClick={() => setSelectedDoctor(doctor)}
                  />
                ))}
              </div>

              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="rounded-full border border-primary/20 bg-card px-8 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                  {showAll ? "Скрыть" : "Показать всех"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Wave → Reviews (very dark) */}
      </section>

      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </>
  );
}
