"use client";

import { useState } from "react";
import { CARS_DATA } from "@/config/cars";
import { Zap, Shield, Cog, Activity } from "lucide-react";

interface SpecsSectionProps {
  selectedCarId: "prado" | "sedan" | "hatchback";
}

export default function SpecsSection({ selectedCarId }: SpecsSectionProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "chassis" | "technology">("performance");
  const car = CARS_DATA[selectedCarId];

  return (
    <section id="specifications" className="relative z-30 py-24 px-6 md:px-12 bg-[#07090e] border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 text-[#C9A96E] text-xs font-semibold uppercase tracking-widest mb-3">
              <Activity className="w-3.5 h-3.5" />
              Technical Dossier
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Engineering <span className="gradient-gold-text">Specifications</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
              Precision metrics and structural parameters for the <span className="text-white font-semibold">{car.name}</span>.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="glass p-1.5 rounded-2xl flex items-center gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("performance")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "performance"
                  ? "bg-[#C9A96E] text-[#07090e] shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab("chassis")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "chassis"
                  ? "bg-[#C9A96E] text-[#07090e] shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Chassis & 4WD
            </button>
            <button
              onClick={() => setActiveTab("technology")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "technology"
                  ? "bg-[#C9A96E] text-[#07090e] shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Innovation
            </button>
          </div>
        </div>

        {/* Dynamic Spec Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-2 glass-accent rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C9A96E]" />
                Powertrain Architecture & Dynamic Delivery
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {car.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 font-mono">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Engine Core</span>
                <span className="text-sm font-bold text-white">{car.stats.engine}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Peak Power</span>
                <span className="text-sm font-bold text-[#C9A96E]">{car.stats.power}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Peak Torque</span>
                <span className="text-sm font-bold text-white">{car.stats.torque}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Acceleration</span>
                <span className="text-sm font-bold text-[#38bdf8]">{car.stats.acceleration}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Transmission</span>
                <span className="text-sm font-bold text-white">{car.stats.transmission}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block">Drivetrain</span>
                <span className="text-sm font-bold text-white">{car.stats.drivetrain}</span>
              </div>
            </div>
          </div>

          {/* Key Engineering Highlights Card */}
          <div className="glass-accent rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#38bdf8]" />
                Key Innovations
              </h3>
              <ul className="space-y-3">
                {car.highlightFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] shrink-0 mt-1.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Exterior Finish</span>
                <span className="text-white font-semibold">{car.colorName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
