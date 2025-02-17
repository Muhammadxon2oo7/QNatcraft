"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { timelineData } from "./data"

export default function AnimatedTimeline() {
  const [activeId, setActiveId] = useState(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] p-0 max-w-[1360px] mx-auto bg-white rounded-xl mb-[140px]">
  {/* Left Column: Timeline */}
  <div className="space-y-8 relative bg-[#f6f6f6] rounded-[24px] p-[40px] overflow-hidden order-2 md:order-1">
    {/* Progress bar */}
    <motion.div
      className="absolute left-[55px] top-[80px] w-[4px] bg-primary rounded-full"
      style={{
        height: "calc(100% - 4rem)",
        originY: 0,
      }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: (activeId - 1) / (timelineData.length - 1) }}
      transition={{ duration: 0.5 }}
    />
  
    {timelineData.map((item) => (
      <motion.div
        key={item.id}
        className="flex gap-4 items-start relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: item.id * 0.1 }}
      >
        <button
          onClick={() => setActiveId(item.id)}
          className="flex-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
        >
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors duration-200 ${
              item.id <= activeId
                ? "bg-primary text-white"
                : "bg-[#FCDBDB] text-amber-700 group-hover:bg-[#FCDBDB]"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {item.id}
          </motion.div>
        </button>
        <div
          className={`space-y-2 transition-colors duration-200 ${
            activeId >= item.id ? "opacity-100" : "opacity-60"
          }`}
        >
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => setActiveId(item.id)}
            style={{
              color: item.id <= activeId ? "#71090D" : "#4B5563",
            }}
          >
            {item.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Right Column: Image */}
  <div className="relative h-[230px] md:h-auto overflow-hidden rounded-[24px] order-1 md:order-2">
    <AnimatePresence mode="wait">
      {timelineData.map(
        (item) =>
          activeId === item.id && (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={item.id === 1}
              />
            </motion.div>
          )
      )}
    </AnimatePresence>
  </div>
</div>

  
  )
}


// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { motion, AnimatePresence } from "framer-motion"
// import { timelineData } from "./data"

// export default function AnimatedTimeline() {
//   const [activeId, setActiveId] = useState(1)

//   return (
//     <div className="grid md:grid-cols-2 gap-[20px] p-0 max-w-[1360px] mx-auto bg-white rounded-xl mb-[140px]">
//       <div className="space-y-8 relative bg-[#f6f6f6] rounded-[24px] p-[40px] overflow-hidden">
//         {/* Progress bar */}
//         <motion.div
//           className="absolute left-[55px] top-[80px] w-[4px] bg-amber-300 rounded-full"
//           style={{
//             height: "calc(100% - 4rem)",
//             originY: 0,
//           }}
//           initial={{ scaleY: 0 }}
//           animate={{ scaleY: (activeId - 1) / (timelineData.length - 1) }} // Progress hisoblash
//           transition={{ duration: 0.5 }}
//         />

//         {timelineData.map((item, index) => (
//           <motion.div
//             key={item.id}
//             className="flex gap-4 items-start relative z-10"
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: index * 0.2 }}
//           >
//             <button
//               onClick={() => setActiveId(item.id)}
//               className="flex-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full"
//             >
//               <motion.div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors duration-200 ${
//                   activeId === item.id
//                     ? "bg-amber-700 text-white"
//                     : "bg-amber-100 text-amber-700 group-hover:bg-amber-200"
//                 }`}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 {item.id}
//               </motion.div>
//             </button>
//             <div
//               className={`space-y-2 transition-colors duration-200 ${
//                 activeId === item.id ? "opacity-100" : "opacity-60"
//               }`}
//             >
//               <h2
//                 className="text-xl font-semibold text-amber-700 cursor-pointer"
//                 onClick={() => setActiveId(item.id)} // Title bosilganda ham o'zgaradi
//               >
//                 {item.title}
//               </h2>
//               <p className="text-gray-600 leading-relaxed">{item.description}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="relative h-[634px] md:h-auto overflow-hidden rounded-[24px]">
//         <AnimatePresence mode="wait">
//           {timelineData.map(
//             (item) =>
//               activeId === item.id && (
//                 <motion.div
//                   key={item.id}
//                   className="absolute inset-0"
//                   initial={{ opacity: 0, scale: 1.1 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.4 }}
//                 >
//                   <Image
//                     src={item.image || "/placeholder.svg"}
//                     alt={item.title}
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                     priority={item.id === 1}
//                   />
//                 </motion.div>
//               ),
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }
