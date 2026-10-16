"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CARS_DATA, CarData } from "@/config/cars";
import { ChevronDown, Cpu, ShieldCheck, Gauge, Wrench, CheckCircle2 } from "lucide-react";

const SceneCanvas = dynamic(() => import("@/components/3d/SceneCanvas"), {
  ssr: false,
});

interface ShowroomSectionProps {
  selectedCarId: "prado" | "sedan" | "hatchback";
  scrollProgressRef: React.RefObject<number>;
  manualExplodeFactor?: number;
}

export default function ShowroomSection({
  selectedCarId,
  scrollProgressRef,
  manualExplodeFactor,
}: ShowroomSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const explodedCardRef = useRef<HTMLDivElement>(null);
  const reassembleCardRef = useRef<HTMLDivElement>(null);
  const progressBadgeRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const car: CarData = CARS_DATA[selectedCarId];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.1,
      onUpdate: (self) => {
        const p = self.progress;
        if (scrollProgressRef.current !== undefined) {
          (scrollProgressRef as React.MutableRefObject<number>).current = p;
        }

        // 1. Hero Card: visible at start, fades by 22%
        if (heroCardRef.current) {
          const opacity = Math.max(0, 1 - p * 4.5);
          heroCardRef.current.style.opacity = String(opacity);
          heroCardRef.current.style.transform = `translateY(${p * -40}px)`;
          heroCardRef.current.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
        }

        // 2. Exploded View Details: Fades in 25%-35%, stays visible until 65%, fades out by 72%
        if (explodedCardRef.current) {
          let opacity = 0;
          if (p >= 0.22 && p <= 0.35) {
            opacity = (p - 0.22) / 0.13;
          } else if (p > 0.35 && p <= 0.65) {
            opacity = 1;
          } else if (p > 0.65 && p <= 0.72) {
            opacity = 1 - (p - 0.65) / 0.07;
          }
          explodedCardRef.current.style.opacity = String(opacity);
          explodedCardRef.current.style.transform = `translateY(${(1 - opacity) * 20}px)`;
          explodedCardRef.current.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
        }

        // 3. Reassembly Card: Fades in at 72%, stays visible until 100%
        if (reassembleCardRef.current) {
          const opacity = p < 0.72 ? 0 : Math.min(1, (p - 0.72) / 0.12);
          reassembleCardRef.current.style.opacity = String(opacity);
          reassembleCardRef.current.style.transform = `translateY(${(1 - opacity) * 20}px)`;
          reassembleCardRef.current.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
        }

        // 4. Telemetry Header Indicator
        if (progressBadgeRef.current) {
          const stateLabel =
            p < 0.25
              ? "OVERVIEW PROFILE"
              : p < 0.68
              ? `EXPLODED DISASSEMBLY: ${Math.round((p / 0.68) * 100)}%`
              : `PRECISION REASSEMBLY: ${Math.round(((p - 0.68) / 0.32) * 100)}%`;
          progressBadgeRef.current.innerText = `${Math.round(p * 100)}% • ${stateLabel}`;
        }

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${Math.round(p * 100)}%`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scrollProgressRef]);

  return (
    <section ref={sectionRef} className="relative w-full h-[400vh] bg-[#06080d]">
      {/* Sticky Fullscreen 3D Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] rounded-full bg-gradient-to-b from-[#C9A96E]/8 via-[#38bdf8]/4 to-transparent blur-[160px] pointer-events-none" />

        {/* 3D Scene Canvas */}
        <SceneCanvas
          selectedCarId={selectedCarId}
          scrollProgressRef={scrollProgressRef}
          manualExplodeFactor={manualExplodeFactor}
        />

        {/* Top Status & Telemetry Bar */}
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[90%] max-w-md flex flex-col items-center">
          <div className="px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] md:text-xs font-mono tracking-widest text-[#C9A96E] uppercase shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-ping" />
            <span ref={progressBadgeRef}>0% &bull; OVERVIEW PROFILE</span>
          </div>
          <div className="w-36 h-[2px] bg-white/10 rounded-full mt-2 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#C9A96E] to-[#38bdf8] transition-all duration-75"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* PANEL 1: Hero Overview (Scroll 0% -> 25%)                     */}
        {/* ============================================================ */}
        <div
          ref={heroCardRef}
          className="absolute top-28 md:top-32 left-4 md:left-12 max-w-sm md:max-w-md z-20 pointer-events-auto transition-opacity"
        >
          <div className="glass-accent rounded-3xl p-5 md:p-7 backdrop-blur-2xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#C9A96E] text-[11px] font-semibold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {car.badge}
            </div>

            <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {car.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 font-medium leading-relaxed">
              {car.tagline}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-4 pt-3.5 border-t border-white/10 font-mono text-xs">
              <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Engine</span>
                <span className="font-bold text-white text-[11px] truncate block">{car.stats.engine}</span>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Power</span>
                <span className="font-bold text-[#C9A96E] text-xs">{car.stats.power}</span>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Torque</span>
                <span className="font-bold text-white text-xs">{car.stats.torque}</span>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">0-60 MPH</span>
                <span className="font-bold text-[#38bdf8] text-xs">{car.stats.acceleration}</span>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <div className="w-5 h-5 rounded-full border border-[#C9A96E]/60 flex items-center justify-center animate-bounce text-[#C9A96E]">
                <ChevronDown className="w-3 h-3" />
              </div>
              <span>SCROLL TO TRIGGER EXPLODED DISASSEMBLY</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PANEL 2: Exploded Architecture (Scroll 25% -> 68%)           */}
        {/* ============================================================ */}
        <div
          ref={explodedCardRef}
          style={{ opacity: 0 }}
          className="absolute top-28 md:top-32 right-4 md:right-12 max-w-sm md:max-w-md z-20 pointer-events-none transition-opacity"
        >
          <div className="glass-accent rounded-3xl p-5 md:p-7 backdrop-blur-2xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] text-[11px] font-semibold mb-2.5">
              <Wrench className="w-3.5 h-3.5" />
              Exploded Component Architecture
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">
              Kinematic Disassembly
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Every major assembly decouples for high-precision inspection.
            </p>

            <div className="space-y-2.5 my-4 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2.5 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <Cpu className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px]">Power Hood & Bay</span>
                  <span className="text-slate-400 text-[10px]">
                    Bonnet articulates upward highlighting cooling pathways.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <Gauge className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px]">4 Doors & Cabin Cell</span>
                  <span className="text-slate-400 text-[10px]">
                    Translates laterally displaying acoustic seals and safety cage.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                <Wrench className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px]">4-Wheel Radial Hubs</span>
                  <span className="text-slate-400 text-[10px]">
                    All-terrain radial wheels and ventilated brake discs uncouple.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#38bdf8] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
              SCROLL FURTHER (&gt;70%) FOR REASSEMBLY
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PANEL 3: Precision Reassembly (Scroll 72% -> 100%)           */}
        {/* ============================================================ */}
        <div
          ref={reassembleCardRef}
          style={{ opacity: 0 }}
          className="absolute top-28 md:top-32 left-4 md:left-12 max-w-sm md:max-w-md z-20 pointer-events-none transition-opacity"
        >
          <div className="glass-accent rounded-3xl p-5 md:p-7 backdrop-blur-2xl shadow-2xl border-emerald-500/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Assembly Integrity Confirmed
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">
              Precision Reassembly Complete
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              All body panels, hood latches, and 4-wheel torque hubs have returned flush to factory tolerances.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 my-4 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span>Chassis Rigidity</span>
                <span className="font-mono text-emerald-400 font-bold">100% Locked</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Panel Alignment Gap</span>
                <span className="font-mono text-white font-bold">&lt; 0.2 mm</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>4WD Powertrain Sync</span>
                <span className="font-mono text-[#C9A96E] font-bold">Calibrated</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Scroll down to explore comprehensive engineering telemetry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
