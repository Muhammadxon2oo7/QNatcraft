'use client';

import { useEffect, useState } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { Badge } from '../ui/badge';
import { Dot } from '../dot/Dot';
import { Litsense } from '../../../public/img/litsense';
import { Cube } from '../../../public/img/cube';
import { Group } from '../../../public/img/group';
import { Button } from '../ui/button';

import { Arrow } from '../../../public/img/Arrow';
import Link from 'next/link';
import Image from 'next/image';
import { Left } from '../../../public/img/left';
import { Right } from '../../../public/img/right';

const CustomSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const splide = new Splide('#splide', {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      focus: 'center',
      gap: '1.5rem',
      padding: '5%',
      updateOnMove: true,
      pagination:false,
    });

    splide.on('moved', () => {
      setActiveIndex(splide.index);
    });

    splide.mount();

    return () => {
      splide.destroy();
    };
  }, []);

  return (
    <div className="mx-auto">
      <div id="splide" className="splide">
        <div className="splide__track  w-full">
          <ul className="splide__list w-full h-[546px] flex">
            {Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className=' splide__slide static  bg-white rounded-[24px] p-[20px] transition-transform duration-300 '
                style={{
                  width: '1130px',
                  height: '536px',
                  display:'block',
                  // transform: index === activeIndex ? 'scale(1)' : 'scale(0.9)',
                  opacity: index === activeIndex ? 1 : 0.6,
                  backgroundColor: index === activeIndex ? '#fcefe5' : '',
                }}
              >
                <div className=' flex w-[1130px]'>
                <div className="p-[16px] max-w-[496px] pb-[43px]">
                  <div className="mb-[16px]">
                    <Badge className="rounded-[24px] primary-bg cursor-pointer p-[10px_16px] w-auto px-[13.5px] py-[6px] h-[36px] flex gap-[10px] text-white" variant="secondary">
                      <Dot />
                      <p className="font-medium text-base leading-none text-white">Kulol</p>
                    </Badge>
                  </div>
                  <p className="font-medium text-[24px] text-[#242b3a]">Alisher Zafarovich Polonchiyev</p>
                  <p className="font-normal text-sm text-gray-500 w-[496px] mb-[28px]">
                    Pole reality assassin with marginalised. Revision moments globalize backwards eye gmail. Calculator tiger
                    solutionize initiative pushback. Opportunity accountable files time key you're harvest. So while socialize
                    cadence optimize baseline closer. Organic usability where goalposts adoption lot lift request
                  </p>
                  <div className='flex flex-wrap gap-[16px] mb-[28px]'>
                  <div className='flex gap-[16px] items-center w-full'>
                    <div className='rounded-[40px] p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center'>
                      <Litsense/>
                    </div>
                    <p className='font-semibold text-lg leading-[140%] text-[#242b3a]'>4 yillik tajriba</p>
                  </div>
                  <div className='flex gap-[16px] items-center w-full'>
                    <div className='rounded-[40px] p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center'>
                      <Group/>
                    </div>
                    <p className='font-semibold text-lg leading-[140%] text-[#242b3a]'>300+ shogirtlar</p>
                  </div>
                  <div className='flex gap-[16px] items-center w-full'>
                    <div className='rounded-[40px] p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center'>
                      <Cube/>
                    </div>
                    <p className='font-semibold text-lg leading-[140%] text-[#242b3a]'>Xalqaro musobaqalar sovrindori</p>
                  </div>
                  </div>
                   <Button className='w-[180px] h-[52px] border-orange-500 flex justify-center items-center '>
                    <Link href='/' className='flex gap-[8px]'> 
                    Batafsil <Arrow/>
                    </Link>
                   </Button>
                </div>
                <div>
                  <Image
                  src='/img/craftman.png'
                  alt='craftman'
                  width={100}
                  height={100}
                  className='w-[542px] h-[496px]'
                  />
                </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="splide__arrows splide__arrows--ltr">
  <button
    className="splide__arrow splide__arrow--prev l-[100px]"
    type="button"
    aria-label="Previous slide"
    aria-controls="splide01-track"
  >
    
    <Left/>
  </button>
  <button
    className="splide__arrow splide__arrow--next"
    type="button"
    aria-label="Next slide"
    aria-controls="splide01-track"
  >
    <Right/>
  </button>
</div>
        </div>
      </div>
    </div>
  );
};

export default CustomSwiper;
