"use client";

import { useEffect, useRef, useState } from "react";

export default function GlobalEffects() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let x = targetX;
    let y = targetY;
    let frame: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-primary via-secondary to-accent-purple transition-[width] duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      {/* Ambient background layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="animate-blob absolute -top-48 -left-48 h-[540px] w-[540px] rounded-full bg-primary/[0.07] blur-[130px]" />
        <div
          className="animate-blob absolute top-1/3 -right-56 h-[600px] w-[600px] rounded-full bg-secondary/[0.06] blur-[140px]"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="animate-blob absolute -bottom-56 left-1/4 h-[560px] w-[560px] rounded-full bg-accent-purple/[0.06] blur-[140px]"
          style={{ animationDelay: "-15s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--bg)_100%)]" />
      </div>

      {/* Cursor spotlight (desktop only) */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 -z-10 hidden h-[600px] w-[600px] rounded-full opacity-70 [background:radial-gradient(circle,color-mix(in_srgb,var(--primary)_9%,transparent)_0%,transparent_65%)] md:block"
        aria-hidden="true"
      />

      {/* Scanlines on top of everything, extremely subtle */}
      <div
        className="scanlines pointer-events-none fixed inset-0 z-[55]"
        style={{ opacity: 0.13 }}
        aria-hidden="true"
      />
    </>
  );
}
