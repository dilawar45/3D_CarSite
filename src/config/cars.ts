export interface CarData {
  id: "prado" | "sedan" | "hatchback";
  name: string;
  badge: string;
  modelPath: string;
  tagline: string;
  description: string;
  colorName: string;
  stats: {
    power: string;
    torque: string;
    acceleration: string;
    drivetrain: string;
    engine: string;
    transmission: string;
  };
  highlightFeatures: string[];
}

export const CARS_DATA: Record<"prado" | "sedan" | "hatchback", CarData> = {
  prado: {
    id: "prado",
    name: "Toyota Land Cruiser Prado J250",
    badge: "2024+ All-New Flagship",
    modelPath: "/assets/prado.glb",
    tagline: "The Unstoppable Icon Reborn with Rugged Modernity",
    description:
      "Engineered on the GA-F global truck platform with an authentic body-on-frame architecture, electric power steering, full-time 4WD, and an aggressive heritage-inspired squared silhouette.",
    colorName: "Heritage Trail Tan Metallic",
    stats: {
      power: "326 HP",
      torque: "465 lb-ft",
      acceleration: "6.8s (0-60 mph)",
      drivetrain: "Full-Time 4WD + Dual Lockers",
      engine: "2.4L i-FORCE MAX Turbo Hybrid",
      transmission: "8-Speed Direct-Shift Automatic",
    },
    highlightFeatures: [
      "Rigid Body-on-Frame High-Strength Steel Chassis",
      "Front Stabilizer Disconnect Mechanism (SDM)",
      "Multi-Terrain Select with Crawl Control",
      "Signature Squared LED Fascia & Modular Bumpers",
    ],
  },
  sedan: {
    id: "sedan",
    name: "Executive Grand Sedan",
    badge: "Modern Luxury Fastback",
    modelPath: "/assets/sedan.glb",
    tagline: "Aerodynamic Serenity & Whisper-Quiet Velocity",
    description:
      "A low-slung, ultra-slippery fastback profile sculpted for executive touring. Features active acoustic dampening, twin-turbo mild-hybrid power, and torque-vectoring all-wheel agility.",
    colorName: "Imperial Navy Pearl Metallic",
    stats: {
      power: "420 HP",
      torque: "406 lb-ft",
      acceleration: "3.8s (0-60 mph)",
      drivetrain: "Intelligent Torque-Vectoring AWD",
      engine: "3.0L Twin-Turbo V6 Mild-Hybrid",
      transmission: "9-Speed Dual-Clutch Sports-Shift",
    },
    highlightFeatures: [
      "Active Air Suspension with Predictive Damping",
      "Full-Width Edge-to-Edge LED Matrix Light Bar",
      "Streamlined Aero Silhouette (0.23 Cd)",
      "Multi-Layer Sound-Insulating Acoustic Canopy",
    ],
  },
  hatchback: {
    id: "hatchback",
    name: "Sport Hot Hatchback",
    badge: "Pure Athletic Agility",
    modelPath: "/assets/hatchback.glb",
    tagline: "Razor-Sharp Reflexes & Pure Road Connection",
    description:
      "A compact performance weapon engineered for tight corners and explosive mid-range punch. Aggressive aero package, functional roof wing, and lightweight tuned suspension.",
    colorName: "Crimson Velocity Gloss",
    stats: {
      power: "315 HP",
      torque: "310 lb-ft",
      acceleration: "4.7s (0-60 mph)",
      drivetrain: "Mechanical LSD Front-Wheel Drive",
      engine: "2.0L High-Output Turbocharged 4-Cyl",
      transmission: "6-Speed Short-Throw Performance",
    },
    highlightFeatures: [
      "Helical Limited-Slip Differential (LSD)",
      "Functional Downforce Roof Spoiler & Rear Diffuser",
      "Lightweight Alloy Forged Sport Wheels",
      "Track-Bred Dual Exhaust Acoustic Tuning",
    ],
  },
};
