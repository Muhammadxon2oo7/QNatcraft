'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dot } from '@/components/dot/Dot';
import { Litsense } from '../../../../public/img/litsense';
import { Cube } from '../../../../public/img/cube';
import { Group } from '../../../../public/img/group';
import { Arrow } from '../../../../public/img/Arrow';
import { ArrowRight, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../..//context/auth-context';
import { toast } from 'sonner';
import { PriceTag } from '../../../../public/store/PriceTag';

interface Craftsman {
  id: number;
  first_name: string;
  email: string;
  bio: string;
  profile_image: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  experience: number;
  mentees: number;
  award: string | null;
  profession: { id: number; name: string };
  products: Product[];
}

interface Product {
  id: number;
  category: number;
  product_images: { id: number; image: string; product: number }[];
  user: number;
  is_liked: boolean;
  like_count: number;
  name: string;
  description: string;
  price: string;
  threed_model: string | null;
  discount: string | null;
  address: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const CraftsmanProfile = () => {
  const t = useTranslations('home.profile');
  const { id } = useParams();
  const { user, getToken } = useAuth();
  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCraftsman = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://qqrnatcraft.uz/main/craftsmens/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(t('errors.craftsmanFetch'));
        }
        const data: Craftsman = await response.json();
        setCraftsman(data);
      } catch (error) {
        setError(t('errors.craftsmanFetch'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCraftsman();
  }, [id, t]);

  const toggleLike = useCallback(
    async (productId: number) => {
      if (!user) {
        toast.error(t('errors.pleaseLogin'));
        return;
      }

      setIsLiking(productId);
      try {
        const token = await getToken();
        if (!token) {
          toast.error(t('errors.noToken'));
          return;
        }

        const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/like/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || t('errors.likeFailed'));
        }

        const data = await response.json();
        setCraftsman((prev) =>
          prev
            ? {
                ...prev,
                products: prev.products.map((product) =>
                  product.id === productId
                    ? {
                        ...product,
                        is_liked: data.status === 'liked',
                        like_count: data.status === 'liked' ? product.like_count + 1 : product.like_count - 1,
                      }
                    : product
                ),
              }
            : prev
        );

        toast.success(data.status === 'liked' ? t('liked') : t('unliked'));
      } catch (error: any) {
        toast.error(error.message || t('errors.likeFailed'));
      } finally {
        setIsLiking(null);
      }
    },
    [user, getToken, craftsman, t]
  );

  const formatPrice = useCallback((price: string | number) => {
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(priceNum) ? '0' : new Intl.NumberFormat('uz-UZ').format(priceNum);
  }, []);

  const calculateOriginalPrice = useCallback((price: string, discount?: string | null) => {
    const priceNum = parseFloat(price);
    if (!discount || isNaN(priceNum)) return priceNum;
    const discountNum = parseFloat(discount);
    return isNaN(discountNum) ? priceNum : Math.round(priceNum / (1 - discountNum / 100));
  }, []);

  const saveProductToLocal = useCallback((product: Product) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedProduct', JSON.stringify(product));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error || !craftsman) {
    return <div className="text-center py-10 text-red-500">{error || t('errors.craftsmanNotFound')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              src={craftsman.profile_image || '/img/craftman.png'}
              alt={craftsman.first_name || t('unknown')}
              width={400}
              height={400}
              className="rounded-2xl object-cover w-full md:w-[400px] h-[300px] md:h-[400px]"
            />
          </div>
          <div className="flex-1">
            <Badge className="rounded-full bg-primary text-white inline-flex gap-2 p-3 mb-4 hover:bg-primary">
              <Dot />
              <p className="font-medium">{craftsman.profession?.name || t('unknown')}</p>
            </Badge>
            <h1 className="text-3xl font-bold text-[#242b3a] mb-2">{craftsman.first_name || t('unknown')}</h1>
            <p className="text-gray-500 mb-6">{craftsman.bio || t('noBio')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-white/40 flex justify-center items-center">
                  <Litsense />
                </div>
                <p className="font-semibold text-[#242b3a]">
                  {craftsman.experience || 0} {t('yearsExperience')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-white/40 flex justify-center items-center">
                  <Group />
                </div>
                <p className="font-semibold text-[#242b3a]">
                  {craftsman.mentees || 0}+ {t('mentees')}
                </p>
              </div>
              {craftsman.award && (
                <div className="flex items-center gap-4">
                  <div className="rounded-full p-3 bg-white/40 flex justify-center items-center">
                    <Cube />
                  </div>
                  <p className="font-semibold text-[#242b3a]">{craftsman.award}</p>
                </div>
              )}
              {craftsman.phone_number && (
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-[#242b3a]">{craftsman.phone_number}</p>
                </div>
              )}
              {craftsman.address && (
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-[#242b3a]">{craftsman.address}</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </motion.div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#242b3a] mb-6">{t('store')}</h2>
        {craftsman.products.length === 0 ? (
          <div className="text-center w-full py-10 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-500">{t('noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {craftsman.products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white overflow-hidden shadow-sm border border-gray-100 p-4 rounded-2xl"
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 flex flex-col">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                      • {craftsman.profession?.name || t('unknown')}
                    </span>
                    {product.discount && (
                      <span className="text-xs font-semibold mt-1 rounded-full bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">
                        🔥 -{product.discount}%
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: user ? 1.2 : 1 }}
                    disabled={isLiking === product.id || !user}
                    onClick={() => toggleLike(product.id)}
                    className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${
                      isLiking === product.id || !user ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label={product.is_liked ? t('unlike') : t('like')}
                    title={!user ? t('pleaseLogin') : ''}
                  >
                    <div className="flex items-center gap-1">
                      <Heart
                        size={20}
                        className={product.is_liked && user ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                      />
                      <span className="text-xs font-medium text-gray-600">{product.like_count || 0}</span>
                    </div>
                  </motion.button>
                  <div className="aspect-square relative overflow-hidden mb-4 rounded-2xl">
                    <Image
                      src={product.product_images?.[0]?.image || '/placeholder.svg'}
                      alt={product.name || t('unknown')}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-lg font-medium text-[#242b3a] line-clamp-2">{product.name || t('unknown')}</h3>
                  <div className="flex justify-between mt-2">
                    <p className="text-base text-primary flex gap-1">
                      <PriceTag />
                      {formatPrice(product.price || '0')} so'm
                    </p>
                    {product.discount && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatPrice(calculateOriginalPrice(product.price || '0', product.discount))} so'm
                      </p>
                    )}
                  </div>
                </div>
                <Link href={`/store/product/${product.id}`} onClick={() => saveProductToLocal(product)}>
                  <Button
                    variant="default"
                    className="text-sm text-primary font-medium bg-transparent w-full h-12 rounded-2xl border border-primary mt-4"
                  >
                    {t('details')} <ArrowRight />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CraftsmanProfile;
