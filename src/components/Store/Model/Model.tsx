"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export default function Model(props: any) {
  const modelRef = useRef<any>();
  const { scene } = useGLTF("/store/model/another_pot.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005; // Sekin aylantirish
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[0.1, 0.1, 0.1]}
      position={[0, -1.5, 0]} 
      {...props}
    />
  );
}

