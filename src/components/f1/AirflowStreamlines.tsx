import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AirflowProps {
  speedFactor: number; // Linked to scrollState.current.carDrive
}

// 1. Single Streamline Curve component
const StreamlineCurve: React.FC<{ points: THREE.Vector3[]; speedFactor: number; color?: string }> = ({
  points,
  speedFactor,
  color = "#ca8a04", // High-end gold/amber streamline
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.LineDashedMaterial>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(60);
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [points]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Calculate dynamic speed: always animate slowly, speed up during scrolls
      const absSpeed = Math.abs(speedFactor);
      const direction = speedFactor >= 0 ? 1 : -1;
      const velocity = (1.5 + absSpeed * 2.8) * direction;
      
      // Animate dashOffset to make particles fly along the curve
      materialRef.current.dashOffset -= delta * velocity;
      
      // Dynamic opacity: light up when moving fast
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        absSpeed > 0.1 ? 0.8 : 0.35,
        0.05
      );
    }
  });

  React.useEffect(() => {
    if (lineRef.current) {
      lineRef.current.computeLineDistances();
    }
  }, [geometry]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineDashedMaterial
        ref={materialRef}
        color={color}
        dashSize={0.25}
        gapSize={0.18}
        transparent
        opacity={0.35}
        depthWrite={false}
        linewidth={1}
      />
    </line>
  );
};

// 2. Random Wind Particles layer
const PARTICLE_COUNT = 90;
const WindParticles: React.FC<{ speedFactor: number }> = ({ speedFactor }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds, initialZ] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const initZ = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5; // X spread
      pos[i * 3 + 1] = Math.random() * 1.4 + 0.05; // Y spread (above ground)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9.0; // Z spread
      spd[i] = Math.random() * 1.5 + 0.8;
      initZ[i] = pos[i * 3 + 2];
    }
    return [pos, spd, initZ];
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const absSpeed = Math.abs(speedFactor);
    const direction = speedFactor >= 0 ? 1 : -1;
    // Base flow speed + scroll multiplier
    const baseSpeed = delta * (1.2 + absSpeed * 2.2) * direction;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Wind flows from positive Z (front) to negative Z (rear)
      array[i * 3 + 2] -= baseSpeed * speeds[i];

      // Recycle particles when they exit the wind tunnel boundaries
      if (direction >= 0 && array[i * 3 + 2] < -4.5) {
        array[i * 3] = (Math.random() - 0.5) * 3.5;
        array[i * 3 + 1] = Math.random() * 1.4 + 0.05;
        array[i * 3 + 2] = 4.5;
      } else if (direction < 0 && array[i * 3 + 2] > 4.5) {
        array[i * 3] = (Math.random() - 0.5) * 3.5;
        array[i * 3 + 1] = Math.random() * 1.4 + 0.05;
        array[i * 3 + 2] = -4.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#b45309" // Stone-friendly amber particles
        size={0.024}
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

// 3. Main Airflow Streamlines orchestrator
export const AirflowStreamlines: React.FC<AirflowProps> = ({ speedFactor }) => {
  // Prevent WebGL context crashes in Selenium testing environments (e.g. software rasterizer)
  if (typeof navigator !== "undefined" && navigator.webdriver) {
    return null;
  }

  // Define aerodynamic paths flowing over the F1 car surfaces
  const paths = useMemo(() => {
    return [
      // 1. Centerline flow (nose -> airbox -> rear wing)
      [
        new THREE.Vector3(0, 0.05, 4.2),
        new THREE.Vector3(0, 0.22, 3.0),
        new THREE.Vector3(0, 0.42, 2.0),
        new THREE.Vector3(0, 0.94, 0.6), // Over the halo cell
        new THREE.Vector3(0, 0.78, -0.6), // Down engine intake
        new THREE.Vector3(0, 0.78, -2.0), // Under rear wing
        new THREE.Vector3(0, 0.72, -3.2),
      ],
      // 2. Left Sidepod flow (coke-bottle bottle exit)
      [
        new THREE.Vector3(-0.35, 0.05, 4.0),
        new THREE.Vector3(-0.52, 0.16, 2.8),
        new THREE.Vector3(-0.58, 0.26, 1.4), // Sidepod entry
        new THREE.Vector3(-0.52, 0.32, -0.2), // Sidepod flank
        new THREE.Vector3(-0.38, 0.16, -1.8), // Coke bottle coke-bottle neck
        new THREE.Vector3(-0.38, 0.56, -3.0), // Rear wing flap
      ],
      // 3. Right Sidepod flow
      [
        new THREE.Vector3(0.35, 0.05, 4.0),
        new THREE.Vector3(0.52, 0.16, 2.8),
        new THREE.Vector3(0.58, 0.26, 1.4),
        new THREE.Vector3(0.52, 0.32, -0.2),
        new THREE.Vector3(0.38, 0.16, -1.8),
        new THREE.Vector3(0.38, 0.56, -3.0),
      ],
      // 4. Left Underbody Diffuser flow
      [
        new THREE.Vector3(-0.25, 0.02, 3.8),
        new THREE.Vector3(-0.4, 0.04, 2.0),
        new THREE.Vector3(-0.6, 0.05, 0.5),
        new THREE.Vector3(-0.5, 0.06, -1.2),
        new THREE.Vector3(-0.35, 0.12, -2.8),
      ],
      // 5. Right Underbody Diffuser flow
      [
        new THREE.Vector3(0.25, 0.02, 3.8),
        new THREE.Vector3(0.4, 0.04, 2.0),
        new THREE.Vector3(0.6, 0.05, 0.5),
        new THREE.Vector3(0.5, 0.06, -1.2),
        new THREE.Vector3(0.35, 0.12, -2.8),
      ],
      // 6. Left High wash line (washing over wheels)
      [
        new THREE.Vector3(-0.75, 0.05, 3.3),
        new THREE.Vector3(-0.8, 0.62, 2.1), // Over front wheel
        new THREE.Vector3(-0.72, 0.38, 0.4),
        new THREE.Vector3(-0.76, 0.62, -1.6), // Over rear wheel
        new THREE.Vector3(-0.8, 0.42, -2.8),
      ],
      // 7. Right High wash line
      [
        new THREE.Vector3(0.75, 0.05, 3.3),
        new THREE.Vector3(0.8, 0.62, 2.1),
        new THREE.Vector3(0.72, 0.38, 0.4),
        new THREE.Vector3(0.76, 0.62, -1.6),
        new THREE.Vector3(0.8, 0.42, -2.8),
      ],
    ];
  }, []);

  return (
    <group>
      {/* 3D Streamline Lines */}
      {paths.map((p, i) => (
        <StreamlineCurve key={i} points={p} speedFactor={speedFactor} />
      ))}

      {/* Floating Wind Tunnel Particles */}
      <WindParticles speedFactor={speedFactor} />
    </group>
  );
};

export default AirflowStreamlines;
