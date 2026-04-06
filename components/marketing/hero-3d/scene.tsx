'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingArchitecture } from './floating-architecture';

export default function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#050505', 6, 16]} />
      <ambientLight intensity={0.35} color="#d8c8a8" />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#f2d9a8" />
      <directionalLight position={[-6, -2, -3]} intensity={0.35} color="#6b7a90" />
      <Suspense fallback={null}>
        <FloatingArchitecture />
      </Suspense>
    </Canvas>
  );
}
