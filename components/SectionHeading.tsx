"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  index,
  slug,
  title,
  subtitle,
}: {
  index: string;
  slug: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative mb-12"
    >
      <span
        className="pointer-events-none absolute -top-10 -left-2 select-none font-mono-tight text-[7rem] font-bold leading-none text-text/[0.04] sm:text-[9rem]"
        aria-hidden="true"
      >
        {index}
      </span>

      <p className="relative font-mono-tight text-sm text-text-dim">
        <span className="text-primary">{index}</span> ./{slug}
      </p>
      <h2 className="relative mt-2 font-mono-tight text-3xl font-bold text-text sm:text-4xl">
        {title}
        <span className="text-primary">_</span>
      </h2>
      {subtitle && <p className="relative mt-3 max-w-2xl text-text-dim">{subtitle}</p>}
      <div className="relative mt-5 h-px w-24 bg-gradient-to-r from-primary via-secondary to-transparent" />
    </motion.div>
  );
}
