'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural isometric floor plan, BUILT FOR VISIBILITY.
 * Solid gold walls (BoxGeometry filled, not just edges), bright opacity,
 * darker more contrasting ground, more furniture, fully readable as a plan.
 */

const GOLD = '#d4b27a';
const GOLD_BRIGHT = '#e8c688';
const GROUND = '#0a1814';

function Wall({
  args,
  position = [0, 0, 0],
}: {
  args: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={GOLD}
        emissive={GOLD}
        emissiveIntensity={0.18}
        roughness={0.55}
        metalness={0.1}
      />
    </mesh>
  );
}

function FloorPlan() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += 0.18 * delta;
  });

  // Floor plan dimensions
  const W = 4;
  const D = 3;
  const H = 0.85;
  const T = 0.12;

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      {/* Ground plane — darker, more visible contrast */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial
          color={GROUND}
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle floor grid lines on the ground (procedural geometry) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[W, D, 8, 6]} />
        <meshBasicMaterial color={GOLD_BRIGHT} wireframe transparent opacity={0.18} />
      </mesh>

      {/* OUTER WALLS — solid boxes */}
      <Wall args={[W, H, T]} position={[0, H / 2, -D / 2]} />
      <Wall args={[W, H, T]} position={[0, H / 2, D / 2]} />
      <Wall args={[T, H, D]} position={[-W / 2, H / 2, 0]} />
      <Wall args={[T, H, D]} position={[W / 2, H / 2, 0]} />

      {/* INTERIOR WALLS — splits into 3 rooms */}
      {/* Vertical partition (separates left bath from main area) */}
      <Wall args={[T, H * 0.92, D * 0.65]} position={[-W * 0.18, (H * 0.92) / 2, -D * 0.18]} />
      {/* Horizontal partition (separates kitchen from salon) */}
      <Wall args={[W * 0.4, H * 0.92, T]} position={[W * 0.18, (H * 0.92) / 2, -D * 0.05]} />
      {/* Bedroom partition */}
      <Wall args={[T, H * 0.92, D * 0.4]} position={[W * 0.05, (H * 0.92) / 2, D * 0.3]} />

      {/* DOOR FRAMES — small gaps in walls indicated by tiny gold posts */}
      {/* Bath entrance post */}
      <mesh position={[-W * 0.18, H * 0.35, D * 0.18]}>
        <boxGeometry args={[T * 1.2, H * 0.7, T * 1.2]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>

      {/* FURNITURE — solid filled */}
      {/* Bed (back-right room) */}
      <mesh position={[W * 0.3, 0.1, -D * 0.3]} castShadow>
        <boxGeometry args={[0.65, 0.18, 0.42]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      {/* 2 pillows */}
      <mesh position={[W * 0.22, 0.21, -D * 0.36]}>
        <boxGeometry args={[0.16, 0.06, 0.12]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[W * 0.34, 0.21, -D * 0.36]}>
        <boxGeometry args={[0.16, 0.06, 0.12]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>

      {/* Sofa (front-right) */}
      <mesh position={[W * 0.22, 0.1, D * 0.28]} castShadow>
        <boxGeometry args={[0.85, 0.18, 0.32]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      {/* Sofa back */}
      <mesh position={[W * 0.22, 0.22, D * 0.36]}>
        <boxGeometry args={[0.85, 0.16, 0.05]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>

      {/* Coffee table */}
      <mesh position={[W * 0.22, 0.06, D * 0.05]}>
        <boxGeometry args={[0.45, 0.04, 0.3]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.25} />
      </mesh>

      {/* Kitchen counter (back-center) */}
      <mesh position={[W * 0.05, 0.1, -D * 0.38]}>
        <boxGeometry args={[0.95, 0.18, 0.18]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} />
      </mesh>
      {/* Stove (2 burners on counter) */}
      <mesh position={[W * 0.0, 0.21, -D * 0.38]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[W * 0.1, 0.21, -D * 0.38]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.4} />
      </mesh>

      {/* Bath fixtures — left compartment */}
      {/* Bathtub */}
      <mesh position={[-W * 0.34, 0.1, -D * 0.18]}>
        <boxGeometry args={[0.2, 0.18, 0.55]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} />
      </mesh>
      {/* WC */}
      <mesh position={[-W * 0.32, 0.1, D * 0.18]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 16]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>
      {/* Lavabo */}
      <mesh position={[-W * 0.4, 0.1, D * 0.32]}>
        <cylinderGeometry args={[0.085, 0.085, 0.12, 16]} />
        <meshStandardMaterial color={GOLD_BRIGHT} emissive={GOLD_BRIGHT} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export default function FloorPlanScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3.2, 3.4, 4.2], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      shadows
    >
      <ambientLight intensity={0.7} color="#fef0d0" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.1}
        color="#fef0d0"
        castShadow
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} color="#a8c8ff" />
      <Suspense fallback={null}>
        <FloorPlan />
      </Suspense>
    </Canvas>
  );
}
