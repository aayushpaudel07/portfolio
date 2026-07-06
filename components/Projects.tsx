"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";
import { projects, projectCategories, type ProjectCategory } from "@/lib/data";

export default function Projects() {
  const [active, setActive] = useState<ProjectCategory | "All">("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.categories.includes(active));
  }, [active]);

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        index="05"
        slug="projects"
        title="Projects"
        subtitle="A selection of hands-on labs and tools built while learning offensive security, forensics, and networking."
      />

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {(["All", ...projectCategories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={cn(
              "rounded-full border px-4 py-1.5 font-mono-tight text-sm transition-colors",
              active === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-dim hover:border-secondary hover:text-secondary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              whileHover={{ y: -6 }}
              className="glass hud-corners flex flex-col rounded-2xl border border-border p-5"
            >
              <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-bg-elevated-2">
                <ImageOff size={28} className="text-text-dim" aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-semibold text-text">{project.title}</h3>
              <p className="mt-2 flex-1 text-sm text-text-dim">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-text-dim"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-primary"
                  >
                    <FaGithub size={16} aria-hidden="true" />
                    Source
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-text-dim/60">
                    <FaGithub size={16} aria-hidden="true" />
                    Source soon
                  </span>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-sm text-text-dim transition-colors hover:text-secondary"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Details
                </a>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
