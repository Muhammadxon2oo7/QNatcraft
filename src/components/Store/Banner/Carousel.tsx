// "use client"

// import { Splide, SplideSlide, SplideRef } from '@splidejs/react-splide';
// import '@splidejs/react-splide/css';
// import { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Dot } from '@/components/dot/Dot';

// const slides = [
//   {
//     id: 1,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
//   {
//     id: 2,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
//   {
//     id: 3,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
//   {
//     id: 4,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
//   {
//     id: 5,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
//   {
//     id: 6,
//     image: '/store/banner_f.png',
//     title: 'Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!',
//     description: 'Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!',
//     category: 'Kulolchilik',
//   },
// ];
// export default function Carousel() {
//   const splideRef = useRef<SplideRef | null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <div className="relative w-full mx-auto">
//       <Splide
//         ref={splideRef}
//         options={{
//           type: 'loop',
//           perPage: 1, // Default mobil uchun 1
//           perMove: 1,
//           focus: 'center',
//           autoplay: true,
//           interval: 2000,
//           arrows: false,
//           pagination: false,
//           drag: true,
//           gap: '0.5rem',
//           breakpoints: {
//             640: { perPage: 1, gap: '0.5rem' }, // sm: mobil
//             1024: { perPage: 2, gap: '1rem' },  // md: planshet
//             1280: { perPage: 3, gap: '1rem' },  // lg: katta ekran
//           },
//         }}
//         onMoved={(splide) => setActiveIndex(splide.index)}
//       >
//         {slides.map((slide, index) => (
//           <SplideSlide key={slide.id}>
//             <div
//               className={`relative flex h-[300px] sm:h-[400px] md:h-[460px] bg-[#f9f6f1] rounded-xl shadow-md overflow-hidden w-full ${index === activeIndex ? 'opacity-100' : 'opacity-60'}`}
//               style={{
//                 backgroundImage: `url(${slide.image})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//               }}
//             >
//               <div className="flex flex-col w-full sm:w-[50%] p-4 md:p-12">
//                 <span className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full w-fit mb-2 md:mb-4">
//                   <Dot /> {slide.category}
//                 </span>
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#242b3a] leading-tight">
//                   {slide.title}
//                 </h2>
//                 <p className="text-sm md:text-lg text-[#242b3a] mb-4 md:mb-12">
//                   {slide.description}
//                 </p>
//                 <Button
//                   variant={'default'}
//                   className="text-white w-full sm:w-[260px] rounded-[16px] h-10 md:h-[52px] px-4 text-sm md:text-base"
//                 >
//                   Mahsulotlarni ko‘rish
//                 </Button>
//               </div>
//             </div>
//           </SplideSlide>
//         ))}
//       </Splide>

//       <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 md:gap-2 bg-gray-300 rounded-full px-2 py-1 md:px-4 md:py-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-500 ease-in-out ${activeIndex === index ? 'bg-[#8B0000] opacity-100 md:w-4' : 'bg-white opacity-50'}`}
//             onClick={() => splideRef.current?.go(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";
import { Dot } from "@/components/dot/Dot";
import { motion } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "/store/banner_f.png",
    title: "Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!",
    description:
      "Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!",
    category: "Kulolchilik",
  },
  {
    id: 2,
    image: "/store/banner_f.png",
    title: "Yangi dizayndagi buyumlar – faqat ushbu haftada maxsus narxlarda!",
    description: "Uy uchun zamonaviy kulolchilik mahsulotlarini tanlang va buyurtma bering.",
    category: "Design",
  },
  {
    id: 3,
    image: "/store/banner_f.png",
    title: "Mahsulotlarimiz endi onlayn – buyurtma berish yanada qulay!",
    description: "O‘zingizga yoqqan mahsulotni tanlang, bir necha bosqichda buyurtma qiling.",
    category: "Online Shop",
  },
  {
    id: 4,
    image: "/store/banner_f.png",
    title: "Ramazon oyi munosabati bilan barcha kulolchilik ishlarga 30% chegirma!",
    description:
      "Qoriniyoz ota kulolchilik ustaxonasi - sizga bundan-da foydali takliflar berishga tayyor!",
    category: "Kulolchilik",
  },
  {
    id: 5,
    image: "/store/banner_f.png",
    title: "Yangi dizayndagi buyumlar – faqat ushbu haftada maxsus narxlarda!",
    description: "Uy uchun zamonaviy kulolchilik mahsulotlarini tanlang va buyurtma bering.",
    category: "Design",
  },
  {
    id: 6,
    image: "/store/banner_f.png",
    title: "Mahsulotlarimiz endi onlayn – buyurtma berish yanada qulay!",
    description: "O‘zingizga yoqqan mahsulotni tanlang, bir necha bosqichda buyurtma qiling.",
    category: "Online Shop",
  },
];

export default function CardSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  return (
    <motion.div
      className="relative w-full mx-auto max-w-[1920px] px-2 sm:px-4"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="!pb-16 custom-swiper flex items-center"
        style={{ paddingTop: "50px" }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <SwiperSlide key={slide.id}>
              <motion.div
                className={`relative flex w-full rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 ease-in-out ${
                  isActive ? "scale-105" : "scale-90 opacity-70"
                }`}
                style={{
                  transformOrigin: "bottom center",
                  height: "clamp(250px, 50vw, 420px)",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1280px) 33vw, 25vw"
                  priority
                />

                {/* Gradient Overlay + Content */}
                <div className="relative z-10 flex flex-col justify-end h-full p-3 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent w-full">
                  <span className="flex items-center gap-2 text-[9px] sm:text-xs md:text-sm font-medium text-white bg-black/40 px-2 sm:px-3 py-1 rounded-full w-fit backdrop-blur-sm mb-2">
                    <Dot /> {slide.category}
                  </span>

                  <h2 className="text-white font-extrabold text-[clamp(16px,2vw,28px)] drop-shadow-md leading-tight line-clamp-2">
                    {slide.title}
                  </h2>

                  <p className="text-white/80 text-[clamp(12px,1.4vw,18px)] mt-2 mb-3 line-clamp-3">
                    {slide.description}
                  </p>

                  <Button
                    variant="default"
                    className="bg-[#8B0000] hover:bg-[#a50000] text-white w-fit px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-[clamp(12px,1.3vw,16px)]"
                  >
                    Mahsulotlarni ko‘rish
                  </Button>
                </div>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ✅ Custom Pagination Dots (Splide style) */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperInstance?.slideToLoop(index)}
            className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "bg-[#8B0000] scale-125 shadow-md"
                : "bg-white/70 hover:bg-white/90"
            }`}
            aria-label={`Slayd ${index + 1} ga o‘tish`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
