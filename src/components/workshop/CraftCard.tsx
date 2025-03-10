"use client"

import { Camera } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Craft {
  id: number
  image: string
  title: string
}

export default function CraftCard({ craft }: { craft: Craft }) {
  return (
    <Link href={`/workshops/${craft.id}`} passHref>
      <motion.div
        className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={craft.image}
            alt={craft.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="/placeholder.svg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-sm">
            <Camera size={16} className="text-red-600" />
            <span className="text-gray-700">360° kamera</span>
          </div>

          <div className="absolute bottom-3 left-0 right-0 px-3 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <p className="text-white text-sm font-medium truncate">{craft.title}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}