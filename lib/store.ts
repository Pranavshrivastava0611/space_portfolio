import { create } from "zustand";

interface SpaceState {
    activePlanet: string | null;
    isLeaving: boolean;
    setActivePlanet: (id: string | null) => void;
    setLeaving: (val: boolean) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
    activePlanet: null,
    isLeaving: false,
    setActivePlanet: (id) => set({ activePlanet: id }),
    setLeaving: (val) => set({ isLeaving: val }),
}));
