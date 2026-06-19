import React, { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

interface F1CarProps {
  wheelRotation?: number;
  steeringAngle?: number;
  drsProgress?: number;
  activeGroup?: string;
}

export const F1Car: React.FC<F1CarProps> = ({
  wheelRotation = 0,
  steeringAngle = 0,
  drsProgress = 0,
  activeGroup = "none",
}) => {
  // Load Red Bull RB20 GLB model from public folder
  const { scene } = useGLTF("/models/2024_redbull_rb20.glb") as GLTFResult;

  const nodesRef = useRef<{
    wheels: Record<string, THREE.Object3D | null>;
    hubs: Record<string, THREE.Object3D | null>;
    drsFlap: THREE.Object3D | null;
  }>({
    wheels: { lf: null, rf: null, rr: null, lr: null },
    hubs: { lf: null, rf: null },
    drsFlap: null,
  });

  // Find components by hierarchy names on mount
  useEffect(() => {
    if (scene) {
      nodesRef.current.wheels.lf = scene.getObjectByName("WHEEL_LF_60_97") || null;
      nodesRef.current.wheels.rf = scene.getObjectByName("WHEEL_RF_78_120") || null;
      nodesRef.current.wheels.rr = scene.getObjectByName("WHEEL_RR_92_138") || null;
      nodesRef.current.wheels.lr = scene.getObjectByName("WHEEL_LR_132_184") || null;

      nodesRef.current.hubs.lf = scene.getObjectByName("HUB_LF_61_87") || null;
      nodesRef.current.hubs.rf = scene.getObjectByName("HUB_RF_79_110") || null;

      nodesRef.current.drsFlap = scene.getObjectByName("FLAP_DRS_210_333") || null;
    }
  }, [scene]);

  // Inject glowing CAD outlines as child line segments on meshes once
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const oldEdges = child.getObjectByName("highlight_edges");
          if (oldEdges) child.remove(oldEdges);

          const edgesGeometry = new THREE.EdgesGeometry(child.geometry, 20);
          const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xd97706, // Glowing amber/gold highlight
            linewidth: 1.5,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          });
          const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
          edges.name = "highlight_edges";
          child.add(edges);
        }
      });
    }
  }, [scene]);

  // Update outlines opacity dynamically based on activeGroup
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const edges = child.getObjectByName("highlight_edges") as THREE.LineSegments | undefined;
          if (edges) {
            let isMatch = false;
            let current: THREE.Object3D | null = child;
            while (current) {
              const name = current.name.toLowerCase();
              if (activeGroup === "frontWingNose" && name.includes("nose")) {
                isMatch = true;
                break;
              }
              if (activeGroup === "rearWing" && (name.includes("rwing") || name.includes("drs"))) {
                isMatch = true;
                break;
              }
              if (activeGroup === "wheels" && (name.includes("wheel") || name.includes("tire") || name.includes("rim") || name.includes("hub") || name.includes("susp"))) {
                isMatch = true;
                break;
              }
              if (activeGroup === "cockpit" && (name.includes("halo") || name.includes("steer") || name.includes("volant") || name.includes("appuitete"))) {
                isMatch = true;
                break;
              }
              current = current.parent;
            }
            const mat = edges.material as THREE.LineBasicMaterial;
            mat.opacity = isMatch ? 0.85 : 0.0;
          }
        }
      });
    }
  }, [scene, activeGroup]);

  const wheelAngleRef = useRef(0);

  // Apply rotations in useFrame directly for 60fps performance
  useFrame((state, delta) => {
    const { wheels, hubs, drsFlap } = nodesRef.current;

    // 1. Wheel Rotation (spin around local X axis dynamically based on scroll drive speed factor)
    wheelAngleRef.current -= delta * wheelRotation * 2.5;
    if (wheels.lf) wheels.lf.rotation.x = wheelAngleRef.current;
    if (wheels.rf) wheels.rf.rotation.x = -wheelAngleRef.current; // Inverted for right side
    if (wheels.rr) wheels.rr.rotation.x = -wheelAngleRef.current; // Inverted for right side
    if (wheels.lr) wheels.lr.rotation.x = wheelAngleRef.current;

    // 2. Steering Yaw (rotate hubs around local Z axis)
    if (activeGroup === "wheels") {
      const steer = Math.sin(state.clock.getElapsedTime() * 2.5) * 0.15; // Smooth wobble steering
      if (hubs.lf) hubs.lf.rotation.z = steer;
      if (hubs.rf) hubs.rf.rotation.z = steer;
    } else {
      if (hubs.lf) hubs.lf.rotation.z = 0;
      if (hubs.rf) hubs.rf.rotation.z = 0;
    }

    // 3. DRS Flap lift (rotate around local X axis)
    if (drsFlap) drsFlap.rotation.x = drsProgress * 0.85;
  });

  return <primitive object={scene} />;
};

useGLTF.preload("/models/2024_redbull_rb20.glb");

export default F1Car;
