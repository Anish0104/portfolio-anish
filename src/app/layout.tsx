import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BackgroundEffects from "@/components/BackgroundEffects";
import { ThemeProvider } from "./ThemeProvider";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anish-shirodkar.vercel.app"),
  title: "Anish Shirodkar | AI/ML Research Engineer (MSCS @ Rutgers)",
  description: "Master's candidate at Rutgers University specializing in intelligent systems, deep learning, and scalable AI infrastructure. Portfolio and Research Showcase.",
  keywords: ["Anish Shirodkar", "AI Engineer", "ML Researcher", "Rutgers University", "Deep Learning", "NLP Portfolio", "Systems Engineering"],
  openGraph: {
    title: "Anish Shirodkar | AI/ML Research Engineer",
    description: "Orchestrating intelligent systems and scalable AI infrastructure. MSCS @ Rutgers University.",
    url: "https://anish-shirodkar.vercel.app",
    siteName: "Anish Shirodkar Portfolio",
    images: [
      {
        url: "/og-image.png", // Ensure you have this placeholder or provide a valid URL
        width: 1200,
        height: 630,
        alt: "Anish Shirodkar Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anish Shirodkar | AI/ML Research Engineer",
    description: "Orchestrating intelligent systems and scalable AI infrastructure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased font-sans transition-colors duration-500 bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30 overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>
          <Preloader />
          <Navbar />
          {/* Global UI Layers */}
          <div className="fixed inset-0 bg-dot-grid opacity-[var(--dot-opacity)] pointer-events-none -z-30" />
          <div className="fixed inset-0 bg-[var(--background)] -z-40 transition-colors duration-500" />
          <div className="fixed inset-0 opacity-[var(--grain-opacity)] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-20" />
          
          <BackgroundEffects />
          
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
