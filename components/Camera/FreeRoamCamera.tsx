"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FreeRoamCamera() {
    const { mouse, camera: currentCamera } = useThree();
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    // Movement state
    const move = useRef({ forward: false, backward: false, left: false, right: false, up: false, down: false });
    const velocity = useRef(new THREE.Vector3());
    const lerpRotation = useRef(new THREE.Euler());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || e.key === 'ArrowUp') move.current.forward = true;
            if (key === 's' || e.key === 'ArrowDown') move.current.backward = true;
            if (key === 'a' || e.key === 'ArrowLeft') move.current.left = true;
            if (key === 'd' || e.key === 'ArrowRight') move.current.right = true;
            if (key === ' ' || key === 'spacebar') move.current.up = true;
            if (e.shiftKey) move.current.down = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key === 'w' || e.key === 'ArrowUp') move.current.forward = false;
            if (key === 's' || e.key === 'ArrowDown') move.current.backward = false;
            if (key === 'a' || e.key === 'ArrowLeft') move.current.left = false;
            if (key === 'd' || e.key === 'ArrowRight') move.current.right = false;
            if (key === ' ' || key === 'spacebar') move.current.up = false;
            if (!e.shiftKey) move.current.down = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        if (cameraRef.current && currentCamera) {
            // If coming from another camera, sync position but avoid starting at origin [0,0,0]
            if (currentCamera.position.length() > 0.1) {
                cameraRef.current.position.copy(currentCamera.position);
                cameraRef.current.quaternion.copy(currentCamera.quaternion);
            } else {
                cameraRef.current.position.set(0, 30, 80);
                cameraRef.current.lookAt(0, 0, 0);
            }
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!cameraRef.current) return;

        const cam = cameraRef.current;
        const speed = 1500;
        const friction = 0.94;

        // 1. Handle Movement
        const direction = new THREE.Vector3();
        const front = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);
        const side = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
        const up = new THREE.Vector3(0, 1, 0);

        if (move.current.forward) direction.add(front);
        if (move.current.backward) direction.sub(front);
        if (move.current.left) direction.sub(side);
        if (move.current.right) direction.add(side);
        if (move.current.up) direction.add(up);
        if (move.current.down) direction.sub(up);

        if (direction.length() > 0) {
            velocity.current.addScaledVector(direction.normalize(), speed * delta);
        }

        // Apply movement
        cam.position.addScaledVector(velocity.current, delta);
        velocity.current.multiplyScalar(friction);

        // 2. Handle Rotation
        const targetRotationX = -mouse.y * 0.8;
        const targetRotationY = -mouse.x * 1.2;

        lerpRotation.current.x += (targetRotationX - lerpRotation.current.x) * 0.1;
        lerpRotation.current.y += (targetRotationY - lerpRotation.current.y) * 0.1;

        const t = state.clock.getElapsedTime();
        cam.rotation.set(
            lerpRotation.current.x + Math.sin(t * 0.3) * 0.005,
            lerpRotation.current.y + Math.cos(t * 0.4) * 0.005,
            Math.sin(t * 0.2) * 0.01,
            'YXZ'
        );
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={45}
            near={0.1}
            far={4000}
        />
    );
}
