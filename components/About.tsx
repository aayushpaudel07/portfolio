"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { education, profile } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading index="01" slug="about" title="About Me" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glass gradient-border rounded-2xl p-6 sm:p-8"
        >
          <p className="leading-relaxed text-text-dim">{profile.bio}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-text-dim">
            <MapPin size={16} className="text-primary" aria-hidden="true" />
            {profile.location}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="flex items-center gap-2 font-mono-tight text-lg font-semibold text-secondary">
            <GraduationCap size={20} aria-hidden="true" />
            Education
          </h3>

          <ol className="relative mt-6 space-y-10 border-l border-border pl-6">
            {education.map((edu) => (
              <li key={edu.id} className="relative">
                <span
                  className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary glow-primary"
                  aria-hidden="true"
                />
                <p className="font-mono-tight text-xs uppercase tracking-wide text-text-dim">
                  {edu.period}
                </p>
                <h4 className="mt-1 text-lg font-semibold text-text">
                  {edu.institution}
                </h4>
                <p className="text-sm text-text-dim">{edu.degree}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {edu.coursework.map((course) => (
                    <span
                      key={course}
                      className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-text-dim"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
