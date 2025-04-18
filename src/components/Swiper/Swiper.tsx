'use client';

import { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Badge } from '@/components/ui/badge';
import { Dot } from '@/components/dot/Dot';
import { Litsense } from '../../../public/img/litsense';
import { Cube } from '../../../public/img/cube';
import { Group } from '../../../public/img/group';
import { Button } from '@/components/ui/button';
import { Arrow } from '../../../public/img/Arrow';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Craftsman va Profession interfeyslari o'zgarmadi, shuning uchun qisqartirdim
interface Craftsman {
  id: number;
  user_email: string;
  user_first_name: string;
  is_verified: boolean;
  profession: string | null;
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

interface Profession {
  id: number;
  name: string;
}

const CustomSwiper = () => {
  const t = useTranslations('home.swiper');
  const [activeIndex, setActiveIndex] = useState(0);
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessions = useCallback(async () => {
    try {
      const response = await fetch('https://qqrnatcraft.uz/accounts/professions/');
      if (!response.ok) throw new Error(t('errors.professionsFetch'));
      const data: Profession[] = await response.json();
      setProfessions(data);
    } catch (error) {
      setError(t('errors.professionsFetch'));
    }
  }, [t]);

  const fetchCraftsmen = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://qqrnatcraft.uz/accounts/profiles/');
      if (!response.ok) throw new Error(t('errors.craftsmenFetch'));
      const data: Craftsman[] = await response.json();
      const verifiedCraftsmen = data.filter((craftsman) => craftsman.is_verified);
      setCraftsmen(verifiedCraftsmen);
    } catch (error) {
      setError(t('errors.craftsmenFetch'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfessions();
    fetchCraftsmen();
  }, [fetchProfessions, fetchCraftsmen]);

  const getProfessionName = useCallback(
    (professionId: string | null) => {
      if (!professionId) return t('unknown');
      const profession = professions.find((p) => p.id === Number(professionId));
      return profession?.name || t('unknown');
    },
    [professions, t]
  );

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (craftsmen.length < 2) {
    return (
      <div className="text-center py-10">
        <p>{t('notEnoughCraftsmen')} (Found: {craftsmen.length})</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        loop={true}
        slidesPerView={2.5} // Ko'proq kartalar ko'rinsin
        centeredSlides={true}
        spaceBetween={24}
        grabCursor={true}
        navigation={{
          prevEl: '.swiper-arrow-prev',
          nextEl: '.swiper-arrow-next',
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={800}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="relative"
        breakpoints={{
          640: { slidesPerView: 1.5, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 2.5, spaceBetween: 24 },
        }}
      >
        {craftsmen.map((craftsman, index) => {
          const isActive = index === activeIndex;
          const isNext =
            (activeIndex === craftsmen.length - 1 && index === 0) ||
            index === activeIndex + 1;
          const isPrev =
            (activeIndex === 0 && index === craftsmen.length - 1) ||
            index === activeIndex - 1;
          const isVisible = Math.abs(index - activeIndex) <= 2; // Active dan 2 ta uzoqda bo'lgan kartalar ko'rinsin

          const cardClass = isActive
            ? 'opacity-100 scale-100 bg-[#ffa8a8] z-20'
            : isNext || isPrev
            ? 'opacity-80 scale-95 bg-white z-10'
            : isVisible
            ? 'opacity-60 scale-90 bg-white z-0' // Ko'rinadigan qolgan kartalar
            : 'opacity-0 scale-90 bg-white z-0'; // Butunlay ko'rinmaydigan kartalar

          return (
            <SwiperSlide key={craftsman.id}>
              <div
                className={`rounded-3xl p-4 transition-all duration-500 ease-in-out w-full ${cardClass} shadow-md`}
              >
                <div className="flex flex-col-reverse md:flex-row gap-6">
                  <div className="flex-1">
                    <Badge className="rounded-full bg-primary text-white inline-flex gap-2 p-3 mb-4 hover:bg-primary">
                      <Dot />
                      <p className="font-medium text-sm">{getProfessionName(craftsman.profession)}</p>
                    </Badge>
                    <h3 className="text-xl font-semibold text-[#242b3a]">
                      {craftsman.user_first_name || t('unknown')}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                      {craftsman.bio || t('noBio')}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-white/40">
                          <Litsense />
                        </div>
                        <p className="text-sm font-semibold text-[#242b3a]">
                          {craftsman.experience} {t('yearsExperience')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full p-2 bg-white/40">
                          <Group />
                        </div>
                        <p className="text-sm font-semibold text-[#242b3a]">
                          {craftsman.mentees}+ {t('mentees')}
                        </p>
                      </div>
                      {craftsman.award && (
                        <div className="flex items-center gap-3">
                          <div className="rounded-full p-2 bg-white/40">
                            <Cube />
                          </div>
                          <p className="text-sm font-semibold text-[#242b3a]">{craftsman.award}</p>
                        </div>
                      )}
                    </div>
                    <Button className="w-[160px] h-12 border-orange-500 flex gap-2 items-center hover:bg-primary">
                      <Link href={`/profile/${craftsman.id}`} className="flex gap-2">
                        <span className="text-sm">{t('details')}</span>
                        <Arrow />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex-shrink-0">
                    <Image
                      src={craftsman.profile_image || '/img/craftman.png'}
                      alt={craftsman.user_first_name || t('unknown')}
                      width={400}
                      height={300}
                      className="rounded-2xl object-cover w-full h-[250px] md:h-[300px]"
                      priority={index === activeIndex}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="swiper-arrows hidden md:flex absolute top-1/2 w-full justify-between transform -translate-y-1/2 px-6 z-30">
          <button className="swiper-arrow-prev bg-primary hover:bg-primary transition-colors rounded-full p-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button className="swiper-arrow-next bg-primary hover:bg-primary transition-colors rounded-full p-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>
      </Swiper>
    </div>
  );
};

export default CustomSwiper;