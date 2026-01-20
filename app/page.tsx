"use client";

import CanvasRoot from "@/components/CanvasRoot";
import { planetsData } from "@/components/Planets/planets.data";
import { useSpaceStore } from "@/lib/store";

export default function Home() {
  const { activePlanet, setLeaving } = useSpaceStore();
  const currentPlanetData = planetsData.find(p => p.id === activePlanet);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* WebGL Scene */}
      <CanvasRoot />

      {/* UI Overlay */}
      <div className="relative z-10 pointer-events-none w-full h-full flex flex-col justify-between p-8 md:p-12">
        <header className="flex justify-between items-start">
          <div className="flex flex-col gap-1 transition-transform duration-700 ease-out"
            style={{ transform: activePlanet ? 'translateY(-20px)' : 'translateY(0)' }}>
            <h1 className="text-2xl font-bold tracking-tighter font-outfit uppercase text-white">
              Stellar <span className="text-purple-500">Portfolio</span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono">EST. 2026 / MULTIVERSE-A1</p>
          </div>

          <nav className="pointer-events-auto flex gap-6 text-sm font-medium text-zinc-400">
            <button className="hover:text-white transition-colors cursor-pointer">MISSION</button>
            <button className="hover:text-white transition-colors cursor-pointer">SYSTEMS</button>
            <button className="hover:text-white transition-colors cursor-pointer">SIGNAL</button>
          </nav>
        </header>

        {/* Central UI for active planet */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`transition-all duration-1000 ease-in-out transform ${activePlanet ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
            {currentPlanetData && (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-[10px] font-mono text-purple-400 tracking-[0.3em] uppercase">
                  Entering Gravity Well
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white">
                  {currentPlanetData.name}
                </h2>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                <p className="max-w-md text-sm text-zinc-400 font-medium leading-relaxed">
                  Initializing holographic section interface. Synchronization at 84%.
                </p>
                <div className="flex gap-4">
                  <button className="pointer-events-auto mt-4 px-8 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-purple-500 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                    INITIALIZE BOOT
                  </button>
                  <button
                    onClick={() => setLeaving(true)}
                    className="pointer-events-auto mt-4 px-8 py-3 border border-white/20 text-white text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95">
                    RETURN TO VOID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <div className={`flex items-center gap-2 transition-opacity duration-500 ${activePlanet ? 'opacity-50' : 'opacity-100'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${activePlanet ? 'bg-purple-500' : 'bg-green-500'}`} />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                {activePlanet ? 'Cinematic Mode' : 'Gravity Stabilized'}
              </span>
            </div>
            <p className="max-w-[150px] text-[10px] leading-relaxed text-zinc-500 font-mono uppercase">
              {activePlanet ? 'Manual control disabled.' : 'Use mouse to drift. Approach planets to focus.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <span className="text-xs font-mono text-purple-500">COORDINATES</span>
            <span className="text-2xl font-bold font-mono tracking-tighter text-white">
              {activePlanet ? 'LOCKED' : '40.7128° N, 74.0060° W'}
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
