"use client"
// src/components/VirtualTourCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import Panorama from "./Panorama";

interface VirtualTourCardProps {
  tour: string;
}

const VirtualTourCard: React.FC<VirtualTourCardProps> = ({ tour }) => {
  const [isPanorama, setIsPanorama] = useState(false);

  return (
    <>
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={tour}
          alt="Virtual ko'rgazma"
          width={256}
          height={256}
          className="object-cover w-full h-full"
        />
        <motion.button
          onClick={() => setIsPanorama(true)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 text-red-800"
        >
          <Play size={24} />
        </motion.button>
      </div>
      {isPanorama && <Panorama image={tour} onClose={() => setIsPanorama(false)} />}
    </>
  );
};

export default VirtualTourCard;