"use client"

import { Splide, SplideSlide, SplideRef } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { useState, useRef } from 'react';
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
    <div className="relative w-full mx-auto">
      <Splide
        ref={splideRef}
        options={{
          type: 'loop',
          perPage: 1, // Default mobil uchun 1
          perMove: 1,
          focus: 'center',
          autoplay: true,
          interval: 2000,
          arrows: false,
          pagination: false,
          drag: true,
          gap: '0.5rem',
          breakpoints: {
            640: { perPage: 1, gap: '0.5rem' }, // sm: mobil
            1024: { perPage: 2, gap: '1rem' },  // md: planshet
            1280: { perPage: 3, gap: '1rem' },  // lg: katta ekran
          },
        }}
        onMoved={(splide) => setActiveIndex(splide.index)}
      >
        {slides.map((slide, index) => (
          <SplideSlide key={slide.id}>
            <div
              className={`relative flex h-[300px] sm:h-[400px] md:h-[460px] bg-[#f9f6f1] rounded-xl shadow-md overflow-hidden w-full ${index === activeIndex ? 'opacity-100' : 'opacity-60'}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex flex-col w-full sm:w-[50%] p-4 md:p-12">
                <span className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full w-fit mb-2 md:mb-4">
                  <Dot /> {slide.category}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#242b3a] leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-lg text-[#242b3a] mb-4 md:mb-12">
                  {slide.description}
                </p>
                <Button
                  variant={'default'}
                  className="text-white w-full sm:w-[260px] rounded-[16px] h-10 md:h-[52px] px-4 text-sm md:text-base"
                >
                  Mahsulotlarni ko‘rish
                </Button>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 md:gap-2 bg-gray-300 rounded-full px-2 py-1 md:px-4 md:py-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-500 ease-in-out ${activeIndex === index ? 'bg-[#8B0000] opacity-100 md:w-4' : 'bg-white opacity-50'}`}
            onClick={() => splideRef.current?.go(index)}
          />
        ))}
      </div>
    </div>
  );
}
