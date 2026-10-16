"use client";

import { Shield, ArrowUp, GitBranch } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-30 bg-[#05060a] border-t border-white/10 py-12 px-6 md:px-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C9A96E] to-[#E8D5B0] flex items-center justify-center text-[#07090e]">
            <Shield className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-wider block">
              APEX AUTOMOTIVE
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Interactive 3D Engineering Showcase
            </span>
          </div>
        </div>

        {/* Tech Stack attribution */}
        <div className="text-center md:text-left text-[11px] font-mono text-slate-400">
          Built with Next.js &bull; React Three Fiber &bull; Three.js &bull; GSAP ScrollTrigger &bull; Lenis
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dilawar45/3D_CarSite"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <GitBranch className="w-4 h-4 text-[#C9A96E]" />
            <span>GitHub Repository</span>
          </a>

          <button
            onClick={scrollToTop}
            className="glass hover:bg-white/10 p-2.5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
