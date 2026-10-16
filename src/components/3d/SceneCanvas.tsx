"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import CarModel from "./CarModel";
import { CARS_DATA } from "@/config/cars";

interface SceneCanvasProps {
  selectedCarId: "prado" | "sedan" | "hatchback";
  scrollProgressRef: React.RefObject<number>;
  manualExplodeFactor?: number;
}

// ── Studio Lighting Rig ──
function StudioLighting() {
  return (
    <>
      {/* Ambient baseline warmth */}
      <ambientLight intensity={0.65} color="#edf2f7" />

      {/* Main Overhead Key Light */}
      <directionalLight
        position={[6, 9, 7]}
        intensity={2.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Cool Fill Light for metallic paint reflections */}
      <directionalLight
        position={[-7, 5, -4]}
        intensity={1.2}
        color="#93c5fd"
      />

      {/* Dramatic Back Rim Light (creates halo around vehicle silhouette) */}
      <directionalLight
        position={[0, 6, -8]}
        intensity={2.2}
        color="#fef08a"
      />

      {/* Front Low Accent Lights highlighting the grille & wheels */}
      <pointLight position={[-2.5, 0.8, 3.8]} intensity={1.5} color="#ffffff" distance={8} />
      <pointLight position={[2.5, 0.8, 3.8]} intensity={1.5} color="#ffffff" distance={8} />

      {/* Subtle underglow accent */}
      <pointLight position={[0, 0.2, 0]} intensity={0.8} color="#38bdf8" distance={4} />
    </>
  );
}

// ── Showroom Ground & Reflection Ring ──
function ShowroomFloor() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Realistic contact shadows under the chassis and wheels */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.75}
        scale={10}
        blur={1.8}
        far={3.5}
        resolution={512}
        color="#020306"
      />

      {/* Circular studio pedestal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[6.5, 64]} />
        <meshStandardMaterial
          color="#0b0f19"
          roughness={0.4}
          metalness={0.7}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Outer ambient showroom ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <ringGeometry args={[6.4, 6.45, 64]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function SceneCanvas({
  selectedCarId,
  scrollProgressRef,
  manualExplodeFactor,
}: SceneCanvasProps) {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isClient) return null;

  const currentCar = CARS_DATA[selectedCarId];

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        camera={{
          position: isMobile ? [0, 2.5, 9.5] : [0, 2.2, 7.8],
          fov: isMobile ? 48 : 38,
        }}
        gl={{
          antialias: true,
          stencil: false,
          depth: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <Environment preset="city" environmentIntensity={0.45} />
          
          <ShowroomFloor />

          <CarModel
            key={currentCar.modelPath}
            modelPath={currentCar.modelPath}
            scrollProgressRef={scrollProgressRef}
            manualExplodeFactor={manualExplodeFactor}
          />

          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={true}
            minDistance={4.2}
            maxDistance={14.0}
            minPolarAngle={Math.PI / 6} // Don't look completely top-down
            maxPolarAngle={Math.PI / 2.05} // Don't go underneath the showroom floor
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
