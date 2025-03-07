"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Loader2,
  LoaderPinwheel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "@/components/Store/Model/Model";
import { Html } from "@react-three/drei";
import { Cube } from "../../../../../public/store/model/Cube";

import { Componay } from "../../../../../public/store/pdp/Componay";
import fetchWrapper from "@/services/fetchwrapper";
import { Group } from "../../../../../public/store/pdp/Group";

interface RawProductType {
  id: number;
  category: {
    id: number;
    product_count: number;
    name: string;
    description: string;
    image: string | null;
  };
  product_images: { id: number; image: string; product: number }[];
  name: string;
  description: string;
  price: string;
  threed_model: string | null;
  discount: string;
  address: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface ProductType {
  id: number;
  category: {
    id: number;
    product_count: number;
    name: string;
    description: string;
    image: string | null;
  };
  product_images: { id: number; image: string; product: number }[];
  name: string;
  description: string;
  price: number;
  threed_model: string | null;
  discount: number;
  address: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  originalPrice?: number | null;
  workshop?: string;
  artisans?: string[];
  images?: string[];
  thumbnails?: string[];
  rating?: number;
  totalRatings?: number;
  isFavorite?: boolean;
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null);

  const params = useParams();
  const productId = params?.id as string | undefined;

  useEffect(() => {
    if (!productId || typeof productId !== "string") {
      setError("Noto‘g‘ri mahsulot ID");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const rawData = await fetchWrapper(`/api/products/${productId}`);
        console.log("API javobi:", rawData);
        const data = rawData as RawProductType;

        const transformedData: ProductType = {
          id: data.id,
          category: data.category,
          product_images: data.product_images,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          threed_model: data.threed_model,
          discount: Number(data.discount),
          address: data.address,
          view_count: data.view_count,
          created_at: data.created_at,
          updated_at: data.updated_at,
          originalPrice: null,
          workshop: data.address || "Noma’lum",
          artisans: [],
          images: data.product_images.map((img) => img.image),
          thumbnails: data.product_images.map((img) => img.image),
          rating: 0,
          totalRatings: 0,
          isFavorite: false,
        };
        setProduct(transformedData);
      } catch (err) {
        console.error("Mahsulotni yuklashda xatolik:", err);
        setError("Mahsulotni yuklashda xato yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const images = product?.images || [];
  const thumbnails = product?.thumbnails || [];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const handleThumbnailClick = (index: number) => {
    if (index >= 0 && index < images.length) {
      setActiveImage(index);
      setShow3D(false);
    }
  };

  const handleCubeClick = () => {
    setShow3D(true);
    setActiveImage(-1);
  };

  const formatPrice = (price?: number) => {
    return price !== undefined ? price.toLocaleString("uz-UZ") + " so‘m" : "Narx yo‘q";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setZoomPosition({ x, y });
    } else {
      setZoomPosition(null);
    }
  };

  const handleMouseLeave = () => {
    setZoomPosition(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        {error || "Mahsulot topilmadi"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Bosh sahifa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/store" className="hover:text-primary">
          Do‘kon
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 w-full max-w-[670px] relative">
          {!show3D ? (
            <div
              className="relative w-full h-[486px] rounded-lg overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                width={670}
                height={486}
                className="w-full h-full object-cover cursor-none transition-transform duration-200 ease-in-out"
                style={{
                  transform: zoomPosition ? "scale(1.2)" : "scale(1)", // Ozgina kattalashtirish
                  transformOrigin: zoomPosition
                    ? `${zoomPosition.x}px ${zoomPosition.y}px`
                    : "center",
                }}
                priority
              />
              {zoomPosition && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle 100px at ${zoomPosition.x}px ${zoomPosition.y}px, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%) `,
                  }}
                >
                  <div
                    className="absolute rounded-full shadow-lg transition-all duration-100 ease-in-out cursor-none"
                    style={{
                      width: "200px",
                      height: "200px",
                      top: `${zoomPosition.y - 100}px`,
                      left: `${zoomPosition.x - 100}px`,
                      backgroundImage: `url(${images[activeImage] || "/placeholder.svg"})`,
                      backgroundSize: `${670 * 2.5}px ${486 * 2.5}px`, // 2.5x zoom
                      backgroundPosition: `-${zoomPosition.x * 2.5 - 100}px -${zoomPosition.y * 2.5 - 100}px`,
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                      cursor:"none",
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] shadow-lg rounded-md">
              <Canvas className="w-full h-full">
                <Suspense
                  fallback={
                    <Html center>
                      <LoaderPinwheel className="w-8 h-8 animate-spin" />
                    </Html>
                  }
                >
                  <OrbitControls enableZoom enablePan enableRotate />
                  <ambientLight intensity={2} />
                  <directionalLight position={[10, 10, 10]} intensity={1} />
                  <Model />
                </Suspense>
              </Canvas>
            </div>
          )}
          <div className="flex space-x-2 overflow-x-auto p-2">
            {thumbnails.length > 0 ? (
              thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden cursor-pointer min-w-[60px] max-w-[100px] flex-shrink-0 ${
                    activeImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover aspect-square"
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Rasmlar mavjud emas</p>
            )}
            <div
              className={`border rounded-lg overflow-hidden cursor-pointer w-[100px] flex items-center justify-center bg-gray-300 bg-opacity-20 backdrop-blur-xl border-gray-100 ${
                show3D ? "ring-2 ring-primary" : ""
              }`}
              onClick={handleCubeClick}
            >
              <Cube />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating || 0)
                      ? "fill-primary text-primary"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">
              {product.rating !== undefined ? product.rating.toFixed(1) : "N/A"}
            </span>
            <span className="text-muted-foreground">
              ({product.totalRatings} baho)
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Artisan Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full flex justify-center items-center w-10 h-10 bg-[#f6f6f6]">
                <Componay />
              </div>
              <span className="font-medium text-[#242b3a]">{product.workshop}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full flex justify-center items-center w-10 h-10 bg-[#f6f6f6]">
                <Group />
              </div>
              <div>
                <span className="font-medium text-[#242b3a]">Hunarmand ustalar: </span>
                <span className="text-muted-foreground">
                  {Array.isArray(product.artisans) && product.artisans.length > 0
                    ? product.artisans.join(", ")
                    : "Ma’lumot yo‘q"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice !== undefined && product.originalPrice !== null && (
              <span className="text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-sm text-red-500">
                {product.discount}% chegirma
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-12 h-10 flex justify-center items-center text-center rounded-xl bg-[#f6f6f6] font-medium">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary text-white py-6 px-8 rounded-md w-full">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Savatchaga qo‘shish
            </Button>
            <Button variant="outline" className="w-full py-6 px-8 rounded-md">
              <Heart className="w-4 h-4 mr-2" />
              Sevimlilarga qo‘shish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
