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
      autoplay: true,
      interval: 3000, 
      speed: 800, 
pauseOnHover: false,
pauseOnFocus: false,

      cover: false,
      perPage: 3,
      perMove: 1,
      focus: 'center',
      gap: '1.5rem',
      padding: '5%',
      updateOnMove: true,
      pagination: false,
      classes: {
        arrows: 'splide__arrows your-class-arrows',
        arrow: 'splide__arrow your-class-arrow',
        prev: 'splide__arrow--prev your-class-prev',
        next: 'splide__arrow--next your-class-next',
      },
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
      <div className="splide__arrows hidden md:block">
		<button className="splide__arrow splide__arrow--prev ">
			<Left />
		</button>
		<button className="splide__arrow splide__arrow--next">
			<Right/>
		</button>
  </div>

        <div className="splide__track  w-full h-auto p-0" style={{
          padding:'0'
        }}>
          <ul className="splide__list w-full h-auto flex ">
            {Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className={`splide__slide static bg-white rounded-[24px]   p-[10px] md:max-w-[65%]  block transition-transform duration-300
                  ${index === activeIndex ? 'opacity-100 bg-[rgb(252,239,229)]' : 'opacity-60'} `}
                  style={{
                    backgroundColor: index === activeIndex ? 'rgb(252,239,229)' : 'white',
                    width: '100%',
                    maxWidth: '100%',
                    height:'auto'
                  }}
              >
                <div className="flex  md:flex-row flex-wrap flex-col-reverse w-full
                 md:max-w-[1130px]">
  <div className="p-4    md:max-w-[500px] md:w-[496px]  w-full h-[90%]  ">
    <div className="mb-4 md:mb-[16px] w-full">
      <Badge
        className="rounded-[24px] primary-bg cursor-pointer inline-flex gap-[10px] p-[10px_16px] text-white"
        variant="secondary"
      >
        <Dot />
        <p
          style={{ fontSize: 'clamp(0.75rem, 1vw + 0.75rem, 0.875rem)' }}
          className="font-medium leading-none text-white w-full"
        >
          Kulol
        </p>
      </Badge>
    </div>
    <p
      style={{ fontSize: 'clamp(14px, 1.2vw, 1.6rem)' }}
      className="font-medium text-[#242b3a] "
    >
      Alisher Zafarovich Polonchiyev
    </p>
    <p
      style={{ fontSize: 'clamp(10px, 1vw, 0.8rem)' }}
      className="font-normal text-gray-500 md:w-[90%] mb-7 md:mb-[28px] mb-[24px]"
    >
      Pole reality assassin with marginalised. Revision moments globalize backwards
      eye gmail. Calculator tiger solutionize initiative pushback. Opportunity
      accountable files time key you're harvest. So while socialize cadence optimize
      baseline closer. Organic usability where goalposts adoption lot lift request.
    </p>
    <div className="flex flex-wrap gap-[12px] md:gap-[16px] mb-7 md:mb-[28px] w-auto">
      <div className="flex gap-4 md:gap-[16px] items-center ">
        <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
          <Litsense />
        </div>
        <p
          style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
          className="font-semibold leading-[140%] text-[#242b3a] "
        >
          4 yillik tajriba
        </p>
      </div>
      <div className="flex gap-4 md:gap-[16px] items-center ">
        <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
          <Group />
        </div>
        <p
          style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
          className="font-semibold leading-[140%] text-[#242b3a]"
        >
          300+ shogirtlar
        </p>
      </div>
      <div className="flex gap-4 md:gap-[16px] items-center ">
        <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
          <Cube />
        </div>
        <p
          style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
          className="font-semibold leading-[140%] text-[#242b3a]"
        >
          Xalqaro musobaqalar sovrindori
        </p>
      </div>
    </div>
    <Button className="w-[180px] h-[52px] border-orange-500 flex justify-center items-center ">
      <Link href="/" className="flex gap-2">
        <span style={{ fontSize: 'clamp(0.875rem, 1vw + 0.875rem, 1rem)' }}>
          Batafsil
        </span>
        <Arrow />
      </Link>
    </Button>
  </div>
  <div className="mt-4 md:mt-0">
    <Image
      src="/img/craftman.png"
      alt="craftman"
      width={100}
      height={100}
      className=" md:w-[542px]  md:h-100 w-[100%] h-[250px] rounded-[12px]"
    />
  </div>
</div>

              </li>
            ))}
          </ul>

        </div>
    
      </div>
    </div>
  );
};

export default CustomSwiper;
