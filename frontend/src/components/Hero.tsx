"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });

/* ── Sparkle particles (canvas) ── */
function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; r: number;
      vx: number; vy: number;
      alpha: number; phase: number; speed: number;
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
    }));

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;
        p.alpha = 0.3 + Math.sin(p.phase) * 0.4;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx!.fill();

        // Glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.15})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      tl.to(".hero-bg-text", {
        y: 0, opacity: 1, duration: 0.8,
      });

      tl.to(".hero-tooth-wrapper", {
        y: 0, opacity: 1, duration: 1.6, ease: "power2.out",
      }, 0.1);

      tl.to(".hero-cta", {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5,
      }, "-=1.0");

// Glow pulse
      gsap.to(".hero-glow", {
        scale: 1.15,
        opacity: 0.6,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* ── Parallax layers on scroll ── */
      const trigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      };

      // Text goes up slowest
      gsap.to(".hero-bg-text", {
        y: "-30%",
        ease: "none",
        scrollTrigger: trigger,
      });

      // Tooth goes up medium
      gsap.to(".hero-tooth-scroll", {
        y: "-55%",
        ease: "none",
        scrollTrigger: {
          ...trigger,
          end: "bottom+=50% top",
        },
      });

      // Buttons go up fastest
      gsap.to(".hero-cta-row", {
        y: "-80%",
        ease: "none",
        scrollTrigger: trigger,
      });

    },
    { scope: sectionRef }
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-10 min-h-screen"
        style={{
          backgroundColor: "#2a3040",
          backgroundImage:
            "linear-gradient(to bottom, #ffffff 0%, #e4e8f0 25%, #b0b8c8 50%, #4a5268 80%, #2a3040 100%)",
        }}
      >
{/* ── Sparkle particles ── */}
        <SparkleCanvas />

        {/* ── Glow behind tooth ── */}
        <div
          ref={glowRef}
          className="hero-glow pointer-events-none absolute left-1/2 top-[45%] z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(180,200,230,0.15) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── "Стоматология нового поколения" + АЙКЬЮ ДЕНТАЛ ── */}
        <div
          className="hero-bg-text pointer-events-none absolute inset-x-0 top-[12%] z-[1] flex flex-col items-center select-none"
          style={{ opacity: 0, transform: "translateY(60px)" }}
        >
          <span className="mb-4 font-[var(--font-mono)] text-sm tracking-[0.15em] text-[#2a3250]/50">
            Стоматология нового поколения
          </span>
          <h1
            className="whitespace-nowrap font-[var(--font-heading)] font-bold uppercase leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 14rem)",
              letterSpacing: "-0.04em",
              color: "rgba(42, 50, 80, 0.55)",
            }}
          >
            Айкью Дентал
          </h1>
        </div>

        {/* ── 3D Tooth ── */}
        <div
          className="hero-tooth-wrapper pointer-events-none absolute inset-x-0 z-[3]"
          style={{ top: "20%", bottom: "-45%", opacity: 0, transform: "translateY(15%)" }}
        >
          <div className="hero-tooth-scroll pointer-events-auto h-full w-full">
            <ToothScene />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="hero-cta-row pointer-events-none absolute inset-x-0 bottom-[20%] z-[4] flex items-center justify-between px-[12%] sm:px-[15%] lg:px-[18%] [&_a]:pointer-events-auto">
          <a
            href="#booking"
            className="hero-cta inline-flex h-16 w-64 items-center justify-center gap-3 rounded-full bg-[#2a3250] text-lg font-semibold tracking-[0.02em] text-white transition-all hover:bg-[#1d2440] active:scale-[0.97]"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            Записаться на приём
          </a>
          <a
            href="#about"
            className="hero-cta inline-flex h-16 w-64 items-center justify-center gap-3 rounded-full bg-white/90 text-lg font-semibold tracking-[0.02em] text-[#2a3250] transition-all hover:bg-white active:scale-[0.97]"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            Подробнее
          </a>
        </div>

      </section>
    </>
  );
}
