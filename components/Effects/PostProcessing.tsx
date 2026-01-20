"use client";

import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

export default function PostProcessing() {
    return (
        <EffectComposer enableNormalPass={false}>
            <Bloom
                luminanceThreshold={0.1}
                mipmapBlur
                intensity={2.0}
                radius={0.3}
            />
            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL} // blend mode
                offset={new THREE.Vector2(0.001, 0.001)} // offset of the focus
            />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    );
}
