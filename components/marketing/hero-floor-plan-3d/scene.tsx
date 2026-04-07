'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Wireframe blueprint floor plan — slim gold lines on transparent
 * background. No solid walls or boxes. Includes dimension cotas
 * extending outside the plan and small furniture markers in line
 * style. Slow Y rotation. Camera placed far enough back so the
 * rotating plan never clips its container.
 */

const GOLD = '#e8c688';
const GOLD_DIM = '#d4b27a';

/**
 * Helper: build a Line2-style segment from a list of [x,y,z] points.
 * Uses BufferGeometry + Line for slim hairlines.
 */
function LineSegment({
  points,
  color = GOLD,
  opacity = 1,
}: {
  points: number[][];
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(points.flat());
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [points]);
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={2} />
    </line>
  );
}

/**
 * Wireframe rectangle in the XZ plane (a wall outline from above)
 */
function Rect({
  x,
  z,
  w,
  d,
  color = GOLD,
  opacity = 1,
}: {
  x: number;
  z: number;
  w: number;
  d: number;
  color?: string;
  opacity?: number;
}) {
  const points = useMemo(
    () => [
      [x - w / 2, 0, z - d / 2],
      [x + w / 2, 0, z - d / 2],
      [x + w / 2, 0, z + d / 2],
      [x - w / 2, 0, z + d / 2],
      [x - w / 2, 0, z - d / 2],
    ],
    [x, z, w, d]
  );
  return <LineSegment points={points} color={color} opacity={opacity} />;
}

