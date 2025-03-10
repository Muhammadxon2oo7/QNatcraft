"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X, ArrowRight, HomeIcon, Maximize2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { TextureLoader } from "three"
import { Suspense } from "react"
import { useLoader } from "@react-three/fiber"

interface Craft {
  id: number
  image: string
  panoramaImage?: string
  title: string
  category: string
  description: string
}

const crafts: Craft[] = [
  {
    id: 1,
    image: "/workshop/first.png",
    panoramaImage: "/workshop/workshop1.jpg",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Traditional pottery craftsmanship...",
  },
  {
    id: 2,
    image: "/workshop/second.png",
    panoramaImage: "/workshop/workshop1.jpg",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Craftsmen working together...",
  },
  // ... qolgan craftlar
]

// Panorama komponenti
const Panorama = ({ image, onLoad }: { image: string; onLoad: () => void }) => {
  const texture = useLoader(TextureLoader, image)
  
  useEffect(() => {
    if (texture) onLoad() // Tasvir yuklanganda chaqiriladi
  }, [texture, onLoad])

  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={<div className="text-white text-center">Yuklanmoqda...</div>}>
        <mesh>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={texture} side={2} />
        </mesh>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={1000}
          autoRotate // Avtomatik aylanish qo'shildi
          autoRotateSpeed={0.5} // Aylanish tezligi
        />
      </Suspense>
    </Canvas>
  )
}

export default function CraftDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [isPanorama, setIsPanorama] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  
  // useMemo bilan craft ni optimallashtirish
  const craft = useMemo(
    () => crafts.find((c) => c.id === Number(params.id)) || crafts[0],
    [params.id]
  )

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreen) setIsFullScreen(false)
        else if (isPanorama) setIsPanorama(false)
        else router.push("/workshops")
      }
    },
    [isFullScreen, isPanorama, router]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [handleEsc])

  // Panorama yopilganda Canvas tozalash uchun
  useEffect(() => {
    return () => {
      if (isPanorama) {
        setLoaded(false) // Holatni tozalash
      }
    }
  }, [isPanorama])

  if (!craft) return <div>Craft topilmadi</div>

  const togglePanorama = () => {
    setIsPanorama((prev) => !prev)
    setLoaded(false)
  }

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev)
  }

  const handlePanoramaLoad = () => {
    setLoaded(true)
  }

  return (
    <main className="max-w-[1380px] px-[10px]  mx-auto py-[16px] min-h-screen">
      <header className="flex items-center border-b pb-[16px] mb-[15px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
            <HomeIcon className="text-white" size={14} />
          </div>
          <nav className="text-sm text-gray-600">
            <Link href="/workshops" className="hover:underline">
              Bosh sahifa
            </Link>{" "}
            / <span> Korgazmalar 360° / </span>
            <span className="text-black">{craft.title}</span>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">{craft.title}</h1>
        </div>

        <motion.div
          className={`relative w-full ${
            isFullScreen ? "fixed inset-0 z-50" : "aspect-video max-w-5xl mx-auto mb-8"
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: loaded ? 1 : 0.9, opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isPanorama && craft.panoramaImage ? (
            <Panorama image={craft.panoramaImage} onLoad={handlePanoramaLoad} />
          ) : (
            <Image
              src={craft.image}
              alt={craft.title}
              fill
              className="object-cover rounded-lg"
              onLoadingComplete={() => setLoaded(true)}
              sizes={isFullScreen ? "100vw" : "(max-width: 100%) 100vw, 100%"}
              placeholder="blur"
              blurDataURL="/placeholder.svg"
            />
          )}

          {!isPanorama && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePanorama}
            >
              <div className="relative w-[120px] h-[120px] p-[2px]">
                <div className="absolute inset-0 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="text-red-800 font-bold text-xl">360°</div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-[2px]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-white font-medium">
                    virtual
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-white font-medium">
                    sayohat
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] text-white font-medium">
                    360°
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-white font-medium">
                    qiling
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFullScreen}
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
              aria-label="Toggle Full Screen"
            >
              <Maximize2 size={20} />
            </button>
            <Link href="/workshops" passHref>
              <button
                className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* {!isFullScreen && (
          <div className=" mx-auto pb-12">
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-red-100 text-red-800 font-medium text-sm rounded-full">
                • {craft.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {craft.title} haqida batafsil ma'lumotlar
            </h2>

            <div className="prose max-w-none mb-8 text-gray-700">
              <p className="mb-4">{craft.description}</p>
              <p>Traditional craftsmanship passed down through generations...</p>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
                <span>Profilga o'tish</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )} */}
          <div className="w-full mx-auto pb-12">
            <div className="mb-6">
              <span className="inline-block px-4 py-1 bg-red-100 text-red-800 font-medium text-sm rounded-full">
                • {craft.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {craft.title} haqida batafsil ma'lumotlar
            </h2>

            <div className="prose max-w-none mb-8 text-gray-700">
              <p className="mb-4">{craft.description}</p>
              <p>Traditional craftsmanship passed down through generations...</p>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
                <span>Profilga o'tish</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
      </div>
    </main>
  )
}