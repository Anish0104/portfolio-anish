import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import BrainSection from "@/components/BrainSection";
import HowIThink from "@/components/HowIThink";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      
      <div className="relative z-10 bg-transparent">
        <About />
        <Experience />
        <Skills />
        <Projects />
        <BrainSection />
        <HowIThink />
        <Achievements />
        <Contact />
      </div>
      
      <Footer />
    </main>
  );
}
