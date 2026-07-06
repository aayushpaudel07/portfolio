# error_found — Cybersecurity Portfolio

Personal portfolio of **Aayush Paudel** (error_found) — cybersecurity student, ethical hacker, and CTF player.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide + React Icons, and the GitHub REST API. Dark hacker aesthetic with matrix rain, particle field, interactive terminal, and live GitHub stats.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Personalize

| What | Where |
|---|---|
| Resume PDF | Replace `public/resume.pdf` with your actual CV (keep the filename) |
| Profile photo | `public/images/profile.jpg` (800×800 JPEG) — replace the file to change it |
| All text content (bio, skills, projects, certs, achievements) | `lib/data.ts` — one file drives every section |
| Certificate images | Drop images in `public/certificates/` and reference them from `lib/data.ts` |
| Project screenshots + GitHub links | `public/projects/` + the `github`/`image` fields in `lib/data.ts` |
| Site URL for SEO | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` (`www.aayush-paudel.com.np`) |

## Contact form (EmailJS)

The form falls back to opening the visitor's mail client until EmailJS is configured:

1. Create a free account at [emailjs.com](https://www.emailjs.com/), add a service and a template.
2. Copy `.env.local.example` to `.env.local` and fill in the three keys.
3. Restart the dev server.

## Deploy

Vercel-ready — push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new). Set the three `NEXT_PUBLIC_EMAILJS_*` environment variables in the Vercel project settings.

```bash
npm run build   # verify production build locally
```
