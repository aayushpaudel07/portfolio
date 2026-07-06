"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import {
  Code2,
  MonitorCog,
  Network,
  ShieldHalf,
  Wrench,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import { skillCategories, tools } from "@/lib/data";

const categoryIcons: Record<string, ElementType> = {
  programming: Code2,
  os: MonitorCog,
  networking: Network,
  cybersecurity: ShieldHalf,
};

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading index="02" slug="skills" title="Skills" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {skillCategories.map((category, i) => {
          const Icon = categoryIcons[category.id] ?? Code2;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass gradient-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-border bg-bg-elevated-2 p-2 text-primary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="font-mono-tight text-lg font-semibold text-text">
                  {category.label}
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-text-dim transition-colors hover:border-primary hover:text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mt-10"
      >
        <h3 className="flex items-center gap-2 font-mono-tight text-lg font-semibold text-secondary">
          <Wrench size={20} aria-hidden="true" />
          Tools
        </h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {tools.map((tool, i) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="glass rounded-lg border border-border px-4 py-2 font-mono-tight text-sm text-text transition-colors hover:border-secondary hover:text-secondary"
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
