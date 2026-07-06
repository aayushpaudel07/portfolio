import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site — export plain HTML/CSS/JS so it can be hosted for free
  // on Cloudflare Pages, Vercel, Netlify, GitHub Pages, etc. with no server.
  output: "export",
  images: {
    // Static export can't use the Next.js image optimizer at runtime.
    unoptimized: true,
  },
  // Emit /about/index.html style paths for clean static hosting.
  trailingSlash: true,
};

export default nextConfig;
