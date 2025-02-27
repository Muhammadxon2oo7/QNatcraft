import Carousel from '@/components/Store/Banner/Carousel'
import Filter from '@/components/Store/Filter/Filter'
import Header from '@/components/Store/Header/Header'
import Product from '@/components/Store/Products/Product'
import { products as staticProducts } from "../../components/Store/Products/data"
import React from 'react'

const Page = () => {
  
  return (
    <div className='pt-[224px]'>
      <div className='w-full flex justify-center items-center mb-[36px]'>
        <p className='text-[32px] font-[700] text-[#242b3a]'>
        Hunarmandchilik do’konimizga xush kelibsiz!
        </p>
      </div>
      <section className='w-full mb-[64px]'  >
        <Carousel/>
      </section>
      <main className='max-w-[1380px] mx-auto px-[10px]'>
        <Header/>
        <section className='flex  gap-[20px] flex-wrap'>
          <Filter/>
          <div className='min-h-screen  '>
          <Product/>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Page