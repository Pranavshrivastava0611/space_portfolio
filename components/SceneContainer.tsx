"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SpaceScene from "./SpaceScene";

export default function SceneContainer() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 20, 60], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={null}>
                <SpaceScene />
            </Suspense>
        </Canvas>
    );
}
