import Carousel from '@/components/Store/Banner/Carousel'
import Header from '@/components/Store/Header/Header'

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
      </main>
    </div>
  )
}

export default Page