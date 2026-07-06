"use client";

import { motion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { certifications } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading index="03" slug="certifications" title="Certifications" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="glass hud-corners group flex flex-col rounded-2xl border border-border p-6"
          >
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-border bg-bg-elevated-2">
              <Award
                size={40}
                className="text-text-dim transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 flex items-start gap-2">
              <BadgeCheck
                size={18}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono-tight text-xs uppercase tracking-wide text-text-dim">
                  {cert.issuer}
                </p>
                <h3 className="mt-1 font-semibold text-text">{cert.name}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
