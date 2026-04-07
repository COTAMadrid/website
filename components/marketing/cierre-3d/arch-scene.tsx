'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

/**
 * Procedural wireframe archway built from primitives — no GLB.
 * Two columns + a half-torus arch + a base plinth.
 * Slow Y rotation, slight X bob. Wireframe material in warm gold.
 */
function Archway() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.18;
    group.current.rotation.x = Math.sin(t * 0.25) * 0.06;
    group.current.position.y = Math.sin(t * 0.4) * 0.05;
  });

  // Warm gold matching --color-accent
  const wireColor = '#d6b274';

  return (
    <group ref={group} scale={1.05}>
      {/* Left column */}
      <mesh position={[-1.1, -0.1, 0]}>
        <boxGeometry args={[0.32, 2.4, 0.32]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.65} />
      </mesh>
      {/* Right column */}
      <mesh position={[1.1, -0.1, 0]}>
        <boxGeometry args={[0.32, 2.4, 0.32]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.65} />
      </mesh>
      {/* Arch — half torus */}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.1, 0.16, 12, 48, Math.PI]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.7} />
      </mesh>
      {/* Plinth */}
      <mesh position={[0, -1.45, 0]}>
        <boxGeometry args={[2.9, 0.18, 0.6]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.5} />
      </mesh>
      {/* Floor grid disc — subtle */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.2, 48, 1]} />
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function ArchScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={{ position: [0, 0.2, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <Archway />
      </Suspense>
    </Canvas>
  );
}
