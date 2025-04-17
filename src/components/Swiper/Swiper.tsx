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
import { useTranslations } from 'next-intl';

// Hunarmand ma'lumotlari uchun interface
interface Craftsman {
  id: number;
  user_email: string;
  user_first_name: string;
  is_verified: boolean;
  profession: string | null; // profession id sifatida keladi
  bio: string | null;
  profile_image: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  experience: number;
  mentees: number;
  award: string | null;
  created_at: string;
  updated_at: string;
  user: number;
}

// Kasblar uchun interface
interface Profession {
  id: number;
  name: string;
}

const CustomSwiper = () => {
  const t = useTranslations('swiper');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Kasblarni olish
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const response = await fetch('https://qqrnatcraft.uz/accounts/professions/');
        if (!response.ok) {
          throw new Error(t('errors.professionsFetch'));
        }
        const data = await response.json();
        setProfessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Kasblarni olishda xatolik:', error);
        setError(t('errors.professionsFetch'));
      }
    };

    fetchProfessions();
  }, [t]);

  // Hunarmandlarni olish
  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://qqrnatcraft.uz/accounts/profiles/');
        if (!response.ok) {
          throw new Error(t('errors.craftsmenFetch'));
        }
        const data = await response.json();

        // API javobini massiv sifatida normalizatsiya qilish
        const craftsmenData = Array.isArray(data) ? data : [data];
        // Faqat is_verified: true bo'lganlarni filtrlaymiz
        const verifiedCraftsmen = craftsmenData.filter((craftsman: Craftsman) => craftsman.is_verified === true);
        setCraftsmen(verifiedCraftsmen);
      } catch (error) {
        console.error('Hunarmandlarni olishda xatolik:', error);
        setError(t('errors.craftsmenFetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCraftsmen();
  }, [t]);

  // Splide slayderini sozlash
  useEffect(() => {
    if (isLoading || error || craftsmen.length === 0) return;

    const splideElement = document.querySelector('#splide');
    if (!splideElement) {
      console.error("Splide elementi topilmadi (#splide)");
      return;
    }

    const splide = new Splide('#splide', {
      type: 'loop',
      autoplay: true,
      interval: 3000,
      speed: 800,
      pauseOnHover: false,
      pauseOnFocus: false,
      cover: false,
      perPage: Math.min(craftsmen.length, 3),
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
  }, [isLoading, error, craftsmen]);

  // Profession id bo'yicha nomni topish
  const getProfessionName = (professionId: string | null) => {
    if (!professionId) return t('unknown');
    const profession = professions.find((p) => p.id === Number(professionId));
    return profession?.name || t('unknown');
  };

  // Yuklanayotgan holat yoki xatolikni ko'rsatish
  if (isLoading) {
    return <div className="text-center py-10">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (craftsmen.length === 0) {
    return <div className="text-center py-10">{t('noCraftsmen')}</div>;
  }

  return (
    <div className="mx-auto">
      <div id="splide" className="splide">
        <div className="splide__arrows hidden md:block">
          <button className="splide__arrow splide__arrow--prev">
            <Left />
          </button>
          <button className="splide__arrow splide__arrow--next">
            <Right />
          </button>
        </div>

        <div className="splide__track w-full h-auto p-0" style={{ padding: '0' }}>
          <ul className="splide__list w-full h-auto flex">
            {craftsmen.map((craftsman, index) => (
              <li
                key={craftsman.id}
                className={`splide__slide static bg-white rounded-[24px] p-[10px] md:max-w-[65%] block transition-transform duration-300
                  ${index === activeIndex ? 'opacity-100 bg-[rgb(252,239,229)]' : 'opacity-60'}`}
                style={{
                  backgroundColor: index === activeIndex ? 'rgb(252,239,229)' : 'white',
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              >
                <div className="flex md:flex-row flex-wrap flex-col-reverse w-full md:max-w-[1130px]">
                  <div className="p-4 md:max-w-[500px] md:w-[496px] w-full h-[90%]">
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
                          {getProfessionName(craftsman.profession)}
                        </p>
                      </Badge>
                    </div>
                    <p
                      style={{ fontSize: 'clamp(14px, 1.2vw, 1.6rem)' }}
                      className="font-medium text-[#242b3a]"
                    >
                      {typeof craftsman.user_first_name === 'string' ? craftsman.user_first_name : t('unknown')}
                    </p>
                    <p
                      style={{ fontSize: 'clamp(10px, 1vw, 0.8rem)' }}
                      className="font-normal text-gray-500 md:w-[90%] md:mb-[28px] mb-[24px]"
                    >
                      {typeof craftsman.bio === 'string' ? craftsman.bio : t('noBio')}
                    </p>
                    <div className="flex flex-wrap gap-[12px] md:gap-[16px] mb-7 md:mb-[28px] w-auto">
                      <div className="flex gap-4 md:gap-[16px] items-center">
                        <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
                          <Litsense />
                        </div>
                        <p
                          style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
                          className="font-semibold leading-[140%] text-[#242b3a]"
                        >
                          {typeof craftsman.experience === 'number' ? `${craftsman.experience} ${t('yearsExperience')}` : t('noExperience')}
                        </p>
                      </div>
                      <div className="flex gap-4 md:gap-[16px] items-center">
                        <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
                          <Group />
                        </div>
                        <p
                          style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
                          className="font-semibold leading-[140%] text-[#242b3a]"
                        >
                          {typeof craftsman.mentees === 'number' ? `${craftsman.mentees}+ ${t('mentees')}` : t('noMentees')}
                        </p>
                      </div>
                      {typeof craftsman.award === 'string' && craftsman.award && (
                        <div className="flex gap-4 md:gap-[16px] items-center">
                          <div className="rounded-full p-3 w-[48px] h-[48px] bg-white/40 flex justify-center items-center">
                            <Cube />
                          </div>
                          <p
                            style={{ fontSize: 'clamp(11px, 1vw, 2rem)' }}
                            className="font-semibold leading-[140%] text-[#242b3a]"
                          >
                            {craftsman.award}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button className="w-[180px] h-[52px] border-orange-500 flex justify-center items-center">
                      <Link href={`/profile/${craftsman.id}`} className="flex gap-2">
                        <span style={{ fontSize: 'clamp(0.875rem, 1vw + 0.875rem, 1rem)' }}>
                          {t('details')}
                        </span>
                        <Arrow />
                      </Link>
                    </Button> 
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Image
                      src={typeof craftsman.profile_image === 'string' ? `${craftsman.profile_image}` : '/img/craftman.png'}
                      alt={typeof craftsman.user_first_name === 'string' ? craftsman.user_first_name : t('craftsman')}
                      width={542}
                      height={400}
                      className="md:w-[542px] md:h-[400px] w-[100%] h-[250px] rounded-[12px] object-cover"
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