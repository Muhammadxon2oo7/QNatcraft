"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Badge } from "@/components/ui/badge";
import { Dot } from "@/components/dot/Dot";
import { Litsense } from "../../../public/img/litsense";
import { Cube } from "../../../public/img/cube";
import { Group } from "../../../public/img/group";
import { Button } from "@/components/ui/button";
import { Arrow } from "../../../public/img/Arrow";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { z } from "zod";

// API javoblarini validatsiya qilish uchun Zod sxemalari (moslashuvchan qilingan)
const CraftsmanSchema = z.object({
  id: z.number(),
  user_email: z.string().nullable().optional(),
  user_first_name: z.string().nullable().optional(),
  is_verified: z.boolean().optional().default(false),
  profession: z.number().nullable().optional(),
  bio: z.string().nullable().optional(),
  profile_image: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  experience: z.number().optional().default(0),
  mentees: z.number().optional().default(0),
  award: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  user: z.number().optional(),
});

const ProfessionSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional().default("Unknown"),
});

// Interfeyslar
interface Craftsman extends z.infer<typeof CraftsmanSchema> {}
interface Profession extends z.infer<typeof ProfessionSchema> {}

// Alohida karta komponenti
const CraftsmanCard = ({
  craftsman,
  isActive,
  isNext,
  isPrev,
  isVisible,
  getProfessionName,
  t,
}: {
  craftsman: Craftsman;
  isActive: boolean;
  isNext: boolean;
  isPrev: boolean;
  isVisible: boolean;
  getProfessionName: (professionId: number | null | undefined) => string; // Type updated to include undefined
  t: (key: string, params?: any) => string;
}) => {
  const cardClass = isActive
    ? "opacity-100 scale-100 bg-[#ffa8a8] z-20"
    : isNext || isPrev
    ? "opacity-80 scale-95 bg-white z-10"
    : isVisible
    ? "opacity-60 scale-90 bg-white z-0"
    : "opacity-0 scale-90 bg-white z-0 hidden";

  return (
    <div
      className={`rounded-3xl p-4 sm:p-6 transition-all duration-500 ease-in-out w-full ${cardClass} shadow-md flex flex-col h-full`}
    >
      <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6 flex-1">
        {/* Matnli qism */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Badge
              className="rounded-full bg-primary text-white inline-flex gap-2 p-2 sm:p-3 mb-4 hover:bg-primary"
              aria-label={t("professionBadge", { profession: getProfessionName(craftsman.profession) })}
            >
              <Dot />
              <p className="font-medium text-xs sm:text-sm">{getProfessionName(craftsman.profession)}</p>
            </Badge>
            <h3 className="text-lg sm:text-xl font-semibold text-[#242b3a] line-clamp-2">
              {craftsman.user_first_name || t("unknown")}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-3">
              {craftsman.bio || t("noBio")}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full p-1.5 sm:p-2 bg-white/40">
                  <Litsense />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#242b3a]">
                  {craftsman.experience} {t("yearsExperience")}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full p-1.5 sm:p-2 bg-white/40">
                  <Group />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#242b3a]">
                  {craftsman.mentees}+ {t("mentees")}
                </p>
              </div>
              {craftsman.award && (
                <div className="flex items-center gap-2 sm:gap-3 col-span-2">
                  <div className="rounded-full p-1.5 sm:p-2 bg-white/40">
                    <Cube />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#242b3a] line-clamp-1">{craftsman.award}</p>
                </div>
              )}
            </div>
          </div>
          <Button
            className="w-[140px] sm:w-[160px] h-10 sm:h-12 border-orange-500 flex gap-2 items-center hover:bg-primary"
            aria-label={t("viewDetails", { name: craftsman.user_first_name || t("unknown") })}
          >
            <Link href={`/profile/${craftsman.id}`} className="flex gap-2 items-center">
              <span className="text-xs sm:text-sm">{t("details")}</span>
              <Arrow />
            </Link>
          </Button>
        </div>
        {/* Rasm qismi */}
        <div className="flex-shrink-0 w-full md:w-[200px] lg:w-[250px]">
          <Image
            src={craftsman.profile_image || "/img/craftman.png"}
            alt={craftsman.user_first_name || t("unknown")}
            width={250}
            height={200}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-2xl object-cover w-full h-[200px] sm:h-[250px] md:h-[300px]"
            priority={isActive}
            loading={isActive ? "eager" : "lazy"}
          />
        </div>
      </div>
    </div>
  );
};

const CustomSwiper = () => {
  const t = useTranslations("home.swiper");
  const [activeIndex, setActiveIndex] = useState(0);
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API’dan kasblarni olish
  const fetchProfessions = useCallback(async () => {
    try {
      const response = await fetch("https://qqrnatcraft.uz/accounts/professions/");
      if (!response.ok) {
        console.error("Professions fetch failed:", response.status, response.statusText);
        throw new Error(t("errors.professionsFetch"));
      }
      const data = await response.json();
      const validatedData = ProfessionSchema.array().parse(data);
      setProfessions(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation error for professions:", error.errors);
      } else {
        console.error("Professions fetch error:", error);
      }
      setError(t("errors.professionsFetch"));
    }
  }, [t]);

  // API’dan hunarmandlarni olish
  const fetchCraftsmen = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://qqrnatcraft.uz/accounts/profiles/");
      if (!response.ok) {
        console.error("Craftsmen fetch failed:", response.status, response.statusText);
        throw new Error(t("errors.craftsmenFetch"));
      }
      const data = await response.json();
      console.log("API response data:", data);
      const validatedData = CraftsmanSchema.array().parse(data);
      const verifiedCraftsmen = validatedData.filter((craftsman) => craftsman.is_verified);
      setCraftsmen(verifiedCraftsmen);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod validation error for craftsmen:", error.errors);
      } else {
        console.error("Craftsmen fetch error:", error);
      }
      setError(t("errors.craftsmenFetch"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Dastlabki ma'lumotlarni olish
  useEffect(() => {
    Promise.all([fetchProfessions(), fetchCraftsmen()]);
  }, [fetchProfessions, fetchCraftsmen]);

  // Kasb nomini olish (Type updated to handle undefined)
  const getProfessionName = useCallback(
    (professionId: number | null | undefined) => {
      if (!professionId) return t("unknown");
      const profession = professions.find((p) => p.id === professionId);
      return profession?.name || t("unknown");
    },
    [professions, t]
  );

  // Swiper sozlamalari
  const swiperSettings = useMemo(
    () => ({
      modules: [Navigation, Autoplay],
      loop: craftsmen.length >= 2,
      slidesPerView: 2.5,
      centeredSlides: true,
      spaceBetween: 24,
      grabCursor: true,
      navigation: {
        prevEl: ".swiper-arrow-prev",
        nextEl: ".swiper-arrow-next",
      },
      autoplay: { delay: 3000, disableOnInteraction: false },
      speed: 800,
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 12 },
        640: { slidesPerView: 1.5, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 2.5, spaceBetween: 24 },
      },
    }),
    [craftsmen.length]
  );

  // Yuklanish holati
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm sm:text-base">{t("loading")}</p>
      </div>
    );
  }

  // Xato holati
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p className="text-sm sm:text-base">{error}</p>
        <Button
          onClick={() => Promise.all([fetchProfessions(), fetchCraftsmen()])}
          className="mt-4 bg-primary hover:bg-primary/90"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  // Yetarli hunarmand yo‘q holati
  if (craftsmen.length < 2) {
    return (
      <div className="text-center py-10">
        <p className="text-sm sm:text-base">
          {t("notEnoughCraftsmen")} (Found: {craftsmen.length})
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <Swiper
        {...swiperSettings}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="relative"
        aria-label={t("craftsmenSwiper")}
      >
        {craftsmen.map((craftsman, index) => {
          const isActive = index === activeIndex;
          const isNext =
            (activeIndex === craftsmen.length - 1 && index === 0) || index === activeIndex + 1;
          const isPrev =
            (activeIndex === 0 && index === craftsmen.length - 1) || index === activeIndex - 1;
          const isVisible = Math.abs(index - activeIndex) <= 2;

          return (
            <SwiperSlide key={craftsman.id}>
              <CraftsmanCard
                craftsman={craftsman}
                isActive={isActive}
                isNext={isNext}
                isPrev={isPrev}
                isVisible={isVisible}
                getProfessionName={getProfessionName}
                t={t}
              />
            </SwiperSlide>
          );
        })}
        {/* Navigatsiya tugmalari */}
        <div className="swiper-arrows hidden md:flex absolute top-1/2 w-full justify-between transform -translate-y-1/2 px-4 sm:px-6 z-30">
          <button
            className="swiper-arrow-prev bg-primary hover:bg-primary transition-colors rounded-full p-2 sm:p-3"
            aria-label={t("previousSlide")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            className="swiper-arrow-next bg-primary hover:bg-primary transition-colors rounded-full p-2 sm:p-3"
            aria-label={t("nextSlide")}
          >
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