function FloorPlan() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += 0.18 * delta;
  });

  // Floor plan dimensions (kept compact so rotation never clips container)
  const W = 3.4;
  const D = 2.4;

  return (
    <group ref={group} position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
      {/* OUTER WALLS — single hairline outline */}
      <LineSegment
        points={[
          [-W / 2, 0, -D / 2],
          [W / 2, 0, -D / 2],
          [W / 2, 0, D / 2],
          [-W / 2, 0, D / 2],
          [-W / 2, 0, -D / 2],
        ]}
      />

      {/* INTERIOR PARTITIONS */}
      {/* Vertical wall splitting bath/main */}
      <LineSegment
        points={[
          [-W * 0.18, 0, -D / 2],
          [-W * 0.18, 0, D * 0.1],
        ]}
      />
      {/* Horizontal wall under kitchen */}
      <LineSegment
        points={[
          [-W * 0.18, 0, -D * 0.1],
          [W * 0.42, 0, -D * 0.1],
        ]}
      />
      {/* Bedroom partition */}
      <LineSegment
        points={[
          [W * 0.05, 0, D * 0.5],
          [W * 0.05, 0, D * 0.1],
          [W * 0.42, 0, D * 0.1],
        ]}
      />

      {/* DOOR ARCS (small quarter-circle line strips) */}
      <DoorArc cx={-W * 0.18} cz={D * 0.1} radius={0.22} startDeg={0} endDeg={90} />
      <DoorArc cx={W * 0.05} cz={D * 0.1} radius={0.22} startDeg={180} endDeg={270} />

      {/* WINDOWS (double parallel hairlines) */}
      <LineSegment points={[[-W * 0.36, 0, -D / 2 - 0.018], [W * 0.0, 0, -D / 2 - 0.018]]} opacity={0.85} />
      <LineSegment points={[[-W * 0.36, 0, -D / 2 + 0.018], [W * 0.0, 0, -D / 2 + 0.018]]} opacity={0.85} />

      <LineSegment points={[[W / 2 + 0.018, 0, -D * 0.18], [W / 2 + 0.018, 0, D * 0.18]]} opacity={0.85} />
      <LineSegment points={[[W / 2 - 0.018, 0, -D * 0.18], [W / 2 - 0.018, 0, D * 0.18]]} opacity={0.85} />

      {/* FURNITURE — light line outlines */}
      {/* Bed (back-right room) */}
      <Rect x={W * 0.28} z={-D * 0.32} w={0.55} d={0.35} color={GOLD_DIM} opacity={0.85} />
      {/* Sofa (front center) */}
      <Rect x={W * 0.22} z={D * 0.3} w={0.7} d={0.22} color={GOLD_DIM} opacity={0.85} />
      {/* Coffee table */}
      <Rect x={W * 0.22} z={D * 0.05} w={0.32} d={0.18} color={GOLD_DIM} opacity={0.7} />
      {/* Kitchen counter */}
      <LineSegment
        points={[
          [-W * 0.16, 0, -D / 2 + 0.05],
          [W * 0.4, 0, -D / 2 + 0.05],
        ]}
        color={GOLD_DIM}
        opacity={0.85}
      />
      {/* Bath bathtub */}
      <Rect x={-W * 0.36} z={-D * 0.18} w={0.16} d={0.45} color={GOLD_DIM} opacity={0.85} />
      {/* Bath WC */}
      <CircleOutline cx={-W * 0.32} cz={D * 0.18} r={0.09} color={GOLD_DIM} opacity={0.8} />
      {/* Bath lavabo */}
      <CircleOutline cx={-W * 0.4} cz={D * 0.32} r={0.07} color={GOLD_DIM} opacity={0.8} />

      {/* DIMENSION COTAS — extending outside the plan, like real plans */}
      {/* Bottom cota: total width with ticks */}
      <LineSegment points={[[-W / 2, 0, D / 2 + 0.25], [W / 2, 0, D / 2 + 0.25]]} color={GOLD} opacity={0.95} />
      <LineSegment points={[[-W / 2, 0, D / 2 + 0.18], [-W / 2, 0, D / 2 + 0.32]]} color={GOLD} opacity={0.95} />
      <LineSegment points={[[W / 2, 0, D / 2 + 0.18], [W / 2, 0, D / 2 + 0.32]]} color={GOLD} opacity={0.95} />

      {/* Right cota: depth */}
      <LineSegment points={[[W / 2 + 0.25, 0, -D / 2], [W / 2 + 0.25, 0, D / 2]]} color={GOLD} opacity={0.95} />
      <LineSegment points={[[W / 2 + 0.18, 0, -D / 2], [W / 2 + 0.32, 0, -D / 2]]} color={GOLD} opacity={0.95} />
      <LineSegment points={[[W / 2 + 0.18, 0, D / 2], [W / 2 + 0.32, 0, D / 2]]} color={GOLD} opacity={0.95} />

      {/* Top cota fragment over kitchen */}
      <LineSegment points={[[-W * 0.18, 0, -D / 2 - 0.22], [W * 0.42, 0, -D / 2 - 0.22]]} color={GOLD_DIM} opacity={0.6} />
    </group>
  );
}

function DoorArc({
  cx,
  cz,
  radius,
  startDeg,
  endDeg,
}: {
  cx: number;
  cz: number;
  radius: number;
  startDeg: number;
  endDeg: number;
}) {
  const points = useMemo(() => {
    const segments = 12;
    const arr: number[][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = startDeg + ((endDeg - startDeg) * i) / segments;
      const rad = (t * Math.PI) / 180;
      arr.push([cx + Math.cos(rad) * radius, 0, cz + Math.sin(rad) * radius]);
    }
    return arr;
  }, [cx, cz, radius, startDeg, endDeg]);
  return <LineSegment points={points} color={GOLD_DIM} opacity={0.7} />;
}

function CircleOutline({
  cx,
  cz,
  r,
  color,
  opacity = 1,
}: {
  cx: number;
  cz: number;
  r: number;
  color: string;
  opacity?: number;
}) {
  const points = useMemo(() => {
    const segments = 24;
    const arr: number[][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      arr.push([cx + Math.cos(t) * r, 0, cz + Math.sin(t) * r]);
    }
    return arr;
  }, [cx, cz, r]);
  return <LineSegment points={points} color={color} opacity={opacity} />;
}

export default function FloorPlanScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [5.5, 6.2, 7.5], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      onCreated={({ camera }) => camera.lookAt(0, 1.4, 0)}
    >
      <Suspense fallback={null}>
        <FloorPlan />
      </Suspense>
    </Canvas>
  );
}
