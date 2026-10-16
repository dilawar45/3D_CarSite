"use client";

import { Shield, Compass, GitBranch } from "lucide-react";

interface NavbarProps {
  currentCarName: string;
}

export default function Navbar({ currentCarName }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-3 pointer-events-auto shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C9A96E] to-[#E8D5B0] flex items-center justify-center text-[#07090e] shadow-[0_0_15px_rgba(201,169,110,0.5)]">
            <Shield className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold tracking-wider text-white leading-none">
              APEX <span className="gradient-gold-text">MOTORS</span>
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mt-0.5">
              3D Interactive Showroom
            </p>
          </div>
        </div>

        {/* Orbit / Interactive Hint Pill */}
        <div className="hidden md:flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs text-slate-300 font-mono pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-[#38bdf8] animate-spin" style={{ animationDuration: '8s' }} />
          <span>DRAG 360° &bull; SCROLL TO EXPLODE &bull; PINCH ZOOM</span>
        </div>

        {/* GitHub / Repo Link */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="https://github.com/dilawar45/3D_CarSite"
            target="_blank"
            rel="noopener noreferrer"
            className="glass hover:bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-200 transition-all duration-300 hover:text-white"
            title="View Source on GitHub"
          >
            <GitBranch className="w-4 h-4 text-[#C9A96E]" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
