'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import { MathUtils } from 'three';

const CONCRETE = '#8a8680';
const METAL = '#5e6066';
const LIGHT = '#c9c4bb';
const GOLD = '#c9a66b';

type PieceProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
  children: React.ReactNode;
};

function Piece({ position, rotation = [0, 0, 0], speed = 0.15, children }: PieceProps) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.3;
  });
  return <group ref={ref} position={position} rotation={rotation}>{children}</group>;
}

function DoorFrame() {
  // outer frame built from 3 thin boxes
  const t = 0.12;
  const w = 1.4;
  const h = 2.6;
  return (
    <group>
      <mesh position={[-w / 2, 0, 0]}>
        <boxGeometry args={[t, h, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[t, h, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w + t, t, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.75} metalness={0.15} />
      </mesh>
    </group>
  );
}

function WindowFrame() {
  const s = 1.6;
  const t = 0.08;
  return (
    <group>
      {/* outer */}
      <mesh>
        <boxGeometry args={[s, t, t]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, s, 0]}>
        <boxGeometry args={[s, t, t]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-s / 2, s / 2, 0]}>
        <boxGeometry args={[t, s, t]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[s / 2, s / 2, 0]}>
        <boxGeometry args={[t, s, t]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* cross muntin */}
      <mesh position={[0, s / 2, 0]}>
        <boxGeometry args={[s, t * 0.7, t * 0.7]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, s / 2, 0]}>
        <boxGeometry args={[t * 0.7, s, t * 0.7]} />
        <meshStandardMaterial color={LIGHT} roughness={0.6} metalness={0.2} />
      </mesh>
    </group>
  );
}

function WallPanel({ color = CONCRETE, w = 1.8, h = 1.1 }: { color?: string; w?: number; h?: number }) {
  return (
    <mesh>
      <boxGeometry args={[w, h, 0.08]} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

function IBeam() {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.3]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.08, 1.2, 0.3]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.3]} />
        <meshStandardMaterial color={METAL} roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Column() {
  return (
    <mesh>
      <cylinderGeometry args={[0.22, 0.22, 2.2, 20]} />
      <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.85} emissive={GOLD} emissiveIntensity={0.08} />
    </mesh>
  );
}

export function FloatingArchitecture() {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // slow drift
    groupRef.current.rotation.y += delta * 0.04;
    // damped parallax
    const targetX = pointer.y * 0.12;
    const targetY = pointer.x * 0.18;
    groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.04);
    void targetY;
    groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.3, 0.05);
    groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, pointer.y * 0.2, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Piece position={[2.6, 0.4, -0.5]} rotation={[0.2, -0.4, 0.1]} speed={0.08}>
        <DoorFrame />
      </Piece>
      <Piece position={[-2.8, 0.8, 0.2]} rotation={[-0.15, 0.5, -0.08]} speed={0.11}>
        <WindowFrame />
      </Piece>
      <Piece position={[-1.2, -1.6, -0.8]} rotation={[0.4, 0.2, 0.25]} speed={0.09}>
        <WallPanel />
      </Piece>
      <Piece position={[1.8, -1.8, 0.6]} rotation={[-0.3, -0.2, -0.15]} speed={0.07}>
        <WallPanel color={LIGHT} w={1.4} h={0.9} />
      </Piece>
      <Piece position={[0.2, 1.9, -1.2]} rotation={[0.1, 0.6, 0.1]} speed={0.12}>
        <WallPanel color={METAL} w={1.2} h={0.8} />
      </Piece>
      <Piece position={[3.2, -0.6, 0.4]} rotation={[0.3, 0.4, 0.2]} speed={0.1}>
        <IBeam />
      </Piece>
      <Piece position={[-0.4, 0.1, 1.0]} rotation={[0.1, 0.3, 0.05]} speed={0.06}>
        <Column />
      </Piece>
    </group>
  );
}
