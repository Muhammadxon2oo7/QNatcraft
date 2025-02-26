"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";

const Panorama = ({ image }: { image: string }) => {
  const texture = useLoader(TextureLoader, image);

  return (
    <Canvas>
      <Suspense fallback={null}>
        <mesh>
          <sphereGeometry args={[5, 60, 40]} />
          <meshBasicMaterial map={texture} side={2} />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Suspense>
    </Canvas>
  );
};

export default Panorama;
