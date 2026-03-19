import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-white mb-3 tracking-tight">
              Anish<span className="text-blue-500">.ai</span>
            </div>
            <p className="text-body !text-white/30 text-sm max-w-xs">
              Building the future with intelligent systems and elegant code.
            </p>
          </div>

          <div className="flex gap-8">
            <a href="https://github.com/Anish0104" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-300 hover:scale-110">
              <Github size={22} />
            </a>
            <a href="https://linkedin.com/in/anish-shirodkar" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--accent-blue)] transition-all duration-300 hover:scale-110">
              <Linkedin size={22} />
            </a>
            <a href="mailto:avs181@scarletmail.rutgers.edu" className="text-[var(--muted)] hover:text-[var(--accent-purple)] transition-all duration-300 hover:scale-110">
              <Mail size={22} />
            </a>
          </div>

          <div className="text-micro-label text-[var(--muted)]/40">
            © {new Date().getFullYear()} Anish Shirodkar
          </div>
        </div>
      </div>
    </footer>
  );
}
