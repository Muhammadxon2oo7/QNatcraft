// src/components/Panorama.tsx
import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface PanoramaProps {
  image: string;
  onClose: () => void;
}

const Panorama: React.FC<PanoramaProps> = ({ image, onClose }) => {
  const proxiedImage = `/api/proxy-image?url=${encodeURIComponent(image)}`;
  const texture = useLoader(TextureLoader, proxiedImage);
  const [zoom, setZoom] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => console.error("Audio play error:", err));
    }
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="relative w-full h-full">
        <Canvas style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={<div className="text-white text-center">Yuklanmoqda...</div>}>
            <mesh scale={[zoom, zoom, zoom]}>
              <sphereGeometry args={[500, 60, 40]} />
              <meshBasicMaterial map={texture} side={THREE.BackSide} />
            </mesh>
            <OrbitControls
              enableZoom={true}
              zoomSpeed={0.5}
              minDistance={100}
              maxDistance={1000}
              enablePan={false}
              rotateSpeed={0.5}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
        <audio ref={audioRef} src="/ambient-sound.mp3" loop />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}
            className="bg-white/80 hover:bg-white rounded-full p-2 text-red-800"
          >
            <ZoomIn size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setZoom((prev) => Math.max(prev - 0.2, 0.5))}
            className="bg-white/80 hover:bg-white rounded-full p-2 text-red-800"
          >
            <ZoomOut size={20} />
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 text-red-800"
        >
          <X size={20} />
        </motion.button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
          Swipe yoki sichqoncha bilan aylantiring, zoom uchun tugmalardan foydalaning
        </div>
      </div>
    </motion.div>
  );
};

export default Panorama;