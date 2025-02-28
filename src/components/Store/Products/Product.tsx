// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Heart, ArrowRight } from "lucide-react"
// import { motion } from "framer-motion"
// import { Product as ProductType, products as staticProducts } from "./data"

// const ITEMS_PER_PAGE = 5;

// export default function Product() {
//   const [products, setProducts] = useState<ProductType[]>([])
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       await new Promise((resolve) => setTimeout(resolve, 500)) 
//       setProducts(staticProducts)
//     }
//     fetchProducts()
//   }, [])

//   const toggleFavorite = (productId: string) => {
//     setProducts(
//       products.map((product) => (product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product)),
//     )
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("uz-UZ").format(price)
//   }

//   const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
//   const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

//   return (
//     <div className="container ">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {paginatedProducts.map((product) => (
//           <motion.div
//             key={product.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             whileHover={{ y: -5 }}
//             className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
//           >
//             <div className="relative">
//               <div className="absolute top-2 left-2 z-10 flex flex-col">
//                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
//                   • {product.category}
//                 </span>
//                 {product.discount && (
//                   <div className="text-xs font-semibold  mt-1 rounded-[46px] bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">🔥 -{product.discount}%</div>
//                 )}
//               </div>

//               <motion.button
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => toggleFavorite(product.id)}
//                 className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm"
//               >
//                 <Heart size={18} className={`${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
//               </motion.button>

//               <div className="aspect-square relative overflow-hidden">
//                 <Image
//                   src={product.image || "/placeholder.svg"}
//                   alt={product.title}
//                   fill
//                   className="object-cover transition-transform duration-300 hover:scale-105"
//                 />
//               </div>
//             </div>

//             <div className="p-4">
//               <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
//               <p className="text-xs text-gray-500 mb-3">{product.workshop}</p>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold text-gray-900">
//                       {formatPrice(product.currentPrice)} so'm
//                     </span>
//                     {product.originalPrice && (
//                       <span className="text-xs text-gray-400 line-through">
//                         {formatPrice(product.originalPrice)} so'm
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <motion.button
//                   whileHover={{ x: 3 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="text-sm font-medium text-[#7D1A1D] flex items-center gap-1"
//                 >
//                   Sotib olish
//                   <ArrowRight size={16} />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-6 space-x-2">
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentPage(index + 1)}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               currentPage === index + 1 ? "bg-[#7D1A1D] text-white" : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Product as ProductType } from "./data"
import Filter from "../Filter/Filter"

const ITEMS_PER_PAGE = 8

interface ProductProps {
  products: ProductType[]
}

export default function Product({ products }: ProductProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortByDiscount, setSortByDiscount] = useState(false)

  useEffect(() => {
    let newProducts = [...products]

    if (selectedCategories.length > 0) {
      newProducts = newProducts.filter((product) => selectedCategories.includes(product.category))
    }

    if (sortByDiscount) {
      newProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    setFilteredProducts(newProducts)
    setCurrentPage(1)
  }, [selectedCategories, sortByDiscount, products])

  const toggleFavorite = (productId: string) => {
    setFilteredProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product
      )
    )
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("uz-UZ").format(price)

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  return (
    <div className="flex gap-[20px] p-[20px] ">
      <Filter onFilterChange={(categories, sortDiscount) => {
        setSelectedCategories(categories)
        setSortByDiscount(sortDiscount)
      }} />

      <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] ">
        {paginatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
          >
            <div className="relative">
              <div className="absolute top-2 left-2 z-10 flex flex-col">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                  • {product.category}
                </span>
                {product.discount && (
                  <div className="text-xs font-semibold mt-1 rounded-[46px] bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">
                    🔥 -{product.discount}%
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm"
              >
                <Heart size={18} className={product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </motion.button>

              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{product.workshop}</p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(product.currentPrice)} so'm
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.originalPrice)} so'm
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-[#7D1A1D] flex items-center gap-1"
                >
                  Sotib olish
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === index + 1 ? "bg-[#7D1A1D] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </div>
  )
}
