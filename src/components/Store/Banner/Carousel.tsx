'use client';

import { Splide, SplideSlide, SplideRef } from '@splidejs/react-splide';

import '@splidejs/react-splide/css';
import { useState, useRef, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/dot/Dot';

const slides = [
  {
    id: 1,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
  {
    id: 2,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
  {
    id: 3,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
  {
    id: 4,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
  {
    id: 5,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
  {
    id: 6,
    image: '/store/banner_f.png',
    title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
    description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
    category: 'Kulolchilik',
  },
];

export default function Carousel() {
    const splideRef = useRef<SplideRef | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full mx-auto ">
      <Splide
        ref={splideRef}
        options={{
          type: 'loop',
          perPage: 3,
          perMove: 1,
          focus: 'center',
          autoplay: true,
          interval: 2000,
          arrows: false,
          pagination: false,
          drag: true,
          gap: '1rem',
        }}
        onMoved={(splide: { index: SetStateAction<number> }) => setActiveIndex(splide.index)}
      >
        {slides.map((slide,index) => (
          <SplideSlide key={slide.id}>
            <div
              className={`relative flex h-[460px] bg-[#f9f6f1] rounded-xl shadow-md overflow-hidden w-full md:max-w-[1130px] pl-[48px] pt-[48px]  ${index === activeIndex ? 'opacity-100 ' : 'opacity-60'}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex flex-col   w-[50%]">
                <span className="flex items-center gap-[8px] text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full w-fit mb-[16px]">
                   <Dot/>{slide.category}
                </span>
                <h2 className="text-[36px] font-[700] text-[#242b3a]  leading-tight ">{slide.title}</h2>
                <p className=" text-[18px] text-[#242b3a]  flex gap-[8px] mb-[46px] ">{slide.description}</p>
                <Button variant={'default'} className=" text-white max-w-[260px] rounded-[16px] h-[52px] justify-center px-[14px]">
                  Mahsulotlarni ko‘rish 
                </Button>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Custom Pagination */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-300 rounded-full px-4 py-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition-all duration-500 ease-in-out w-[12px] ${
              activeIndex === index ? 'bg-[#8B0000] opacity-100 w-[16px]' : 'bg-white opacity-50'
            }`}
            onClick={() => splideRef.current?.go(index)}
          />
        ))}
      </div>
    </div>
  );
}
