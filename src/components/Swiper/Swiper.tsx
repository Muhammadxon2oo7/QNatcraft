'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
import { Badge } from '@/components/ui/badge';
import { Dot } from '@/components/dot/Dot';
import { Litsense } from '../../../public/img/litsense';
import { Cube } from '../../../public/img/cube';
import { Group } from '../../../public/img/group';
import { Button } from '@/components/ui/button';
import { Arrow } from '../../../public/img/Arrow';
import Link from 'next/link';
import Image from 'next/image';
import { Left } from '../../../public/img/left';
import { Right } from '../../../public/img/right';
import { useTranslations } from 'next-intl';

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
  const splideRef = useRef<Splide | null>(null);

  const fetchProfessions = useCallback(async () => {
    try {
      const response = await fetch('https://qqrnatcraft.uz/accounts/professions/');
      if (!response.ok) {
        throw new Error(t('errors.professionsFetch'));
      }
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
      if (!response.ok) {
        throw new Error(t('errors.craftsmenFetch'));
      }
      const data: Craftsman[] = await response.json();
      setCraftsmen(data.filter((craftsman) => craftsman.is_verified));
    } catch (error) {
      setError(t('errors.craftsmenFetch'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    Promise.all([fetchProfessions(), fetchCraftsmen()]);
  }, [fetchProfessions, fetchCraftsmen]);

  useEffect(() => {
    if (isLoading || error || craftsmen.length === 0) return;

    const splide = new Splide('#splide', {
      type: 'loop',
      autoplay: true,
      interval: 3000, // Increased delay for clear transitions
      speed: 800, // Smooth transition speed
      pauseOnHover: false,
      pauseOnFocus: false,
      perPage: Math.min(craftsmen.length, 3),
      perMove: 1,
      focus: 'center',
      gap: '1.5rem',
      padding: '5%',
      pagination: false,
      waitForTransition: true, // Ensure transitions complete before next move
      breakpoints: {
        640: {
          perPage: 1,
          gap: '1rem',
          padding: '2%',
        },
        768: {
          perPage: 2,
          gap: '1.25rem',
        },
        1024: {
          perPage: Math.min(craftsmen.length, 3),
        },
      },
    });

    splide.on('move', (newIndex: number) => {
      setActiveIndex(newIndex); // Update active index before transition starts
    });

    splide.mount();
    splideRef.current = splide;

    return () => {
      splide.destroy();
      splideRef.current = null;
    };
  }, [isLoading, error, craftsmen]);

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

  if (craftsmen.length === 0) {
    return <div className="text-center py-10">{t('noCraftsmen')}</div>;
  }

  return (
    <div className="mx-auto  px-4">
      <div id="splide" className="splide">
        <div className="splide__arrows hidden md:block">
          <button className="splide__arrow splide__arrow--prev bg-primary hover:bg-primary-dark transition-colors rounded-full p-3">
            <Left />
          </button>
          <button className="splide__arrow splide__arrow--next bg-primary hover:bg-primary-dark transition-colors rounded-full p-3">
            <Right />
          </button>
        </div>
        <div className="splide__track w-full h-auto p-0">
          <ul className="splide__list w-full h-auto flex">
            {craftsmen.map((craftsman, index) => (
              <li
                key={craftsman.id}
                className={`splide__slide bg-white rounded-3xl p-4 transition-all duration-500 ease-in-out w-full ${
                  index === activeIndex
                    ? 'opacity-100 bg-[#e6c7c9] scale-100 shadow-lg z-10'
                    : 'opacity-60 bg-white scale-95 shadow-md z-0'
                }`}
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
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3">{craftsman.bio || t('noBio')}</p>
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
                    <Button
                      className="w-[160px] h-12 border-orange-500 flex gap-2 items-center hover:bg-primary"
                      aria-label={t('viewProfile', { name: craftsman.user_first_name || t('unknown') })}
                    >
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomSwiper;