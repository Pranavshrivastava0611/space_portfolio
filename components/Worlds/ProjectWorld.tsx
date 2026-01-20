"use client";

import { Float, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface ProjectNode {
    id: number;
    title: string;
    description: string;
    position: [number, number, number];
    color: string;
}

const projects: ProjectNode[] = [
    { id: 1, title: "QUANTUM ARCHIVE", description: "DATA VIZ", position: [4, 2, 0], color: "#ff4466" },
    { id: 2, title: "VOID ENGINE", description: "WASM SHADERS", position: [2, -3, 2], color: "#44ffaa" },
    { id: 3, title: "NEBULA OS", description: "R3F FRAMEWORK", position: [-4, 1, -2], color: "#4466ff" },
];

export default function ProjectWorld({ active }: { active: boolean }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle rotation for the whole system
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef} visible={active}>
            {projects.map((proj) => (
                <Float
                    key={proj.id}
                    speed={2}
                    rotationIntensity={0.5}
                    floatIntensity={1}
                    position={proj.position}
                >
                    <group>
                        {/* Project Card */}
                        <RoundedBox args={[2.5, 1.5, 0.1]} radius={0.1} smoothness={4}>
                            <meshStandardMaterial
                                color="#000"
                                metalness={0.8}
                                roughness={0.2}
                                transparent
                                opacity={0.6}
                            />
                        </RoundedBox>

                        {/* Glow Border */}
                        <mesh scale={[1.05, 1.05, 1.05]}>
                            <boxGeometry args={[2.5, 1.5, 0.05]} />
                            <meshBasicMaterial color={proj.color} transparent opacity={0.2} />
                        </mesh>

                        <Text
                            position={[0, 0.2, 0.1]}
                            fontSize={0.2}
                            color="white"
                            maxWidth={2}
                            textAlign="center"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {proj.title}
                        </Text>

                        <Text
                            position={[0, -0.3, 0.1]}
                            fontSize={0.1}
                            color={proj.color}
                            maxWidth={2}
                            textAlign="center"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {proj.description}
                        </Text>

                        {/* Connection Line to center */}
                        <mesh rotation={[0, 0, Math.atan2(proj.position[1], proj.position[0])]}>
                            <planeGeometry args={[0.01, 2]} />
                            <meshBasicMaterial color={proj.color} transparent opacity={0.3} />
                        </mesh>
                    </group>
                </Float>
            ))}
        </group>
    );
}
