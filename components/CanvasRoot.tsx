"use client";

import { Loader } from "@react-three/drei";
import dynamic from "next/dynamic";

// Dynamically import the canvas part with SSR disabled
const SceneContainer = dynamic(() => import("@/components/SceneContainer"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white font-mono text-xs tracking-widest uppercase">
            Initializing Universe...
        </div>
    )
});

export default function CanvasRoot() {
    return (
        <div className="fixed inset-0 z-0">
            <SceneContainer />
            <Loader />
        </div>
    );
}
