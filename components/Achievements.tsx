"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { Trophy, Laptop, Rocket, Target, Medal, Flag } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { achievements } from "@/lib/data";

const icons: Record<string, ElementType> = {
  trophy: Trophy,
  laptop: Laptop,
  rocket: Rocket,
  target: Target,
  medal: Medal,
  flag: Flag,
};

export default function Achievements() {
  return (
    <section id="achievements" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading index="04" slug="achievements" title="Achievements" />

      <ol className="relative space-y-8 border-l border-border pl-6">
        {achievements.map((item, i) => {
          const Icon = icons[item.icon] ?? Trophy;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              <span
                className="absolute -left-[38px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-bg text-primary glow-primary"
                aria-hidden="true"
              >
                <Icon size={14} />
              </span>
              <div className="glass rounded-xl border border-border px-5 py-4">
                <p className="font-medium text-text">{item.title}</p>
                {item.date && (
                  <p className="mt-1 font-mono-tight text-xs text-text-dim">
                    {item.date}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
