"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

export default function ModelLoader() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 500);
      }, 300);
      return () => clearTimeout(timer);
    }

    const safety = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    }, 3500);

    return () => clearTimeout(safety);
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#07090e] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-5 px-6 text-center max-w-md">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 text-[#C9A96E] text-xs font-semibold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-ping" />
          Interactive 3D Showroom
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white">
          APEX <span className="gradient-gold-text">AUTOMOTIVE</span>
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Precision Engineering &bull; Exploded Architecture
        </p>

        {/* Progress Bar */}
        <div className="w-56 md:w-72 h-[3px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-[#C9A96E] via-[#38bdf8] to-[#C9A96E] rounded-full transition-all duration-200"
            style={{ width: `${Math.max(10, Math.min(progress, 100))}%` }}
          />
        </div>

        {/* Telemetry info */}
        <div className="flex items-center justify-between w-56 md:w-72 text-[11px] text-slate-400 font-mono">
          <span>CALIBRATING WEBGL</span>
          <span className="text-[#C9A96E] font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
