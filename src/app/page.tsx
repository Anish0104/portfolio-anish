import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import BrainSection from "@/components/BrainSection";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import MarqueeStrip from "@/components/MarqueeStrip";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      <div className="relative z-10 bg-transparent">
        <About />
        <Experience />
        <MarqueeStrip />
        <Skills />
        <Projects />
        <BrainSection />
        <Achievements />
        <Contact />
      </div>

      <Footer />

      <FloatingChat />
      <CommandPalette />
    </main>
  );
}
