import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://www.aayush-paudel.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aayush Paudel | error_found — Cybersecurity Portfolio",
    template: "%s | error_found",
  },
  description:
    "Aayush Paudel (error_found) — Cybersecurity student, ethical hacker, and penetration testing enthusiast. Explore projects, certifications, CTF achievements, and skills in offensive security, network defense, and digital forensics.",
  keywords: [
    "Aayush Paudel",
    "error_found",
    "cybersecurity portfolio",
    "ethical hacker",
    "penetration tester",
    "CTF player",
    "Nepal cybersecurity student",
    "network security",
    "digital forensics",
  ],
  authors: [{ name: "Aayush Paudel", url: siteUrl }],
  creator: "Aayush Paudel",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Aayush Paudel | error_found — Cybersecurity Portfolio",
    description:
      "Cybersecurity student, ethical hacker, and penetration testing enthusiast. Explore projects, certifications, and CTF achievements.",
    siteName: "error_found",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aayush Paudel | error_found — Cybersecurity Portfolio",
    description:
      "Cybersecurity student, ethical hacker, and penetration testing enthusiast.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
