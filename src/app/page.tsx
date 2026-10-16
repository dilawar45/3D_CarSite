"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { CARS_DATA } from "@/config/cars";
import Navbar from "@/components/ui/Navbar";
import CarSwitcher from "@/components/ui/CarSwitcher";
import ShowroomSection from "@/components/sections/ShowroomSection";
import SpecsSection from "@/components/sections/SpecsSection";
import Footer from "@/components/sections/Footer";

// Dynamic import for ModelLoader to avoid SSR hydration differences
const ModelLoader = dynamic(() => import("@/components/3d/ModelLoader"), {
  ssr: false,
});

export default function ShowroomPage() {
  const [selectedCarId, setSelectedCarId] = useState<"prado" | "sedan" | "hatchback">("prado");
  const [manualExplode, setManualExplode] = useState<number>(0);
  const scrollProgressRef = useRef<number>(0);

  const currentCar = CARS_DATA[selectedCarId];

  return (
    <main className="relative min-h-screen bg-[#07090e] text-[#F1F5F9] overflow-x-clip">
      {/* 3D Model Loading Overlay with Progress */}
      <ModelLoader />

      {/* Floating Navbar */}
      <Navbar currentCarName={currentCar.name} />

      {/* 400vh Scroll-Driven 3D Showroom (Disassembly 0-70% & Reassembly 70-100%) */}
      <ShowroomSection
        selectedCarId={selectedCarId}
        scrollProgressRef={scrollProgressRef}
        manualExplodeFactor={manualExplode > 0 ? manualExplode : undefined}
      />

      {/* Floating Car Switcher Panel ("Prado", "Sedan", "Hatchback") */}
      <CarSwitcher
        selectedCarId={selectedCarId}
        onSelectCar={(id) => {
          setSelectedCarId(id);
          setManualExplode(0);
        }}
        manualExplode={manualExplode}
        onManualExplodeChange={setManualExplode}
      />

      {/* In-depth Specifications & Engineering Dossier */}
      <SpecsSection selectedCarId={selectedCarId} />

      {/* Footer */}
      <Footer />
    </main>
  );
}
