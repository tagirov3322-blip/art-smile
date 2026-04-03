"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Tooth({ onReady }: { onReady?: () => void }) {
  const { scene: gltfScene } = useGLTF("/models/zub2.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const readyFired = useRef(false);

  const [scene] = useState(() => {
    const clone = gltfScene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 2.8 / maxDim : 1;
    clone.scale.setScalar(s);
    clone.position.set(-center.x * s, -center.y * s, -center.z * s);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material = mesh.material.clone();
          mesh.material.roughness = 0.15;
          mesh.material.metalness = 0.05;
          mesh.material.envMapIntensity = 1.8;
          mesh.material.needsUpdate = true;
        }
      }
    });

    return clone;
  });

  useEffect(() => {
    return () => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (mesh.material instanceof THREE.Material) mesh.material.dispose();
        }
      });
    };
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Signal ready after first render frame
    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }

    const baseX = -0.15;
    const targetY = pointer.x * 0.4;
    const targetX = baseX - pointer.y * 0.25;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.07;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.07;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/zub2.glb");

export default function ToothScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ pointerEvents: "auto" }}
      frameloop="always"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />
      {/* Rim lights — glow effect around edges */}
      <pointLight position={[0, 2, -3]} intensity={8} color="#a0c4ff" distance={10} decay={2} />
      <pointLight position={[-2, -1, -2.5]} intensity={4} color="#c0d8ff" distance={8} decay={2} />
      <pointLight position={[2, -1, -2.5]} intensity={4} color="#c0d8ff" distance={8} decay={2} />
      <Environment preset="city" environmentIntensity={0.5} />
      <Suspense fallback={null}>
        <Tooth onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
