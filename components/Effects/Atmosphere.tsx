"use client";

import { planetsData } from "@/components/Planets/planets.data";
import { useSpaceStore } from "@/lib/store";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Atmosphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { activePlanet } = useSpaceStore();

    const currentPlanetColor = useMemo(() => {
        const p = planetsData.find(p => p.id === activePlanet);
        return p ? new THREE.Color(p.color) : new THREE.Color("#4466ff");
    }, [activePlanet]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color("#4466ff") }
    }), []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.getElapsedTime();

            // Smoothly update color and opacity
            material.uniforms.uColor.value.lerp(currentPlanetColor, 0.05);

            const targetOpacity = activePlanet ? 0.4 : 0;
            material.uniforms.uOpacity.value += (targetOpacity - material.uniforms.uOpacity.value) * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} scale={[50, 50, 50]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                transparent
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                uniforms={uniforms}
                vertexShader={`
                    varying vec3 vPosition;
                    void main() {
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `}
                fragmentShader={`
                    varying vec3 vPosition;
                    uniform float uTime;
                    uniform float uOpacity;
                    uniform vec3 uColor;

                    void main() {
                        float dist = length(vPosition);
                        float glow = pow(0.8 - dist, 2.0);
                        gl_FragColor = vec4(uColor * glow * uOpacity, glow * uOpacity);
                    }
                `}
            />
        </mesh>
    );
}
