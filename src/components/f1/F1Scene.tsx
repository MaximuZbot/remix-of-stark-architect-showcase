import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import F1Car from "./F1Car";

export interface ScrollState {
  progress: number; // overall page scroll progress (0-1)
  carDrive: number; // wheel rotation speed factor
  cameraRig: number; // transition between camera states
  mouseX: number;
  mouseY: number;
  activeGroup?: string; // active group name to highlight
  drsActive?: boolean; // manual DRS toggle
}

interface F1SceneProps {
  scrollState: React.MutableRefObject<ScrollState>;
}

// Camera keyframes for the museum walkthrough choreography
const KEYFRAMES = [
  { pos: [3.2, 0.9, 3.8], target: [0.0, 0.35, 0.3] },         // Scene 1: Intro (Front 3/4)
  { pos: [1.8, 0.8, 4.2], target: [0.5, 0.25, 2.7] },         // Scene 2: Front Aero (Shifted target X to 0.5, nose moves right)
  { pos: [2.5, 0.6, 2.8], target: [0.83, 0.35, 1.95] },       // Scene 3: Wheels (Front Right Wheel, naturally right-shifted)
  { pos: [1.2, 1.5, 1.9], target: [-0.4, 0.70, 0.84] },       // Scene 4: Cockpit (Halo, shifted target X to -0.4, car moves left)
  { pos: [0.0, 0.82, 0.2], target: [0.0, 0.68, 1.2] },        // Scene 5: Pilot View (Steering Wheel POV, looking forward)
  { pos: [1.6, 0.95, -2.8], target: [-0.5, 0.70, -1.96] },     // Scene 6: Rear Wing (Shifted position closer by ~25% for car size oomph)
  { pos: [3.2, 0.8, 3.8], target: [0.0, 0.25, 0.3] }           // Scene 7: Showcase (Front-right diagonal 3/4 pose matching Image 4)
];

interface SpeedLineData {
  pos: THREE.Vector3;
  length: number;
  speed: number;
}

const WindTunnelLines: React.FC<{ active: boolean }> = ({ active }) => {
  const count = 40;
  const linesRef = useRef<THREE.LineSegments>(null);
  
  // Generate random horizontal speed lines
  const { lineData, positions, colors } = useMemo(() => {
    const lineData: SpeedLineData[] = [];
    const positions = new Float32Array(count * 6); // 2 vertices per line (start & end)
    const colors = new Float32Array(count * 6);
    
    for (let i = 0; i < count; i++) {
      // Random coordinates around the car pod
      const x = (Math.random() - 0.5) * 6;
      const y = Math.random() * 2.2 + 0.1;
      const z = (Math.random() - 0.5) * 10;
      
      const length = Math.random() * 1.5 + 0.5;
      const speed = Math.random() * 12 + 8;
      
      lineData.push({
        pos: new THREE.Vector3(x, y, z),
        length,
        speed
      });
      
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - length;
      
      for (let j = 0; j < 6; j++) {
        colors[i * 6 + j] = 0.85;
      }
    }
    
    return { lineData, positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (!linesRef.current || !active) return;
    const geom = linesRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    
    for (let i = 0; i < count; i++) {
      const line = lineData[i];
      
      line.pos.z -= line.speed * delta;
      
      if (line.pos.z < -6) {
        line.pos.z = 6;
        line.pos.x = (Math.random() - 0.5) * 6;
        line.pos.y = Math.random() * 2.2 + 0.1;
      }
      
      posAttr.setXYZ(i * 2, line.pos.x, line.pos.y, line.pos.z);
      posAttr.setXYZ(i * 2 + 1, line.pos.x, line.pos.y, line.pos.z - line.length);
    }
    
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} visible={active}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.35}
        linewidth={1}
        depthWrite={false}
      />
    </lineSegments>
  );
};

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

    // Subtle mouse parallax in Intro (Scene 1) and Final Showcase (Scene 7)
    if (idx === 0 || idx === 6) {
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
            scrollState.current.drsActive
              ? 1.0
              : scrollState.current.cameraRig >= 5 && scrollState.current.cameraRig < 6
              ? (scrollState.current.cameraRig - 5) // DRS lifts as we scroll into the rear wing scene
              : scrollState.current.cameraRig >= 6
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

      {/* Wind Tunnel Streamlines active during Scene 7 (Showcase) */}
      <WindTunnelLines active={scrollState.current.cameraRig >= 5.9} />
    </group>
  );
};

export const F1Scene: React.FC<F1SceneProps> = ({ scrollState }) => {
  return (
    <div className="fixed inset-0 w-full h-full bg-[#f2f0eb] z-10 overflow-hidden pointer-events-none transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 52, near: 0.1, far: 100 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f0eb"]} />
        
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

        <Suspense fallback={null}>
          <SceneContent scrollState={scrollState} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default F1Scene;
