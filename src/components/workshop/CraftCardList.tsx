// components/workshop/CraftCardList.tsx
"use client";
import { motion } from "framer-motion";
import CraftCard from "@/components/workshop/CraftCard";

interface Craft {
  id: number;
  name: string;
  description: string;
  img: string;
  address: string;
  average_rating: number;
}

interface CraftCardListProps {
  crafts: Craft[];
}

export default function CraftCardList({ crafts }: CraftCardListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {crafts.map((craft) => (
        <CraftCard
          key={craft.id}
          craft={{
            id: craft.id,
            image: craft.img,
            title: craft.name,
            category: "",
            description: craft.description,
          }}
        />
      ))}
    </motion.div>
  );
}