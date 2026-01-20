"use client";

import { MeshDistortMaterial, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function WelcomeWorld({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const monolithRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (monolithRef.current) {
            monolithRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            monolithRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.5;
        }
    });

    return (
        <group ref={groupRef} visible={active}>
            {/* The Monolith */}
            <mesh ref={monolithRef}>
                <boxGeometry args={[1, 3, 0.5]} />
                <MeshDistortMaterial
                    color="#4466ff"
                    speed={2}
                    distort={0.1}
                    metalness={1}
                    roughness={0.1}
                    emissive="#112244"
                />
            </mesh>

            {/* Glowing Ring around monolith */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#4466ff" transparent opacity={0.5} />
            </mesh>

            <Text
                position={[0, 2.5, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                SYSTEM ONLINE
            </Text>
        </group>
    );
}
