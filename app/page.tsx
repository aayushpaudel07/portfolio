import Navbar from "@/components/Navbar";
import GlobalEffects from "@/components/GlobalEffects";
import ToolsMarquee from "@/components/ToolsMarquee";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Achievements from "@/components/Achievements";
import Projects from "@/components/Projects";
import Terminal from "@/components/Terminal";
import GitHubStats from "@/components/GitHubStats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <GlobalEffects />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ToolsMarquee />
        <About />
        <Skills />
        <Certifications />
        <Achievements />
        <Projects />
        <Terminal />
        <GitHubStats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
