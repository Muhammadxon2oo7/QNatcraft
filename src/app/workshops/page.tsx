// "use client"

// import { useState, useEffect } from "react"
// import { Camera, X, ArrowRight, HomeIcon } from "lucide-react"
// import { AnimatePresence, motion } from "framer-motion"
// import Image from "next/image"

// const crafts = [

// ]

// // CraftCard Component
// function CraftCard({
//   craft,
//   onClick,
// }: {
//   craft: { id: number; image: string; title: string }
//   onClick: () => void
// }) {
//   return (
//     <motion.div
//       className="relative rounded-lg overflow-hidden cursor-pointer group shadow-md"
//       onClick={onClick}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 20 }}
//       whileHover={{ y: -5, transition: { duration: 0.2 } }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="relative aspect-[4/3]">
//         <Image
//           src={craft.image || "/placeholder.svg"}
//           alt={craft.title}
//           fill
//           className="object-cover transition-transform duration-300 group-hover:scale-105"
//           sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
//         />

//         {/* Overlay with gradient */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

//         {/* 360 Camera Badge */}
//         <div className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-sm">
//           <Camera size={16} className="text-red-600" />
//           <span className="text-gray-700">360° kamera</span>
//         </div>

//         {/* Title at bottom */}
//         <div className="absolute bottom-3 left-0 right-0 px-3 flex items-center justify-center">
//           <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
//           <p className="text-white text-sm font-medium">{craft.title}</p>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // CraftDetail Component
// function CraftDetail({
//   craft,
//   onClose,
// }: {
//   craft: { id: number; image: string; title: string; category: string; description: string }
//   onClose: () => void
// }) {
//   const [loaded, setLoaded] = useState(false)

//   // Close on escape key
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose()
//     }
//     window.addEventListener("keydown", handleEsc)
//     return () => window.removeEventListener("keydown", handleEsc)
//   }, [onClose])

//   return (
//     <motion.div
//       className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto mt-[170px]"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >


//       {/* Main content */}
//       <div className="flex-1">
//         {/* Title */}
//         <div className="p-6 text-center">
//           <h1 className="text-2xl md:text-3xl font-bold">{craft.title}</h1>
//         </div>

//         {/* Image with animation */}
//         <motion.div
//           className="relative w-full aspect-video max-w-5xl mx-auto mb-8"
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{
//             scale: loaded ? 1 : 0.9,
//             opacity: loaded ? 1 : 0,
//           }}
//           transition={{ duration: 0.5 }}
//         >
//           <Image
//             src={craft.image || "/placeholder.svg"}
//             alt={craft.title}
//             fill
//             className="object-cover rounded-lg"
//             onLoad={() => setLoaded(true)}
//             sizes="(max-width: 1024px) 100vw, 1024px"
//           />

//           {/* Center logo/watermark */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="relative w-[120px] h-[120px] p-[2px]">
//               <div className="absolute inset-0 rounded-full border-2 border-white/30 flex items-center justify-center">
//                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                   <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
//                     <div className="text-primary font-bold text-xl">360°</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute inset-0 flex items-center justify-center p-[2px]">
//                 <motion.div
//                   className="absolute w-full h-full"
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//                 >
//                   <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] text-white font-medium">
//                     virtual
//                   </div>
//                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] text-white font-medium">
//                     sayohat
//                   </div>
//                   <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] text-white font-medium">360°</div>
//                   <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] text-white font-medium">
//                     qiling
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </div>

//           {/* Close button */}
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
//           >
//             <X size={20} />
//           </button>
//         </motion.div>

//         {/* Content */}
//         <div className="max-w-5xl mx-auto px-6 pb-12">
//           <div className="mb-6">
//             <span className="inline-block px-4 py-1 bg-red-100 text-red-800 font-medium text-sm rounded-full">
//               • {craft.category}
//             </span>
//           </div>

//           <h2 className="text-2xl font-bold mb-6">{craft.title} haqida batafsil ma'lumotlar</h2>

//           <div className="prose max-w-none mb-8">
//             <p className="text-gray-700 mb-4">{craft.description}</p>
//             <p className="text-gray-700">
//               Traditional craftsmanship passed down through generations, preserving cultural heritage and techniques.
//               These artisans demonstrate exceptional skill in creating handmade items that reflect the rich history and
//               artistic traditions of the region.
//             </p>
//           </div>

//           <div className="flex justify-end">
//             <button className="flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
//               <span>Profilga o'tish</span>
//               <ArrowRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // Main Page Component
// export default function Home() {
//   const [selectedCraft, setSelectedCraft] = useState<number | null>(null)

//   const openCraft = (id: number) => {
//     setSelectedCraft(id)
//     // Prevent body scrolling when modal is open
//     document.body.style.overflow = "hidden"
//   }

//   const closeCraft = () => {
//     setSelectedCraft(null)
//     // Restore body scrolling
//     document.body.style.overflow = "auto"
//   }

//   const selectedCraftData = crafts.find((craft) => craft.id === selectedCraft)

//   return (
//     <main className="container mx-auto px-4 py-[16px]">
//           {/* Header */}
//           <header className="flex items-center  border-b pb-[16px] mb-[15px]">
//         <div className="flex items-center gap-2">
//           <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
//             <HomeIcon className="text-white" size={14} />
//           </div>
//           <div className="text-sm text-gray-600">
//             <span>Bosh sahifa / </span>
//             <span>Korgazmalar 360°  </span>
//           </div>
//         </div>
//       </header>
//       <h1 className="text-3xl font-bold text-center mb-8">Biz bilan san’at olamini virtual sayohat qiling!</h1>

//       <div className="relative">
//         {/* Grid of craft cards */}
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, staggerChildren: 0.1 }}
//         >
//           {crafts.map((craft) => (
//             <CraftCard key={craft.id} craft={craft} onClick={() => openCraft(craft.id)} />
//           ))}
//         </motion.div>

