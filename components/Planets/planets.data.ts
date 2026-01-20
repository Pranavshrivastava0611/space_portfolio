export interface PlanetData {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  radius: number;
  gravityRadius: number;
  hasRings?: boolean;
  wireframe?: boolean;
}

export const planetsData: PlanetData[] = [
  {
    id: "welcome",
    name: "Foundation",
    position: [0, 0, 0],
    color: "#4466ff",
    radius: 2,
    gravityRadius: 10,
    wireframe: true,
  },
  {
    id: "projects",
    name: "Nebula Labs",
    position: [15, 5, -10],
    color: "#ff4466",
    radius: 3,
    gravityRadius: 15,
    hasRings: true,
  },
  {
    id: "about",
    name: "Core Echo",
    position: [-15, -10, -20],
    color: "#66ff44",
    radius: 2.5,
    gravityRadius: 12,
  },
  {
    id: "signal",
    name: "Aether Signal",
    position: [25, -5, 10],
    color: "#44ccff",
    radius: 1.8,
    gravityRadius: 8,
    wireframe: true,
  },
  {
    id: "void",
    name: "Event Horizon",
    position: [-5, 15, -30],
    color: "#ffaa44",
    radius: 4,
    gravityRadius: 20,
    hasRings: true,
  },
  {
    id: "archive",
    name: "Data Frost",
    position: [-20, 5, 5],
    color: "#ffffff",
    radius: 1.5,
    gravityRadius: 7,
  }
];
