"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
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
import { Group } from "../../../../../public/img/group";
import { Componay } from "../../../../../public/store/pdp/Componay";
import fetchWrapper from "@/services/fetchwrapper";

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
  const [scale, setScale] = useState(1); // Zoom darajasi
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Harakat pozitsiyasi

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
      setScale(1); // Zoomni reset qilish
      setPosition({ x: 0, y: 0 }); // Pozitsiyani reset qilish
    }
  };

  const handleCubeClick = () => {
    setShow3D(true);
    setActiveImage(-1);
  };

  const formatPrice = (price?: number) => {
    return price !== undefined ? price.toLocaleString("uz-UZ") + " so‘m" : "Narx yo‘q";
  };

  // Sichqoncha bilan harakat
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Sichqoncha g‘ildiragi bilan zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01; // Zoom sezgirligi
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 3)); // 1x dan 3x gacha
  };

  // Mobil uchun pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const initialDistance = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY
      );

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length === 2) {
          const newTouch1 = moveEvent.touches[0];
          const newTouch2 = moveEvent.touches[1];
          const newDistance = Math.hypot(
            newTouch1.pageX - newTouch2.pageX,
            newTouch1.pageY - newTouch2.pageY
          );
          setScale((prev) =>
            Math.min(Math.max(prev * (newDistance / initialDistance), 1), 3)
          );
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }
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
              className="relative w-full h-[486px] rounded-lg overflow-hidden bg-gray-100 cursor-move"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
            >
              <div
                className="absolute transition-transform duration-200 ease-in-out"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center",
                }}
              >
                <img
                  src={images[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-[670px] h-[486px] object-cover"
                />
              </div>
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
                  <img
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-[100px] h-[100px] object-cover"
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
            <div className="flex items-start gap-2">
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
            <Button className="bg-primary hover:bg-primary/90 text-white py-6 px-8 rounded-md w-full">
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