// components/workshop/CraftCard.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

interface Craft {
  id: number;
  image: string | 'StaticImport';
  title: string;
  category: string;
  description: string;
}

export default function CraftCard({ craft, }: { craft: Craft }) {
  return (
    <Link href={`/workshops/${craft.id}`} passHref>
      <motion.div
        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        {/* Rasm */}
        <div className="relative h-64">
          <Image
            src={craft.image}
            alt={craft.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            placeholder="blur"
            blurDataURL="/placeholder.svg"
          />
          {/* 360° CAMERA ikonkasi */}
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1 text-xs text-gray-600">
            <Camera size={14} />
            <span>360° CAMERA</span>
          </div>
        </div>
        {/* Sarlavha */}
        <div className="p-4">
          <h3 className="text-base font-medium text-gray-700">{craft.title}</h3>
        </div>
      </motion.div>
    </Link>
  );
}