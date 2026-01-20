import * as THREE from "three";

export const checkGravity = (
  cameraPosition: THREE.Vector3,
  planetPosition: THREE.Vector3,
  gravityRadius: number
) => {
  const distance = cameraPosition.distanceTo(planetPosition);
  return distance < gravityRadius;
};
