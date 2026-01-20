"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function AboutWorld({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (coreRef.current) {
            coreRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
            coreRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group ref={groupRef} visible={active}>
            {/* The Core Heart */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#66ff44"
                    emissive="#113300"
                    roughness={0}
                    metalness={1}
                />
            </mesh>

            {/* Orbiting data spheres */}
            {[0, 1, 2].map((i) => (
                <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                    <mesh position={[3, 0, 0]}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshBasicMaterial color="#66ff44" />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[3, 0.01, 16, 100]} />
                        <meshBasicMaterial color="#66ff44" transparent opacity={0.2} />
                    </mesh>
                </group>
            ))}

            <Text
                position={[0, -2, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                BIOMETRIC DATA LOADED
            </Text>
        </group>
    );
}
