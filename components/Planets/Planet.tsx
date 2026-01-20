"use client";

import { MeshDistortMaterial, Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface PlanetProps {
    position: [number, number, number];
    color: string;
    name: string;
    radius: number;
    hasRings?: boolean;
    wireframe?: boolean;
}

export default function Planet({ position, color, name, radius, hasRings, wireframe }: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.1;
            meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1;
            atmosphereRef.current.rotation.y = t * 0.05;
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.05;
        }
    });

    return (
        <group position={position}>
            {/* Core Planet */}
            <Sphere
                ref={meshRef}
                args={[radius, 64, 64]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <MeshDistortMaterial
                    color={color}
                    speed={1.5}
                    distort={0.2}
                    radius={radius}
                    emissive={color}
                    emissiveIntensity={hovered ? 1.5 : 0.2}
                    roughness={0.4}
                    metalness={0.8}
                    wireframe={wireframe}
                />
            </Sphere>

            {/* Rings */}
            {hasRings && (
                <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Atmospheric Glow (Outer) */}
            <mesh ref={atmosphereRef} scale={[radius * 1.25, radius * 1.25, radius * 1.25]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Inner Glow / Fresnel placeholder */}
            <mesh scale={[radius * 1.05, radius * 1.05, radius * 1.05]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Floating Label */}
            <group position={[0, radius + 1, 0]}>
                <Text
                    fontSize={0.6}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {name.toUpperCase()}
                </Text>
                <mesh position={[0, -0.2, 0]}>
                    <planeGeometry args={[name.length * 0.3, 0.02]} />
                    <meshBasicMaterial color={color} transparent opacity={0.5} />
                </mesh>
            </group>

            {/* Point light for local illumination */}
            <pointLight intensity={2} distance={radius * 4} color={color} />
        </group>
    );
}
