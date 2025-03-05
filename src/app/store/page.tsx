"use client"

import Carousel from '@/components/Store/Banner/Carousel'
import Filter from '@/components/Store/Filter/Filter'
import Header from '@/components/Store/Header/Header'
import Product from '@/components/Store/Products/Product'
import React, { useEffect, useState } from 'react'
import { products as staticProducts, type Product as ProductType } from "@/components/Store/Products/data"

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([])

  useEffect(() => {
    setProducts(staticProducts)
  }, [])

  const handleFilterChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setProducts(staticProducts)
    } else {
      const filteredProducts = staticProducts.filter((product) => 
        selectedCategories.includes(product.category)
      )
      setProducts(filteredProducts)
    }
  }

  return (
    <div className='pt-[64px]'>
      <div className='w-full flex justify-center items-center mb-[36px]'>
        <p className='text-[32px] font-[700] text-[#242b3a]'>
          Hunarmandchilik do’konimizga xush kelibsiz!
        </p>
      </div>
      <section className='w-full mb-[64px]'>
        <Carousel />
      </section>
      <main className='max-w-[1380px] mx-auto px-[10px]'>
        <Header />
        <section className='flex gap-[20px]'>
            <Product/>
        </section>
      </main>
    </div>
  )
}

export default Page