//         {/* Detail view modal */}
//         <AnimatePresence>
//           {selectedCraft !== null && selectedCraftData && (
//             <CraftDetail craft={selectedCraftData} onClose={closeCraft} />
//           )}
//         </AnimatePresence>
//       </div>
//     </main>
//   )
// }
"use client"

import { HomeIcon } from "lucide-react"
import { motion } from "framer-motion"
import CraftCard from "@/components/workshop/CraftCard"

const crafts = [
  {
    id: 1,
    image:
      "/workshop/first.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description:
      "Traditional pottery craftsmanship showing a craftsman working with clay in a workshop filled with pottery items on shelves.",
  },
  {
    id: 2,
    image: "/workshop/second.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Craftsmen working together on traditional pottery techniques, passing knowledge through generations.",
  },
  {
    id: 3,
    image: "/workshop/third.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Young apprentices learning the art of pottery from master craftsmen in a traditional setting.",
  },
  {
    id: 4,
    image: "/workshop/fourth.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Craftsmen working on detailed textile patterns using traditional looms and techniques.",
  },
  {
    id: 5,
    image: "/workshop/fifth.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Master artisans demonstrating the intricate process of traditional weaving methods.",
  },
  {
    id: 6,
    image: "/workshop/sixth.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Detailed craftsmanship of decorative items showcasing the rich cultural heritage.",
  },
  {
    id: 7,
    image: "/workshop/seventh.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Traditional clothing and textile arts displayed by a master craftswoman.",
  },
  {
    id: 8,
    image: "/workshop/eighth.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Young artisans learning traditional crafting techniques in a workshop environment.",
  },
  {
    id: 9,
    image: "/workshop/nineth.png",
    title: "Qoriniyoz ota kulolchilik ustaxonasi",
    category: "HAQIDA",
    description: "Colorful traditional crafts and textiles showcasing the vibrant cultural heritage.",
  },
  // ... qolgan craftlar
]




export default function Workshops() {
  return (
    <main className="container mx-auto px-4 py-[16px]">
      <header className="flex items-center border-b pb-[16px] mb-[15px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
            <HomeIcon className="text-white" size={14} />
          </div>
          <nav className="text-sm text-gray-600">
            <span>Bosh sahifa / </span>
            <span>Korgazmalar 360°</span>
          </nav>
        </div>
      </header>

      <h1 className="text-3xl font-bold text-center mb-8">
        Biz bilan san’at olamini virtual sayohat qiling!
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        layout
      >
        {crafts.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </motion.div>
    </main>
  )
}