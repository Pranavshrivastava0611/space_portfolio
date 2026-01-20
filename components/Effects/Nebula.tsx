"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface NebulaCloudProps {
  position: [number, number, number];
  colorA: string;
  colorB: string;
  scale: [number, number, number];
  rotation: [number, number, number];
}

function NebulaCloud({ position, colorA, colorB, scale, rotation }: NebulaCloudProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
  }), [colorA, colorB]);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
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
                    uniform vec3 uColorA;
                    uniform vec3 uColorB;

                    float hash(vec3 p) {
                        p = fract(p * 0.3183099 + .1);
                        p *= 17.0;
                        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                    }

                    float noise(vec3 x) {
                        vec3 i = floor(x);
                        vec3 f = fract(x);
                        f = f * f * (3.0 - 2.0 * f);
                        return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                                       mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                                   mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                                       mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
                    }

                    float fbm(vec3 p) {
                        float f = 0.0;
                        f += 0.5000 * noise(p); p *= 2.02;
                        f += 0.2500 * noise(p); p *= 2.03;
                        f += 0.1250 * noise(p); p *= 2.01;
                        f += 0.0625 * noise(p);
                        return f / 0.9375;
                    }

                    void main() {
                        vec3 p = vPosition * 0.5 + uTime * 0.01;
                        float n = fbm(p);
                        
                        // Edge fading
                        float dist = length(vPosition);
                        float edge = smoothstep(1.0, 0.4, dist);
                        
                        vec3 color = mix(uColorA, uColorB, n);
                        gl_FragColor = vec4(color * 0.2 * edge, n * 0.5 * edge);
                    }
                `}
      />
    </mesh>
  );
}

export default function Nebula() {
  return (
    <group>
      {/* Massive background clouds */}
      <NebulaCloud
        position={[0, 0, -50]}
        colorA="#1a1a4a"
        colorB="#4a1a4a"
        scale={[150, 150, 150]}
        rotation={[0, 0, 0]}
      />
      <NebulaCloud
        position={[40, 20, -30]}
        colorA="#2a1010"
        colorB="#4a004a"
        scale={[100, 100, 100]}
        rotation={[1, 1, 0]}
      />
      <NebulaCloud
        position={[-40, -20, -40]}
        colorA="#0a2a2a"
        colorB="#001a4a"
        scale={[120, 120, 120]}
        rotation={[0.5, -0.5, 1]}
      />
    </group>
  );
}
