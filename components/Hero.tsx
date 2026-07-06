"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, FolderGit2, Mail, ChevronDown, Flag, Bug, ShieldCheck } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import MatrixRain from "./MatrixRain";
import ParticleField from "./ParticleField";
import { useTypewriter } from "@/hooks/useTypewriter";
import { profile, typingRoles } from "@/lib/data";

const floatingBadges = [
  { icon: Flag, label: "CTF Player", className: "-left-4 top-6 sm:-left-10" },
  { icon: Bug, label: "Pentester", className: "-right-2 top-1/3 sm:-right-12" },
  { icon: ShieldCheck, label: "Defender", className: "left-0 -bottom-2 sm:-left-6" },
];

export default function Hero() {
  const typed = useTypewriter(typingRoles);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      <MatrixRain className="mix-blend-screen" />
      <ParticleField />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--bg)_78%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/70 px-3 py-1.5 font-mono-tight text-xs text-text-dim">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            SYSTEM STATUS: ONLINE
          </div>

          <p className="label-comment mt-5 font-mono-tight text-sm text-secondary">
            Hello, I&apos;m
          </p>
          <h1
            className="glitch mt-3 font-mono-tight text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
            data-text={profile.name}
          >
            <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="mt-3 font-mono-tight text-2xl font-semibold text-glow text-primary sm:text-3xl">
            &lt;{profile.brand}/&gt;
          </p>
          <p className="mt-4 max-w-xl text-base text-text-dim sm:text-lg">
            {profile.title}
          </p>

          <div className="mt-6 flex h-9 items-center rounded-lg border border-border bg-bg-elevated/60 px-3 font-mono-tight text-lg text-secondary sm:text-xl w-fit">
            <span className="mr-2 text-primary" aria-hidden="true">
              root@kali:~#
            </span>
            <span aria-live="polite">{typed}</span>
            <span className="ml-0.5 h-5 w-[9px] animate-blink bg-secondary" aria-hidden="true" />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="shimmer glow-primary inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-mono-tight text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              <FolderGit2 size={16} aria-hidden="true" />
              View Projects
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="shimmer gradient-border inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 py-3 font-mono-tight text-sm font-semibold text-text transition-transform hover:-translate-y-0.5"
            >
              <Download size={16} aria-hidden="true" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-mono-tight text-sm font-semibold text-text-dim transition-colors hover:border-secondary hover:text-secondary"
            >
              <Mail size={16} aria-hidden="true" />
              Contact Me
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="rounded-full border border-border p-2.5 text-text-dim transition-all hover:border-primary hover:text-primary hover:glow-primary"
            >
              <FaGithub size={20} />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="rounded-full border border-border p-2.5 text-text-dim transition-all hover:border-secondary hover:text-secondary hover:glow-secondary"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto flex items-center justify-center"
        >
          <div className="relative">
            {/* Rotating neon rings */}
            <div
              className="animate-spin-slow absolute -inset-5 rounded-full border border-dashed border-primary/40"
              aria-hidden="true"
            />
            <div
              className="animate-spin-slow-reverse absolute -inset-10 rounded-full border border-secondary/20 [border-style:dotted]"
              aria-hidden="true"
            />
            <div
              className="animate-spin-slow absolute -inset-5 rounded-full [background:conic-gradient(from_0deg,transparent_0%,color-mix(in_srgb,var(--primary)_35%,transparent)_8%,transparent_16%)]"
              aria-hidden="true"
            />

            <div className="animate-float relative">
              <div className="gradient-border rounded-full p-1.5">
                <div className="relative h-56 w-56 overflow-hidden rounded-full bg-bg-elevated sm:h-72 sm:w-72">
                  <Image
                    src="/images/profile-placeholder.svg"
                    alt="Portrait of Aayush Paudel"
                    fill
                    sizes="(max-width: 640px) 224px, 288px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full glow-primary" aria-hidden="true" />
            </div>

            {/* Floating badges */}
            {floatingBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.span
                  key={badge.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.5 }}
                  className={`animate-float glass absolute flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono-tight text-xs text-text ${badge.className}`}
                  style={{ animationDelay: `${i * 1.4}s` }}
                >
                  <Icon size={13} className="text-primary" aria-hidden="true" />
                  {badge.label}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-text-dim transition-colors hover:text-primary sm:flex"
      >
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.25em]">scroll</span>
        <ChevronDown size={18} className="animate-bounce" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
