'use client';

import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { Trophy, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dot } from '@/components/dot/Dot';
import Link from 'next/link';
import { Home } from '../../../public/img/Home';
import { motion } from 'framer-motion';

// Hunarmand ma'lumotlari uchun interface
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

// Kartani memoizatsiya qilish
const CraftsmanCard = memo(({ craftsman, index }: { craftsman: Craftsman; index: number }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        <div className="relative h-[250px] overflow-hidden">
          <Image
            src={typeof craftsman.profile_image === 'string' ? craftsman.profile_image : '/img/craftman.png'}
            alt={typeof craftsman.user_first_name === 'string' ? craftsman.user_first_name : 'Hunarmand'}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            placeholder="blur"
            blurDataURL="/img/placeholder.png"
          />
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-[1fr_200px] gap-4">
            <div>
              <Badge
                className="rounded-full mb-3 bg-[#9e1114] text-white inline-flex gap-2 px-3 py-1 hover:bg-[#530607] transition-colors"
                variant="secondary"
              >
                <Dot />
                <p className="text-sm font-medium">
                  {typeof craftsman.profession === 'string' ? craftsman.profession : 'Hunarmand'}
                </p>
              </Badge>
              <h2 className="text-xl font-semibold mb-2 text-[#242b3a]">
                {typeof craftsman.user_first_name === 'string' ? craftsman.user_first_name : "Noma'lum"}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {typeof craftsman.bio === 'string' ? craftsman.bio : "Ma'lumot yo'q"}
              </p>
              <Link
                href={`/profile/${craftsman.id}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9e1114] text-white rounded-md hover:bg-[#530607] transition-colors text-sm"
              >
                Batafsil
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-3 text-[#242b3a] text-sm">Yutuqlar</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#9e1114]" />
                  <p className="text-sm font-medium">
                    {typeof craftsman.experience === 'number' ? `${craftsman.experience} yil` : "Tajriba yo'q"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#9e1114]" />
                  <p className="text-sm font-medium">
                    {typeof craftsman.mentees === 'number' ? `${craftsman.mentees}+ shogirt` : "Shogirt yo'q"}
                  </p>
                </div>
                {typeof craftsman.award === 'string' && craftsman.award && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#9e1114]" />
                    <p className="text-sm font-medium">{craftsman.award}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CraftsmanCard.displayName = 'CraftsmanCard';

export default function CraftersDirectory() {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API dan hunarmandlar ma'lumotlarini olish
  useEffect(() => {
    const fetchCraftsmen = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://qqrnatcraft.uz/accounts/profiles/', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");
        }
        const data = await response.json();

        // API javobini massiv sifatida normalizatsiya qilish
        const craftsmenData = Array.isArray(data) ? data : [data];
        // Faqat is_verified: true bo'lganlarni filtrlaymiz
        const verifiedCraftsmen = craftsmenData.filter((craftsman: Craftsman) => craftsman.is_verified === true);
        setCraftsmen(verifiedCraftsmen);
      } catch (error) {
        console.error('Hunarmandlarni olishda xatolik:', error);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCraftsmen();
  }, []);

  // Skeleton loading komponenti
  const SkeletonCard = () => (
    <div className="border rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        <div className="relative h-[250px] bg-gray-200" />
        <div className="p-5">
          <div className="grid md:grid-cols-[1fr_200px] gap-4">
            <div>
              <div className="h-6 w-24 bg-gray-200 rounded-full mb-3" />
              <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-full" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Yuklanayotgan holat yoki xatolikni ko'rsatish
  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (craftsmen.length === 0) {
    return <div className="text-center py-10">Tasdiqlangan hunarmandlar topilmadi</div>;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 border-b border-gray-200 py-4">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#242b3a] transition-colors">
          <Home /> Bosh sahifa
        </Link>
        <span>/</span>
        <span className="text-[#242b3a] font-medium">Hunarmandlar</span>
      </div>

      <div className="text-center my-8">
        <Badge className="rounded-full mb-4 bg-[#fcdbdb] text-[#9e1114] inline-flex gap-2 px-3 py-1 hover:bg-[#ffe4e4] transition-colors">
          <Dot />
          <p className="text-sm font-semibold">HUNARMANDLAR</p>
        </Badge>
        <h1 className="text-3xl font-bold text-[#242b3a]">Usta Hunarmandlar</h1>
      </div>

      <div className="space-y-6">
        {craftsmen.map((craftsman, index) => (
          <CraftsmanCard key={craftsman.id} craftsman={craftsman} index={index} />
        ))}
      </div>
    </div>
  );
}