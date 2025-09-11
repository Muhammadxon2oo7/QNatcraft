// "use client"

// import Carousel from '@/components/Store/Banner/Carousel'
// import Filter from '@/components/Store/Filter/Filter'
// import Product from '@/components/Store/Products/Product'
// import React, { useEffect, useState } from 'react'
// import { products as staticProducts, type Product as ProductType } from "@/components/Store/Products/data"

// const Page = () => {
//   const [products, setProducts] = useState<ProductType[]>([])

//   useEffect(() => {
//     setProducts(staticProducts)
//   }, [])

//   const handleFilterChange = (selectedCategories: string[]) => {
//     if (selectedCategories.length === 0) {
//       setProducts(staticProducts)
//     } else {
//       const filteredProducts = staticProducts.filter((product) => 
//         selectedCategories.includes(product.category)
//       )
//       setProducts(filteredProducts)
//     }
//   }

//   return (
//     <div className="pt-[64px] md:pt-[156px] min-h-screen"> {/* Header balandligiga moslash */}
//       <div className="w-full flex justify-center items-center mb-4 md:mb-9 px-4">
//         <p className="text-lg md:text-3xl lg:text-4xl font-bold text-[#242b3a] text-center">
//           Hunarmandchilik do’konimizga xush kelibsiz!
//         </p>
//       </div>
//       <section className="w-full mb-8 md:mb-16 px-4 md:px-0">
//         <Carousel />
//       </section>
//       <main className="max-w-[1380px] mx-auto px-4 md:px-10">
//         <Product />
//       </main>
//     </div>
//   )
// }

// export default Page


"use client"

import Carousel from '@/components/Store/Banner/Carousel'
import ProductList from '@/components/Store/Products/Product'
import React, { Suspense } from 'react'
import { motion } from 'framer-motion'

const Page = () => {
  return (
    <motion.div 
      className="pt-[64px] md:pt-[156px] min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex justify-center items-center mb-4 md:mb-9 px-4 sm:px-6 lg:px-8">
        <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#242b3a] text-center">
          Hunarmandchilik do’konimizga xush kelibsiz!
        </p>
      </div>
      <section className="w-full mb-8 md:mb-16 px-4 sm:px-6 md:px-8 lg:px-0">
        <Suspense fallback={<div>Yuklanmoqda...</div>}>
          <Carousel />
        </Suspense>
      </section>
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <ProductList />
      </main>
    </motion.div>
  )
}

export default Page