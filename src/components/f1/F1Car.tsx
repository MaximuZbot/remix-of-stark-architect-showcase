import React, { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

// Store caches on globalThis (window) so they persist across Vite HMR hot-reloads in development.
const originalPositions = ((globalThis as any).__originalPositions = (globalThis as any).__originalPositions || new WeakMap());
const originalMaterials = ((globalThis as any).__originalMaterials = (globalThis as any).__originalMaterials || new WeakMap());

interface F1CarProps {
  wheelRotation?: number;
  steeringAngle?: number;
  drsProgress?: number;
  activeGroup?: string;
  cameraRig?: number;
  viewMode?: "auto" | "showroom" | "cad";
}

export const F1Car: React.FC<F1CarProps> = ({
  wheelRotation = 0,
  steeringAngle = 0,
  drsProgress = 0,
  activeGroup = "none",
  cameraRig = 0,
  viewMode = "auto",
}) => {
  // Load Red Bull RB20 GLB model from public folder
  const { scene } = useGLTF("/models/2024_redbull_rb20.glb") as GLTFResult;

  const currentDrsProgressRef = useRef(0);

  // Cache initial positions and opacities of all components in the GLB scene once
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (!originalPositions.has(child)) {
          originalPositions.set(child, child.position.clone());
        }
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (mat && !originalMaterials.has(mat)) {
              originalMaterials.set(mat, {
                opacity: mat.opacity,
                transparent: mat.transparent,
              });
            }
          });
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    if (scene) {
      console.log("[GLB Load Status] Red Bull RB20 GLB model loaded successfully!", {
        name: scene.name,
        uuid: scene.uuid,
        childrenCount: scene.children?.length
      });
    } else {
      console.log("[GLB Load Status] GLB model is null or loading...");
    }
  }, [scene]);

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
    wheelAngleRef.current += delta * wheelRotation * 2.5;
    if (wheels.lf) wheels.lf.rotation.x = wheelAngleRef.current;
    if (wheels.rf) wheels.rf.rotation.x = wheelAngleRef.current; // Inverted for right side
    if (wheels.rr) wheels.rr.rotation.x = wheelAngleRef.current; // Inverted for right side
    if (wheels.lr) wheels.lr.rotation.x = wheelAngleRef.current;

    // 2. Steering Yaw (rotate hubs around local Z axis)
    if (activeGroup === "wheels") {
      const steer = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.15; // Smooth wobble steering
      if (hubs.lf) hubs.lf.rotation.z = steer;
      if (hubs.rf) hubs.rf.rotation.z = steer;
    } else {
      if (hubs.lf) hubs.lf.rotation.z = 0;
      if (hubs.rf) hubs.rf.rotation.z = 0;
    }

    // 3. DRS Flap lift (rotate around local X axis - inverted and flattened for real F1 aerodynamics)
    currentDrsProgressRef.current = THREE.MathUtils.lerp(
      currentDrsProgressRef.current,
      drsProgress,
      delta * 6.0
    );
    if (drsFlap) drsFlap.rotation.x = -currentDrsProgressRef.current * 0.35;

    // 4. Monochrome CAD Wireframe Transition (Scene 7 Climax)
    const rig = cameraRig || 0;
    // Accelerate transition so it completes 60% of the way through the scroll, giving the user more time to enjoy the monochrome build
    let transitionProgress = Math.max(0, Math.min(1, (rig - 5.0) * 1.66)); // Transitions between Scene 6 (rig=5.0) and Scene 7 (rig=6.0)

    // Override transitionProgress if viewMode is forced via UI toggle
    if (viewMode === "cad") {
      transitionProgress = 1.0;
    } else if (viewMode === "showroom") {
      transitionProgress = 0.0;
    }

    if (scene) {
      scene.traverse((child) => {
        // Ensure all components stay in their original assembled position (reverted dismantling)
        const initialPos = originalPositions.get(child);
        if (initialPos) {
          child.position.copy(initialPos);
        }

        if (child instanceof THREE.Mesh) {
          // A. Fade out regular colored materials to transparent ghost volume
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat) {
            const orig = originalMaterials.get(mat) || { opacity: 1.0, transparent: false };
            
            // Restore original transparency state when CAD mode is fully deactivated/inactive
            mat.transparent = transitionProgress > 0.01 ? true : orig.transparent;
            // Fade opacity down relative to its initial value (down to 8% of original)
            mat.opacity = orig.opacity * (1.0 - transitionProgress * 0.92);
          }

          // B. Fade in the CAD wireframe outline
          const edges = child.getObjectByName("highlight_edges") as THREE.LineSegments | undefined;
          if (edges) {
            const edgeMat = edges.material as THREE.LineBasicMaterial;
            if (edgeMat) {
              // Check if component is highlighted by activeGroup
              let isMatch = false;
              let current: THREE.Object3D | null = child;
              while (current) {
                const parentName = current.name.toLowerCase();
                if (activeGroup === "frontWingNose" && parentName.includes("nose")) {
                  isMatch = true;
                  break;
                }
                if (activeGroup === "rearWing" && (parentName.includes("rwing") || parentName.includes("drs"))) {
                  isMatch = true;
                  break;
                }
                if (activeGroup === "wheels" && (parentName.includes("wheel") || parentName.includes("tire") || parentName.includes("rim") || parentName.includes("hub") || parentName.includes("susp"))) {
                  isMatch = true;
                  break;
                }
                if (activeGroup === "cockpit" && (parentName.includes("halo") || parentName.includes("steer") || parentName.includes("volant") || parentName.includes("appuitete"))) {
                  isMatch = true;
                  break;
                }
                current = current.parent;
              }

              if (isMatch) {
                edgeMat.color.set("#d97706"); // keep gold highlight
                edgeMat.opacity = 0.85;
              } else {
                // Fade in minimalist charcoal wireframe outline (#57534e)
                edgeMat.color.set("#57534e");
                edgeMat.opacity = transitionProgress * 0.45;
              }
            }
          }
        }
      });
    }
  });

  return <primitive object={scene} />;
};

useGLTF.preload("/models/2024_redbull_rb20.glb");

export default F1Car;
