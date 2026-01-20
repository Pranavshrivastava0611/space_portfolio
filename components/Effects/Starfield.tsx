"use client";

import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Starfield() {
    const starsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <group ref={starsRef}>
            {/* Main distant stars */}
            <Stars
                radius={300}
                depth={60}
                count={20000}
                factor={7}
                saturation={0}
                fade
                speed={1}
            />
            {/* Nearer brighter stars or dust */}
            <Stars
                radius={100}
                depth={50}
                count={1000}
                factor={4}
                saturation={1}
                fade
                speed={2}
            />
            {/* Color accent stars */}
            <Stars
                radius={200}
                depth={100}
                count={500}
                factor={10}
                saturation={1}
                fade
                speed={0.5}
            />
            {/* Distant Galaxies (Localized clusters) */}
            <group position={[100, 50, -200]}>
                <Stars radius={50} depth={20} count={500} factor={2} saturation={1} />
            </group>
            <group position={[-150, -50, -150]} rotation={[0, 0, 1]}>
                <Stars radius={60} depth={25} count={800} factor={3} saturation={1} />
            </group>
        </group>
    );
}
