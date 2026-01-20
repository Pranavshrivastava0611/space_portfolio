"use client";

import { project } from "./project";

// Use getters to ensure Theatre.js methods are accessed only after initialization
export const getMainSheet = () => project.sheet("Main");
export const getPlanetEntrySheet = () => project.sheet("Planet Entry");

// For backward compatibility if needed, but safer to use functions
export const mainSheet = typeof window !== "undefined" ? project.sheet("Main") : null as any;
