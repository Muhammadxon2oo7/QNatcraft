"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Componay } from "../../../../../public/store/pdp/Componay";
import { Group } from "../../../../../public/store/pdp/Group";

interface ProductType {
  id: string;
  image: string;
  category: string;
  title: string;
  workshop: string;
  currentPrice: number;
  originalPrice: number | null;
  isFavorite: boolean;
  discount: number;
  description: string;
  artisans: string[];
  images: string[];
  thumbnails: string[];
  rating: number;
  totalRatings: number;
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  // For image zoom and cursor tracking
  const [zoom, setZoom] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedProduct");
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct));
    }
  }, []);

  const images = product?.images || [];
  const thumbnails = product?.thumbnails || [];

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle zoom effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (zoom) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setCursorPosition({ x, y });
    }
  };

  // Loading state
  if (!product) {
    return (
      <div className="flex justify-center items-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-[224px]">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href={"/"} className="hover:text-primary">
            Bosh sahifa
          </Link>
          <span className="mx-2">/</span>
          <Link href={"/store"} className="hover:text-primary">
            Dokon
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className="rounded-lg overflow-hidden bg-white relative"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={images[activeImage] || "/placeholder.svg"}
                alt="Product image"
                width={100}
                height={100}
                className="w-[670px] h-[486px] cursor-pointer transition-transform duration-300 ease-in-out"
                style={{
                  transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`,
                  transform: zoom ? 'scale(2)' : 'scale(1)',
                }}
                onClick={handleImageClick}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto p-[5px]">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden cursor-pointer min-w-[80px] ${
                    activeImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>

            {/* Ratings */}
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating
                        ? "fill-primary text-primary"
                        : "fill-primary primary"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-medium">{product.rating}</span>
              <span className="ml-2 text-muted-foreground">
                ({product.totalRatings} ta baho)
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Artisan Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-[46px] flex justify-center items-center w-[40px] h-[40px] backdrop-blur-[44px] bg-[#f6f6f6]">
                  <Componay />
                </div>
                <span className="font-medium text-[#242b3a]">{product.workshop}</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="rounded-[46px] flex justify-center items-center w-[40px] h-[40px] backdrop-blur-[44px] bg-[#f6f6f6]">
                  <Group />
                </div>
                <div>
                  <span className="font-medium text-[#242b3a]">Hunarmand ustalar: </span>
                  <span className="text-muted-foreground">
                    {Array.isArray(product.artisans)
                      ? product.artisans.join(", ")
                      : "No artisans available"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.currentPrice} so'm
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  {product.originalPrice} so'm
                </span>
              )}
              {product.discount && (
                <span className="text-sm text-red-500">
                  {product.discount}% chegirma
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-[4px]">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-12 h-[40px] flex justify-center items-center text-center rounded-[20px] bg-[#f6f6f6] font-medium">{quantity}</div>
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
    </>
  );
}
