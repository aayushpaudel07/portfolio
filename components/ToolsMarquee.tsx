import { tools } from "@/lib/data";

export default function ToolsMarquee() {
  const items = [...tools, "CTF", "OSINT", "Red Team", "Blue Team"];

  return (
    <div
      className="relative overflow-hidden border-y border-border bg-bg-elevated/40 py-3"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono-tight text-sm text-text-dim"
          >
            {item}
            <span className="text-primary/60">▸</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
