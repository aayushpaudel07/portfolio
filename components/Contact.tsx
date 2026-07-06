"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import SectionHeading from "./SectionHeading";
import { profile } from "@/lib/data";

type Status = "idle" | "sending" | "success" | "error";

const contactItems = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
  { icon: MapPin, label: "Location", value: profile.location, href: undefined },
  { icon: FaGithub, label: "GitHub", value: "aayushpaudel07", href: profile.github },
  { icon: FaLinkedinIn, label: "LinkedIn", value: "aayush-paudel", href: profile.linkedin },
];

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      const body = `Name: ${form.name}%0AEmail: ${form.email}%0A%0A${form.message}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        form.subject || "Portfolio contact"
      )}&body=${body}`;
      setStatus("idle");
      return;
    }

    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        { publicKey }
      );
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        index="08"
        slug="contact"
        title="Contact"
        subtitle="Have an opportunity, a CTF team invite, or feedback? Reach out."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {contactItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="glass flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary">
                <span className="rounded-lg border border-border bg-bg-elevated-2 p-2.5 text-primary">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono-tight text-xs uppercase tracking-wide text-text-dim">
                    {item.label}
                  </p>
                  <p className="text-sm text-text">{item.value}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
              >
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass gradient-border space-y-4 rounded-2xl p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono-tight text-xs text-text-dim">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-bg-elevated-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono-tight text-xs text-text-dim">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-border bg-bg-elevated-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1.5 block font-mono-tight text-xs text-text-dim">
              Subject
            </label>
            <input
              id="subject"
              required
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full rounded-lg border border-border bg-bg-elevated-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block font-mono-tight text-xs text-text-dim">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full resize-none rounded-lg border border-border bg-bg-elevated-2 px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="glow-primary inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-mono-tight text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "sending" ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle2 size={16} aria-hidden="true" /> Message sent successfully.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-danger">
              <XCircle size={16} aria-hidden="true" /> Something went wrong. Please email
              directly.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
