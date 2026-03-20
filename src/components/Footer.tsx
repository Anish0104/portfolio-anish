import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const LINKS = [
  { href: "https://github.com/Anish0104", icon: Github, label: "GitHub", hover: "hover:text-[var(--foreground)]" },
  { href: "https://linkedin.com/in/anish-shirodkar", icon: Linkedin, label: "LinkedIn", hover: "hover:text-[var(--accent-blue)]" },
  { href: "mailto:avs181@scarletmail.rutgers.edu", icon: Mail, label: "Email", hover: "hover:text-[var(--accent-purple)]" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] py-8">
      <div className="flex items-center justify-center gap-8">
        {LINKS.map(({ href, icon: Icon, label, hover }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            className={`text-[var(--muted)] ${hover} transition-all duration-300 hover:scale-110`}
          >
            <Icon size={22} />
          </a>
        ))}
      </div>
    </footer>
  );
}
