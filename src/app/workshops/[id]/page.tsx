// app/workshops/[id]/page.tsx
"use client";

import { HomeIcon, MapPin, Star, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchCrafts } from "@/lib/api";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { Suspense, useState } from "react";

// Craft interfeysi
interface Craft {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  craftsmen: string[];
  virtualTours: string[];
}

// Panorama komponenti
const Panorama = ({ image, onClose }: { image: string; onClose: () => void }) => {
  const texture = useLoader(TextureLoader, image);

  return (
    <div className="relative w-full h-full">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={<div className="text-white text-center">Yuklanmoqda...</div>}>
          <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
          </mesh>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
      {/* Close tugmasi */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 text-red-800"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Virtual Tour Card komponenti
const VirtualTourCard = ({ tour }: { tour: string }) => {
  const [isPanorama, setIsPanorama] = useState(false);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden">
      {isPanorama ? (
        <Panorama image={tour} onClose={() => setIsPanorama(false)} />
      ) : (
        <>
          <Image
            src={tour}
            alt="Virtual ko'rgazma"
            fill
            className="object-cover"
          />
          {/* Play ikonkasi */}
          <button
            onClick={() => setIsPanorama(true)}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 text-red-800"
          >
            <Play size={24} />
          </button>
        </>
      )}
    </div>
  );
};

// Serverdan ma'lumotlarni olish
async function getCraft(id: string) {
  const { crafts } = await fetchCrafts({ page: 1, limit: 9 });
  return crafts.find((craft) => craft.id === Number(id)) || null;
}

export default async function CraftDetail({ params }: { params: { id: string } }) {
  const craft = await getCraft(params.id);

  if (!craft) return <div className="text-center py-12">Craft topilmadi</div>;

  return (
    <main className="max-w-[1380px] px-[10px] mx-auto py-[16px] min-h-screen">
      {/* Header */}
      <header className="flex items-center border-b pb-[16px] mb-[15px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center">
            <HomeIcon className="text-white" size={14} aria-hidden="true" />
          </div>
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Bosh sahifa
            </Link>{" "}
            /{" "}
            <Link href="/workshops" className="hover:underline">
              Korgazmalar 360°
            </Link>{" "}
            / <span className="text-black">{craft.title}</span>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {/* Rasm qismi */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto mb-8 rounded-lg overflow-hidden">
          <Image
            src={craft.image}
            alt={craft.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 100%) 100vw, 100%"
            placeholder="blur"
            blurDataURL="/placeholder.svg"
          />
          <Link href="/profile">
            <button className="absolute top-4 right-4 flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
              <span>Profilga o'tish</span>
            </button>
          </Link>
        </div>

        {/* Ma'lumotlar qismi */}
        <div className="w-full mx-auto pb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-red-100 text-red-800 font-medium text-sm rounded-full">
              • {craft.category}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {craft.title} haqida batafsil ma'lumotlar
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(craft.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {craft.rating} ({craft.reviews} ta baho)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{craft.location}</span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Hunarmand ustalar:</h3>
            <p className="text-gray-600">{craft.craftsmen.join(", ")}</p>
          </div>

          <div className="prose max-w-none mb-8 text-gray-700">
            <p>{craft.description}</p>
          </div>

          {/* Virtual ko'rgazmalar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Virtual ko'rgazmalar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {craft.virtualTours.map((tour, index) => (
                <VirtualTourCard key={index} tour={tour} />
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
              <span>Koproq ko'rish</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}