"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, Users, BookMarked, UserPlus } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
};

type User = {
  followers: number;
  following: number;
  public_repos: number;
};

const languageColors: Record<string, string> = {
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Rust: "#dea584",
};

export default function GitHubStats() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(false);
  const username = profile.githubUsername;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => {
        if (!r.ok) throw new Error("user fetch failed");
        return r.json();
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      ).then((r) => {
        if (!r.ok) throw new Error("repos fetch failed");
        return r.json();
      }),
    ])
      .then(([userData, repoData]: [User, Repo[]]) => {
        if (cancelled) return;
        setUser(userData);
        setRepos(repoData);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const totalStars = useMemo(
    () => repos?.reduce((sum, r) => sum + r.stargazers_count, 0) ?? 0,
    [repos]
  );

  const languages = useMemo(() => {
    if (!repos) return [];
    const counts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.language) {
        counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
      }
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / total) * 100),
        color: languageColors[name] ?? "#8a9a94",
      }));
  }, [repos]);

  const recentRepos = useMemo(() => repos?.slice(0, 6) ?? null, [repos]);

  const stats = [
    { icon: BookMarked, label: "Public Repos", value: user?.public_repos },
    { icon: Star, label: "Total Stars", value: repos ? totalStars : undefined },
    { icon: Users, label: "Followers", value: user?.followers },
    { icon: UserPlus, label: "Following", value: user?.following },
  ];

  return (
    <section id="github" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        index="07"
        slug="github"
        title="GitHub"
        subtitle={`Live stats and activity pulled from github.com/${username}`}
      />

      {error ? (
        <p className="text-sm text-text-dim">
          Couldn&apos;t load GitHub data right now.{" "}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline"
          >
            View the profile directly on GitHub
          </a>
          .
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="glass gradient-border rounded-xl p-5 text-center"
                >
                  <Icon size={20} className="mx-auto text-primary" aria-hidden="true" />
                  <p className="mt-2 font-mono-tight text-2xl font-bold text-text">
                    {stat.value ?? "–"}
                  </p>
                  <p className="mt-1 text-xs text-text-dim">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="glass gradient-border rounded-2xl p-6"
            >
              <h3 className="font-mono-tight text-sm font-semibold text-secondary">
                Top Languages
              </h3>
              {languages.length === 0 ? (
                <div className="mt-4 h-24 animate-pulse rounded-lg bg-bg-elevated-2" />
              ) : (
                <>
                  <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-bg-elevated-2">
                    {languages.map((lang) => (
                      <span
                        key={lang.name}
                        style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                        title={`${lang.name} ${lang.pct}%`}
                      />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <li key={lang.name} className="flex items-center gap-2 text-xs text-text-dim">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: lang.color }}
                          aria-hidden="true"
                        />
                        {lang.name} <span className="text-text-dim/60">{lang.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="glass gradient-border overflow-hidden rounded-2xl p-6"
            >
              <h3 className="font-mono-tight text-sm font-semibold text-secondary">
                Contribution Graph
              </h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/00ff9c/${username}`}
                alt={`Contribution graph for ${username}`}
                loading="lazy"
                className="mt-4 w-full"
              />
            </motion.div>
          </div>

          <div className="mt-10">
            <h3 className="font-mono-tight text-lg font-semibold text-secondary">
              Recent Repositories
            </h3>

            {!recentRepos ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-border bg-bg-elevated-2"
                  />
                ))}
              </div>
            ) : recentRepos.length === 0 ? (
              <p className="mt-4 text-sm text-text-dim">No public repositories yet.</p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentRepos.map((repo, i) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="glass gradient-border flex flex-col rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 truncate font-mono-tight text-sm font-semibold text-text">
                        <FaGithub size={14} className="shrink-0 text-primary" aria-hidden="true" />
                        {repo.name}
                      </span>
                      <ExternalLink size={14} className="shrink-0 text-text-dim" aria-hidden="true" />
                    </div>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs text-text-dim">
                      {repo.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-text-dim">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: languageColors[repo.language] ?? "#8a9a94",
                            }}
                            aria-hidden="true"
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star size={12} aria-hidden="true" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={12} aria-hidden="true" /> {repo.forks_count}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
