import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import F1Car from "./F1Car";
import { Line } from "@react-three/drei";

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
  viewMode: "auto" | "showroom" | "cad";
  bgColor: string;
}

// Camera keyframes for the 7-scene walkthrough choreography
const KEYFRAMES = [
  { pos: [3.2, 0.9, 3.8], target: [-0.7, 0.35, 0.3] },        // Scene 1: Intro (Front 3/4, car shifted right)
  { pos: [1.8, 0.8, 4.2], target: [0.5, 0.25, 2.7] },         // Scene 2: Front Aero (Shifted target X to 0.5, nose moves right)
  { pos: [2.5, 0.6, 2.8], target: [0.83, 0.35, 1.95] },       // Scene 3: Wheels (Front Right Wheel, naturally right-shifted)
  { pos: [1.2, 1.5, 1.9], target: [-0.4, 0.70, 0.84] },       // Scene 4: Cockpit (Halo, shifted target X to -0.4, car moves left)
  { pos: [0.0, 0.82, 0.2], target: [0.0, 0.68, 1.2] },        // Scene 5: Pilot View (Steering Wheel POV, looking forward)
  { pos: [1.6, 0.95, -2.8], target: [-0.5, 0.70, -1.96] },     // Scene 6: Rear Wing (Shifted position closer by ~25% for car size oomph)
  { pos: [3.8, 1.25, 3.8], target: [0.0, 0.08, 0.0] }           // Scene 7: Technical Catalog / CAD Climax (Centered & raised)
];

