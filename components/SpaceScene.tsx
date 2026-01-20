"use client";

import Atmosphere from "@/components/Effects/Atmosphere";
import Nebula from "@/components/Effects/Nebula";
import PostProcessing from "@/components/Effects/PostProcessing";
import SpaceDust from "@/components/Effects/SpaceDust";
import Starfield from "@/components/Effects/Starfield";
import Planet from "@/components/Planets/Planet";
import { planetsData } from "@/components/Planets/planets.data";
import AboutWorld from "@/components/Worlds/AboutWorld";
import ProjectWorld from "@/components/Worlds/ProjectWorld";
import WelcomeWorld from "@/components/Worlds/WelcomeWorld";
import { checkGravity } from "@/lib/gravity";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import CinematicCamera from "./Camera/CinematicCamera";
import FreeRoamCamera from "./Camera/FreeRoamCamera";

import { useSpaceStore } from "@/lib/store";

export default function SpaceScene() {
    const { activePlanet, setActivePlanet, isLeaving, setLeaving } = useSpaceStore();
    const { camera } = useThree();
    const lastPlanetPos = useRef(new THREE.Vector3());

    useFrame((state, delta) => {
        if (isLeaving) {
            const planet = planetsData.find(p => p.id === activePlanet);
            if (planet) {
                lastPlanetPos.current.set(...planet.position);
            }

            // Push camera AWAY from the planet
            const pushDir = new THREE.Vector3().subVectors(camera.position, lastPlanetPos.current).normalize();
            camera.position.addScaledVector(pushDir, delta * 25);

            // Check if we are now outside all radii
            let anyInside = false;
            for (const p of planetsData) {
                if (checkGravity(camera.position, new THREE.Vector3(...p.position), p.gravityRadius + 2)) {
                    anyInside = true;
                    break;
                }
            }
            if (!anyInside) {
                setLeaving(false);
                setActivePlanet(null);
            }
            return;
        }

        // Check gravity for all planets
        let found = null;
        for (const planet of planetsData) {
            const isInside = checkGravity(
                camera.position,
                new THREE.Vector3(...planet.position),
                planet.gravityRadius
            );
            if (isInside) {
                found = planet.id;
                break;
            }
        }

        if (found !== activePlanet) {
            setActivePlanet(found);
        }
    });

    return (
        <>
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 5, activePlanet ? 25 : 80]} />

            <ambientLight intensity={0.2} />

            {/* The "Sun" */}
            <group position={[50, 20, -100]}>
                <pointLight intensity={10} distance={500} color="#fff5e6" castShadow />
                <mesh>
                    <sphereGeometry args={[10, 32, 32]} />
                    <meshBasicMaterial color="#fff5e6" />
                </mesh>
            </group>

            <Starfield />
            <Nebula />
            <SpaceDust count={2000} />
            <Atmosphere />

            {planetsData.map((planet) => (
                <Planet
                    key={planet.id}
                    position={planet.position}
                    color={planet.color}
                    name={planet.name}
                    radius={planet.radius}
                    hasRings={planet.hasRings}
                    wireframe={planet.wireframe}
                />
            ))}

            <group position={[15, 5, -10]}>
                <ProjectWorld active={activePlanet === "projects"} />
            </group>

            <group position={[0, 0, 0]}>
                <WelcomeWorld active={activePlanet === "welcome"} />
            </group>

            <group position={[-15, -10, -20]}>
                <AboutWorld active={activePlanet === "about"} />
            </group>

            {activePlanet && !isLeaving ? (
                <CinematicCamera planetId={activePlanet} />
            ) : (
                <FreeRoamCamera />
            )}

            <PostProcessing />
        </>
    );
}
