"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    description: "Qoriniyoz ota kulolchilik ustaxonasi",
    price: "525 000 so'm",
    originalPrice: "750 000 so'm",
    discount: 30,
    category: "Metalga ishlov berish",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 2,
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    description: "Qoriniyoz ota kulolchilik ustaxonasi",
    price: "525 000 so'm",
    originalPrice: "750 000 so'm",
    discount: 30,
    category: "Metalga ishlov berish",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 3,
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    description: "Qoriniyoz ota kulolchilik ustaxonasi",
    price: "525 000 so'm",
    originalPrice: "",
    discount: 0,
    category: "Metalga ishlov berish",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 4,
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    description: "Qoriniyoz ota kulolchilik ustaxonasi",
    price: "525 000 so'm",
    originalPrice: "",
    discount: 0,
    category: "Metalga ishlov berish",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 5,
    name: "Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami",
    description: "Qoriniyoz ota kulolchilik ustaxonasi",
    price: "525 000 so'm",
    originalPrice: "",
    discount: 0,
    category: "Metalga ishlov berish",
    image: "/placeholder.svg?height=150&width=150",
  },
]

export default function ProductsList() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: product.id * 0.1 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 15px 25px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3 },
          }}
          onHoverStart={() => setHoveredId(product.id)}
          onHoverEnd={() => setHoveredId(null)}
          className="relative bg-white border border-gray-100 rounded-xl p-5 flex gap-6 overflow-hidden shadow-md"
        >
          {/* Decorative overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredId === product.id ? 0.1 : 0 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-0"
          />

          <div className="relative z-10 w-[150px] h-[150px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={150}
              height={150}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            />
          </div>

          <div className="flex-1 z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.2, backgroundColor: "#e5e7eb" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:text-primary transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2, backgroundColor: "#e5e7eb" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:text-red-600 transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </motion.button>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-3">{product.name}</h3>
            <p className="text-gray-600 mt-2">{product.description}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-xl font-bold text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center mt-8"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m17 18-6-6 6-6" />
              <path d="M7 6v12" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-primary text-white"
          >
            1
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            2
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            ...
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300"
          >
            10
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 18 6-6-6-6" />
              <path d="M17 6v12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}