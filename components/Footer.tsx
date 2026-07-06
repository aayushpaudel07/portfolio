import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-mono-tight text-lg font-semibold text-primary">
          error<span className="text-secondary">_</span>found
        </p>
        <p className="text-sm text-text-dim">
          &quot;Securing today&apos;s systems for a safer tomorrow.&quot;
        </p>

        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
            className="rounded-full border border-border p-2.5 text-text-dim transition-colors hover:border-primary hover:text-primary"
          >
            <FaGithub size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn profile"
            className="rounded-full border border-border p-2.5 text-text-dim transition-colors hover:border-secondary hover:text-secondary"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send an email"
            className="rounded-full border border-border p-2.5 text-text-dim transition-colors hover:border-accent-purple hover:text-accent-purple"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="font-mono-tight text-xs text-text-dim/70">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
