"use client";

import { CARS_DATA } from "@/config/cars";
import { Sparkles, Layers, RotateCw } from "lucide-react";

interface CarSwitcherProps {
  selectedCarId: "prado" | "sedan" | "hatchback";
  onSelectCar: (id: "prado" | "sedan" | "hatchback") => void;
  manualExplode: number;
  onManualExplodeChange: (val: number) => void;
}

export default function CarSwitcher({
  selectedCarId,
  onSelectCar,
  manualExplode,
  onManualExplodeChange,
}: CarSwitcherProps) {
  const currentCar = CARS_DATA[selectedCarId];
  const carKeys: Array<"prado" | "sedan" | "hatchback"> = ["prado", "sedan", "hatchback"];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl pointer-events-auto">
      <div className="glass-accent rounded-2xl p-3 md:p-3.5 shadow-2xl transition-all duration-300">
        <div className="flex flex-col gap-2.5">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                ACTIVE MODEL:
              </span>
              <span className="text-xs md:text-sm font-bold text-white tracking-wide">
                {currentCar.name}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-amber-200/90 font-mono">
              <Sparkles className="w-3 h-3 text-[#C9A96E]" />
              <span>{currentCar.badge}</span>
            </div>
          </div>

          {/* 3 Model Selector Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {carKeys.map((key) => {
              const car = CARS_DATA[key];
              const isSelected = selectedCarId === key;
              return (
                <button
                  key={key}
                  id={`car-btn-${key}`}
                  onClick={() => onSelectCar(key)}
                  className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-b from-[#C9A96E]/25 to-[#C9A96E]/10 border border-[#C9A96E]/70 text-white shadow-[0_0_20px_rgba(201,169,110,0.25)]"
                      : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs md:text-sm font-bold capitalize">
                    {key === "prado" ? "Prado J250" : key === "sedan" ? "Sedan" : "Hatchback"}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-slate-400 hidden sm:block truncate max-w-full">
                    {car.stats.power} &bull; {car.stats.acceleration}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 w-6 h-[2px] bg-[#C9A96E] rounded-full shadow-[0_0_8px_#C9A96E]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Manual Disassembly Scrub Control */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-1 gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] md:text-[11px] text-slate-300 shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>DISASSEMBLY SCRUB:</span>
            </div>

            <div className="flex items-center gap-2 grow max-w-xs">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={manualExplode}
                onChange={(e) => onManualExplodeChange(parseFloat(e.target.value))}
                className="w-full accent-[#C9A96E] cursor-pointer h-1.5 bg-white/20 rounded-lg"
                title="Manually inspect exploded components"
              />
              <span className="font-mono text-[10px] w-8 text-right text-[#C9A96E]">
                {Math.round(manualExplode * 100)}%
              </span>
            </div>

            {manualExplode > 0 && (
              <button
                onClick={() => onManualExplodeChange(0)}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Reassemble Car"
              >
                <RotateCw className="w-2.5 h-2.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
