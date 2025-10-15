import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';

export default function ThreeScene(): JSX.Element {
  return (
    <div style={{ height: 300 }}>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {/* TODO: add models and interactivity */}
        </Suspense>
        <OrbitControls />
        <ContactShadows position={[0, -1, 0]} opacity={0.5} blur={2} />
      </Canvas>
    </div>
  );
}