// Shaders for GPU-accelerated SketchTrack to avoid WebGL context loss from CPU buffer mutation.
const SKETCH_TRACK_VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Wobble along local X using local Y coordinate (which rotates to world Z)
    float wobble = sin(pos.y * 0.15 - uTime * uFreq) * uAmp;
    pos.x += wobble;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const SKETCH_TRACK_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;
  uniform vec3 uColor;
  uniform float uOpacity;

  // Simple hash function for hand-drawn pencil jitter
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.7, 311.1))) * 43758.5453);
  }

  void main() {
    float x = vUv.x;
    float y = vUv.y;
    
    // Scrolling coordinate along length of the road
    float scrollY = y * 10.0 + uTime * uSpeed;
    
    // Discretize time to 12fps to simulate traditional stop-motion/hand-drawn animation jitter
    float timeStep = floor(uTime * 12.0);
    float jitter = (hash(vec2(x, y * 80.0 + timeStep)) - 0.5) * 0.008;
    float xj = x + jitter;

    // Double Pencil Borders
    float border1 = step(0.015, xj) * (1.0 - step(0.025, xj));
    float border2 = step(0.035, xj) * (1.0 - step(0.045, xj));
    float border3 = step(0.955, xj) * (1.0 - step(0.965, xj));
    float border4 = step(0.975, xj) * (1.0 - step(0.985, xj));
    float borders = border1 + border2 + border3 + border4;
    
    // Center Dashed Line
    float centerLine = step(0.49, xj) * (1.0 - step(0.51, xj));
    float dashes = step(0.5, sin(scrollY * 3.0));
    float centerDashes = centerLine * dashes;

    // Fade out road at the front and back edges (length limits)
    float fade = smoothstep(0.0, 0.15, y) * (1.0 - smoothstep(0.85, 1.0, y));
    
    vec3 color = uColor;
    float alpha = uOpacity * fade;
    
    // Charcoal ink color (#57534e matches vec3(0.34, 0.32, 0.30))
    vec3 inkColor = vec3(0.34, 0.32, 0.30);
    
    if (borders > 0.5 || centerDashes > 0.5) {
      color = inkColor;
      // Charcoal pencil texture with dynamic noise gaps
      float lineNoise = 0.5 + 0.5 * hash(vec2(xj * 200.0, y * 300.0 + timeStep));
      alpha = 0.85 * lineNoise * fade;
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

const SketchTrack: React.FC<{ scrollState: React.MutableRefObject<ScrollState>; active: boolean }> = ({ scrollState, active }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Set up uniforms memo to avoid recreation
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAmp: { value: 0.0 },
    uFreq: { value: 1.2 },
    uSpeed: { value: 0.0 },
    uColor: { value: new THREE.Color('#dfdcd6') },
    uOpacity: { value: 0.55 }
  }), []);

  useFrame((state, delta) => {
    if (!active) return;
    const s = scrollState.current;
    const t = state.clock.getElapsedTime();
    
    // Wobble active on wheels scene
    const isWobbleActive = s.activeGroup === "wheels";
    const targetAmp = isWobbleActive ? 0.45 : 0.05;
    
    // Lerp amplitude to prevent sharp changes
    uniforms.uAmp.value = THREE.MathUtils.lerp(uniforms.uAmp.value, targetAmp, delta * 4.0);
    uniforms.uTime.value = t;
    uniforms.uSpeed.value = s.carDrive * 3.5;
  });

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0.015, 0]}
      visible={active}
    >
      <planeGeometry args={[2.7, 32, 1, 128]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={SKETCH_TRACK_VERTEX_SHADER}
        fragmentShader={SKETCH_TRACK_FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// 2. Curved Aerodynamic Streamlines tracing contours of the car
const STREAMLINE_PATHS = [
  // Center chassis
  [
    new THREE.Vector3(0.0, 0.15, 3.5),
    new THREE.Vector3(0.0, 0.35, 2.0),
    new THREE.Vector3(0.0, 0.65, 1.0),
    new THREE.Vector3(0.0, 0.95, 0.2),
    new THREE.Vector3(0.0, 1.15, -0.6),
    new THREE.Vector3(0.0, 0.85, -1.8),
    new THREE.Vector3(0.0, 1.0, -2.6),
    new THREE.Vector3(0.0, 0.9, -4.0)
  ],
  // Left sidepod
  [
    new THREE.Vector3(-0.6, 0.1, 3.5),
    new THREE.Vector3(-0.7, 0.2, 2.2),
    new THREE.Vector3(-0.8, 0.3, 1.4),
    new THREE.Vector3(-0.65, 0.35, 0.5),
    new THREE.Vector3(-0.75, 0.4, -0.8),
    new THREE.Vector3(-0.55, 0.3, -2.0),
    new THREE.Vector3(-0.45, 0.75, -2.8),
    new THREE.Vector3(-0.45, 0.65, -4.0)
  ],
  // Right sidepod
  [
    new THREE.Vector3(0.6, 0.1, 3.5),
    new THREE.Vector3(0.7, 0.2, 2.2),
    new THREE.Vector3(0.8, 0.3, 1.4),
    new THREE.Vector3(0.65, 0.35, 0.5),
    new THREE.Vector3(0.75, 0.4, -0.8),
    new THREE.Vector3(0.55, 0.3, -2.0),
    new THREE.Vector3(0.45, 0.75, -2.8),
    new THREE.Vector3(0.45, 0.65, -4.0)
  ],
  // Left halo & engine cover
  [
    new THREE.Vector3(-0.2, 0.2, 3.5),
    new THREE.Vector3(-0.25, 0.35, 2.0),
    new THREE.Vector3(-0.3, 0.6, 1.0),
    new THREE.Vector3(-0.25, 0.85, 0.2),
    new THREE.Vector3(-0.25, 1.05, -0.8),
    new THREE.Vector3(-0.15, 0.85, -2.0),
    new THREE.Vector3(-0.15, 0.75, -4.0)
  ],
  // Right halo & engine cover
  [
    new THREE.Vector3(0.2, 0.2, 3.5),
    new THREE.Vector3(0.25, 0.35, 2.0),
    new THREE.Vector3(0.3, 0.6, 1.0),
    new THREE.Vector3(0.25, 0.85, 0.2),
    new THREE.Vector3(0.25, 1.05, -0.8),
    new THREE.Vector3(0.15, 0.85, -2.0),
    new THREE.Vector3(0.15, 0.75, -4.0)
  ]
];

const AerodynamicStreamlines: React.FC<{ active: boolean }> = ({ active }) => {
  const curves = useMemo(() => {
    return STREAMLINE_PATHS.map(points => new THREE.CatmullRomCurve3(points));
  }, []);

  const curvesPoints = useMemo(() => {
    return curves.map(curve => curve.getPoints(50));
  }, [curves]);

  const particlesCount = 6;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  const particleStates = useMemo(() => {
    const states: { curveIdx: number; progress: number }[] = [];
    for (let c = 0; c < curves.length; c++) {
      for (let p = 0; p < particlesCount; p++) {
        states.push({
          curveIdx: c,
          progress: p / particlesCount // staggered flow
        });
      }
    }
    return states;
  }, [curves]);

  // Initialize instances to be microscopic at origin on mount to prevent any visual pop/flash
  useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (mesh) {
      tempObject.position.set(0, 0, 0);
      tempObject.scale.setScalar(0.0001);
      tempObject.updateMatrix();
      const totalCount = curves.length * particlesCount;
      for (let i = 0; i < totalCount; i++) {
        mesh.setMatrixAt(i, tempObject.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  }, [curves, tempObject]);

  useFrame((state, delta) => {
    if (!active) return;
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    const speed = 0.55;
    
    particleStates.forEach((pState, idx) => {
      pState.progress += delta * speed;
      // Wrap progress smoothly
      if (pState.progress > 1.0) {
        pState.progress = pState.progress % 1.0;
      }

      const curve = curves[pState.curveIdx];
      const pos = curve.getPointAt(pState.progress);
      
      // Make particles fade out near start/end (clamped to prevent singular matrix WebGL crash)
      const scale = Math.max(0.0001, Math.sin(pState.progress * Math.PI) * 0.025);
      
      tempObject.position.copy(pos);
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      
      mesh.setMatrixAt(idx, tempObject.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group visible={active}>
      {/* 1. Thin Static Curve Paths using Drei Line for absolute stability */}
      {curvesPoints.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color="#06b6d4"
          lineWidth={1}
          transparent
          opacity={0.18}
        />
      ))}

      {/* 2. Flowing Particles using high-performance InstancedMesh */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, curves.length * particlesCount]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
};

const SceneContent: React.FC<F1SceneProps> = ({ scrollState, viewMode, bgColor }) => {
  const { camera } = useThree();
  const carGroupRef = useRef<THREE.Group>(null);
  
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const targetCamPos = useMemo(() => new THREE.Vector3(), []);
  const targetCamLook = useMemo(() => new THREE.Vector3(), []);
  const lastLoggedRef = useRef({ scene: -1, rig: -1 });
  const targetCol = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const s = scrollState.current;
    
    // Lerp background color smoothly
    targetCol.set(bgColor);
    const bg = state.scene.background as THREE.Color;
    if (bg && bg.isColor) {
      bg.lerp(targetCol, delta * 3.5);
      state.gl.setClearColor(bg);
    } else {
      state.scene.background = new THREE.Color(bgColor);
    }
    
    // Position car statically on the ground in the design studio
    if (carGroupRef.current) {
      carGroupRef.current.position.set(0, 0, 0);
      carGroupRef.current.rotation.set(0, 0, 0);
    }

    // Interpolate camera position and target smoothly along the timeline
    const rig = Math.max(0, Math.min(5.999, s.cameraRig || 0));
    const idx = isNaN(rig) ? 0 : Math.floor(rig);
    const frac = isNaN(rig) ? 0 : rig - idx;

    // Log values on change (rounded to 1 decimal place to prevent spam)
    const roundedRig = Math.round(rig * 10) / 10;
    if (idx !== lastLoggedRef.current.scene || roundedRig !== lastLoggedRef.current.rig) {
      console.log(`[F1 Canvas Frame] cameraRig: ${s.cameraRig} (Clamped: ${rig}, NaN check: ${isNaN(rig) || isNaN(s.cameraRig)}), activeScene: ${idx}`);
      lastLoggedRef.current.scene = idx;
      lastLoggedRef.current.rig = roundedRig;
    }

    const k0 = KEYFRAMES[idx] || KEYFRAMES[0];
    const k1 = KEYFRAMES[idx + 1] || k0;

    targetCamPos.fromArray(k0.pos).lerp(new THREE.Vector3().fromArray(k1.pos), frac);
    targetCamLook.fromArray(k0.target).lerp(new THREE.Vector3().fromArray(k1.target), frac);

    // Subtle mouse parallax in Intro (Scene 1) and Final Showcase (Scene 8)
    if (idx === 0 || idx === 7) {
      targetCamPos.x += (s.mouseX || 0) * 0.35;
      targetCamPos.y += (s.mouseY || 0) * 0.25;
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
          cameraRig={scrollState.current.cameraRig}
          viewMode={viewMode}
        />
      </group>

      {/* Infinite floor floorplane that receives shadows seamlessly */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.12} />
      </mesh>

      {/* Temporarily disabled SketchTrack under the car to isolate blank black screen issue */}
      {/* <SketchTrack
        scrollState={scrollState}
        active={scrollState.current.cameraRig >= 0.9 && scrollState.current.cameraRig < 5.9}
      /> */}

      {/* Aerodynamic Wind Tunnel Streamlines active during Scene 7 (Showcase) */}
      {/* <AerodynamicStreamlines active={scrollState.current.cameraRig >= 5.9 && scrollState.current.cameraRig < 6.9} /> */}
    </group>
  );
};

export const F1Scene: React.FC<F1SceneProps> = ({ scrollState, viewMode, bgColor }) => {
  return (
    <div className="fixed inset-0 w-full h-full z-10 overflow-hidden pointer-events-none transition-colors duration-1000" style={{ backgroundColor: bgColor }}>
      <Canvas
        camera={{ position: [0, 1.2, 5], fov: 52, near: 0.1, far: 100 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[bgColor]} />
        
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
          <SceneContent scrollState={scrollState} viewMode={viewMode} bgColor={bgColor} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default F1Scene;
