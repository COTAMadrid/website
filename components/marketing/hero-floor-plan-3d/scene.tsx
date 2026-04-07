'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural isometric floor plan. Built entirely from primitives —
 * no GLB. Outer walls + a couple interior partitions + tiny furniture
 * markers, all in warm gold wireframe lines, slowly rotating on Y.
 */

const GOLD = '#c9a66b';

function Edges({
  args,
  position = [0, 0, 0],
  opacity = 1,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(...args);
    return new THREE.EdgesGeometry(box);
  }, [args]);
  return (
    <lineSegments position={position} geometry={geometry}>
      <lineBasicMaterial color={GOLD} transparent opacity={opacity} />
    </lineSegments>
  );
}

function FloorPlan() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += 0.15 * delta;
  });

  // Floor plan dimensions (scene units, roughly meters/2)
  const W = 4; // outer width
  const D = 3; // outer depth
  const H = 0.9; // wall height
  const T = 0.05; // wall thickness

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial
          color="#0f1f1a"
          transparent
          opacity={0.55}
          roughness={1}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer walls (4) — boxes with edges */}
      {/* Back wall */}
      <Edges args={[W, H, T]} position={[0, H / 2, -D / 2]} />
      {/* Front wall */}
      <Edges args={[W, H, T]} position={[0, H / 2, D / 2]} />
      {/* Left wall */}
      <Edges args={[T, H, D]} position={[-W / 2, H / 2, 0]} />
      {/* Right wall */}
      <Edges args={[T, H, D]} position={[W / 2, H / 2, 0]} />

      {/* Interior partition 1 — splits left third */}
      <Edges args={[T, H, D * 0.55]} position={[-W * 0.18, H / 2, -D * 0.22]} opacity={0.85} />
      {/* Interior partition 2 — short divider */}
      <Edges args={[W * 0.35, H, T]} position={[W * 0.15, H / 2, -D * 0.05]} opacity={0.85} />

      {/* Furniture markers */}
      {/* Bed (box) — back-right room */}
      <mesh position={[W * 0.28, 0.06, -D * 0.28]}>
        <boxGeometry args={[0.7, 0.12, 0.45]} />
        <meshStandardMaterial color={GOLD} transparent opacity={0.55} />
      </mesh>
      {/* Sofa (box) — front-center */}
      <mesh position={[W * 0.05, 0.06, D * 0.28]}>
        <boxGeometry args={[0.85, 0.12, 0.32]} />
        <meshStandardMaterial color={GOLD} transparent opacity={0.55} />
      </mesh>
      {/* Lavabo (low cylinder) — left compartment */}
      <mesh position={[-W * 0.34, 0.06, D * 0.05]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 24]} />
        <meshStandardMaterial color={GOLD} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function FloorPlanScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3, 3, 4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.55} color="#f5e6c8" />
      <directionalLight position={[4, 6, 3]} intensity={0.6} color="#f5e6c8" />
      <Suspense fallback={null}>
        <FloorPlan />
      </Suspense>
    </Canvas>
  );
}
