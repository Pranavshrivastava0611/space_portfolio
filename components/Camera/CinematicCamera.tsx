"use client";

import { planetsData } from "@/components/Planets/planets.data";
import { getMainSheet } from "@/theatre/sheets";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { types } from "@theatre/core";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface CinematicCameraProps {
    planetId: string;
}

export default function CinematicCamera({ planetId }: CinematicCameraProps) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const { camera } = useThree();

    const planet = useMemo(() => planetsData.find(p => p.id === planetId), [planetId]);
    const planetPos = useMemo(() => new THREE.Vector3(...(planet?.position || [0, 0, 0])), [planet]);

    // Initialize the sheet and object inside the component
    const sheet = useMemo(() => getMainSheet(), []);

    // We create a unique object name for each planet's focus to avoid conflicts
    const cameraObj = useMemo(() => sheet.object(`Camera-${planetId}`, {
        position: types.compound({
            x: types.number(camera.position.x), // Start from current
            y: types.number(camera.position.y),
            z: types.number(camera.position.z),
        }),
        rotation: types.compound({
            x: types.number(camera.rotation.x),
            y: types.number(camera.rotation.y),
            z: types.number(camera.rotation.z),
        }),
        fov: types.number(45),
    }, { reconfigure: true }), [sheet, planetId]);

    // Smooth transition from entry position
    const entryPos = useMemo(() => camera.position.clone(), [planetId]);
    const startTime = useRef(Date.now());

    useFrame((state) => {
        if (cameraRef.current && planetPos) {
            const values = cameraObj.value;
            const t = state.clock.getElapsedTime();
            const elapsed = (Date.now() - startTime.current) / 1000;

            if (values && values.position) {
                // Determine base position: either from Theatre.js (if changed from default) 
                // OR interpolated from entry position
                const theaterPos = new THREE.Vector3(values.position.x, values.position.y, values.position.z);

                // If the user hasn't moved the Theatre object away from starting point, 
                // we provide a smooth cinematic approach.
                const isTheaterModified = theaterPos.distanceTo(entryPos) > 0.1;

                let targetBasePos = theaterPos;

                if (!isTheaterModified) {
                    // Default cinematic approach: move closer to planet
                    const dirToPlanet = new THREE.Vector3().subVectors(planetPos, entryPos).normalize();
                    const focusDistance = planet ? planet.radius * 6 : 12;
                    const approachPos = planetPos.clone().sub(dirToPlanet.multiplyScalar(focusDistance));

                    // Smooth lerp into the approach position over 3 seconds
                    const alpha = Math.min(elapsed / 3.0, 1);
                    // Use ease-out for approach
                    const easeAlpha = 1 - Math.pow(1 - alpha, 3);
                    targetBasePos = new THREE.Vector3().lerpVectors(entryPos, approachPos, easeAlpha);
                }

                // Add a subtle dynamic drift/orbit to make it feel alive
                const orbitRange = 0.4;
                const driftX = Math.sin(t * 0.25) * orbitRange;
                const driftY = Math.cos(t * 0.35) * orbitRange;

                cameraRef.current.position.set(
                    targetBasePos.x + driftX,
                    targetBasePos.y + driftY,
                    targetBasePos.z
                );

                // Focus on the planet
                cameraRef.current.lookAt(planetPos);

                cameraRef.current.fov = values.fov || 45;
                cameraRef.current.updateProjectionMatrix();
            }
        }
    });

    useEffect(() => {
        if (sheet.sequence) {
            // Play a short intro sequence or transition
            sheet.sequence.play({ iterationCount: 1, range: [0, 2] }).catch(() => { });
        }
    }, [sheet, planetId]);

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={45}
        />
    );
}
