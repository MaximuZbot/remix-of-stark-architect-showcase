import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import F1Car from "./F1Car";

export interface ScrollState {
  progress: number; // overall page scroll progress (0-1)
  explode: number; // no longer exploded, used for animations
  blueprint: number; // no longer blueprint grid, used for highlights
  trackGenerate: number;
  carDrive: number; // wheel rotation speed factor
  speedActive: number;
  freeze: number;
  cameraRig: number; // transition between camera states (0: Intro, 1: Aero, 2: Wheels, 3: Cockpit, 4: Rear Wing, 5: Showcase)
  mouseX: number;
  mouseY: number;
  activeGroup?: string; // active group name to highlight
}

interface F1SceneProps {
  scrollState: React.MutableRefObject<ScrollState>;
  curve?: THREE.CatmullRomCurve3; // Kept optional for backward compatibility
}

// Camera keyframes for the museum walkthrough choreography
const KEYFRAMES = [
  { pos: [3.2, 0.9, 3.8], target: [0, 0.35, 0.3] },        // Scene 1: Intro (Front 3/4)
  { pos: [1.0, 0.5, 3.4], target: [0, 0.25, 2.5] },        // Scene 2: Front Aero (Nose/Front Wing)
  { pos: [1.6, 0.35, 2.2], target: [0.83, 0.35, 1.95] },   // Scene 3: Wheels (Front Right Wheel)
  { pos: [0.5, 1.2, 1.2], target: [0, 0.70, 0.84] },       // Scene 4: Cockpit (Halo/Steering Wheel)
  { pos: [1.4, 0.8, -2.6], target: [0, 0.70, -1.96] },      // Scene 5: Rear Wing (DRS Flap Hinge)
  { pos: [-3.0, 0.7, -1.2], target: [0, 0.35, 0.0] }        // Scene 6: Showcase (Rear 3/4 Side)
];

const SceneContent: React.FC<F1SceneProps> = ({ scrollState }) => {
  const { camera } = useThree();
  const carGroupRef = useRef<THREE.Group>(null);
  
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const targetCamPos = useMemo(() => new THREE.Vector3(), []);
  const targetCamLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const s = scrollState.current;
    
    // Position car statically on the ground in the design studio
    if (carGroupRef.current) {
      carGroupRef.current.position.set(0, 0, 0);
      carGroupRef.current.rotation.set(0, 0, 0);
    }

    // Interpolate camera position and target target smoothly along the timeline
    const rig = Math.max(0, Math.min(5.999, s.cameraRig));
    const idx = Math.floor(rig);
    const frac = rig - idx;

    const k0 = KEYFRAMES[idx];
    const k1 = KEYFRAMES[idx + 1] || KEYFRAMES[idx]; // fallback

    targetCamPos.fromArray(k0.pos).lerp(new THREE.Vector3().fromArray(k1.pos), frac);
    targetCamLook.fromArray(k0.target).lerp(new THREE.Vector3().fromArray(k1.target), frac);

    // Subtle mouse parallax in Intro (Scene 1) and Final Showcase (Scene 6)
    if (idx === 0 || idx === 5) {
      targetCamPos.x += s.mouseX * 0.35;
      targetCamPos.y += s.mouseY * 0.25;
    }

    // Smooth cinematic glide easing (Lerp)
    camera.position.lerp(targetCamPos, 0.065);
    cameraTarget.lerp(targetCamLook, 0.065);
    camera.lookAt(cameraTarget);
  });

  return (
    <group>
      {/* 3D Model: F1 Car */}
      <group ref={carGroupRef}>
        <F1Car
          wheelRotation={scrollState.current.carDrive}
          drsProgress={
            scrollState.current.cameraRig >= 4 && scrollState.current.cameraRig < 5
              ? (scrollState.current.cameraRig - 4) // DRS lifts as we scroll into the rear scene
              : scrollState.current.cameraRig >= 5
              ? 1.0
              : 0
          }
          activeGroup={scrollState.current.activeGroup}
        />
      </group>

      {/* Infinite floor floorplane that receives shadows seamlessly */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </group>
  );
};

export const F1Scene: React.FC<F1SceneProps> = ({ scrollState }) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#f9f8f6] z-10 overflow-hidden pointer-events-none transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 52, near: 0.1, far: 100 }}
        shadows
      >
        <color attach="background" args={["#f9f8f6"]} />
        
        {/* Soft, premium studio lighting */}
        <ambientLight intensity={0.75} color="#fcfaf5" />
        
        {/* Main studio spotlight casting soft contact shadows */}
        <directionalLight
          position={[6, 10, 4]}
          intensity={1.6}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Soft warm fill light */}
        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.6}
          color="#fdf9f0"
        />

        <SceneContent scrollState={scrollState} />
      </Canvas>
    </div>
  );
};

export default F1Scene;
