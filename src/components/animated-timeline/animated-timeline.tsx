"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { timelineData } from "./data";

export default function AnimatedTimeline() {
  const [activeId, setActiveId] = useState(1);
  const [timelineHeight, setTimelineHeight] = useState(0); // Timeline div balandligi
  const timelineRef = useRef<HTMLDivElement>(null); // Timeline div uchun ref

  // Timeline div balandligini o‘lchash
  useEffect(() => {
    if (timelineRef.current) {
      const height = timelineRef.current.getBoundingClientRect().height ;
      setTimelineHeight(height);
    }
  }, [timelineData]); // timelineData o‘zgarganda qayta o‘lchash
  let additionalHeight=0
  const adjustedHeight = timelineHeight - additionalHeight;
  console.log("timelineData:", timelineData); // Ma'lumotlarni tekshirish uchun
  console.log("Timeline height:", adjustedHeight); // O‘lchangan balandlikni tekshirish

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 max-w-[1360px] mx-auto bg-white rounded-xl shadow-lg relative">
      {/* Timeline Section */}
      <div className="relative bg-[#f6f6f6] rounded-2xl p-10 overflow-hidden order-2 md:order-1 min-h-[500px]">
        {/* Progress Bar */}
        <motion.div
          className={`absolute left-[53px] top-[71px] w-[6px] bg-[#71090D] rounded-full   h-${adjustedHeight }px`}
          style={{ height: `${adjustedHeight}px`, transformOrigin: "top" ,display:'block'}}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: activeId / timelineData.length }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Timeline elementlari */}
        <div ref={timelineRef} className="space-y-8">
          {timelineData.map((item) => (
            <motion.div
              key={item.id}
              className="flex gap-4 items-start relative z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: item.id * 0.3 }}
            >
              <button
                onClick={() => setActiveId(item.id)}
                className="flex-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all duration-200 shadow-md ${
                    item.id <= activeId ? "bg-[#71090D] text-white" : "bg-gray-300 text-gray-700"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.id}
                </motion.div>
              </button>
              <div className={`space-y-2 transition-opacity duration-300 ${activeId >= item.id ? "opacity-100" : "opacity-60"}`}>
                <h2
                  className="text-xl font-semibold cursor-pointer"
                  onClick={() => setActiveId(item.id)}
                  style={{ color: item.id <= activeId ? "#71090D" : "#4B5563" }}
                >
                  {item.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-[230px] md:h-auto overflow-hidden rounded-2xl order-1 md:order-2 shadow-lg">
        <AnimatePresence mode="wait" initial={false}>
          {timelineData.map(
            (item) =>
              activeId === item.id && (
                <motion.div
                  key={item.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={activeId === 1}
                    onError={() => console.log(`Image failed to load: ${item.image}`)}
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}