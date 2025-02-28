"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ProductType {
  id: string
  image: string
  category: string
  title: string
  workshop: string
  currentPrice: number
  originalPrice: number | null
  isFavorite: boolean
  discount: number
  description: string
  artisans: string[]
  images: string[]  // Add images array for product detail images
  thumbnails: string[]  // Add thumbnails for image previews
  rating: number  // Add rating field
  totalRatings: number  // Add totalRatings field
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[224px]">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href={'/'} className="hover:text-primary">Bosh sahifa</Link>
        <span className="mx-2">/</span>
        <Link href={'/store'} className="hover:text-primary">Dokon</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-white">
            <Image
              src={images[activeImage] || "/placeholder.svg"} // fallback to placeholder if no image
              alt="Product image"
              width={100}
              height={100}
              className="w-[670px] h-[486px]"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto p-[5px]">
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden cursor-pointer min-w-[80px] ${activeImage === index ? "ring-2 ring-primary" : ""}`}
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
                <Star key={i} className={`w-5 h-5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/40 text-yellow-400"}`} />
              ))}
            </div>
            <span className="ml-2 font-medium">{product.rating}</span>
            <span className="ml-2 text-muted-foreground">({product.totalRatings} ta baho)</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Artisan Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span className="font-medium">{product.workshop}</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <div>
                <span className="font-medium">Hunarmand ustalar: </span>
                <span className="text-muted-foreground">
                  {Array.isArray(product.artisans) ? product.artisans.join(", ") : "No artisans available"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{product.currentPrice} so'm</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through">{product.originalPrice} so'm</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
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
            <Button className="bg-[#7D1F1F] hover:bg-[#6a1a1a] text-white py-6 px-8 rounded-md">Sotib olish</Button>
            <Button
              variant="outline"
              className="border-pink-100 bg-pink-50 text-[#7D1F1F] hover:bg-pink-100 py-6 px-8 rounded-md"
            >
              <Heart className="mr-2 h-5 w-5" />
              Savatcha qo'shish
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 inline-flex items-center">
          <span className="text-primary mr-2">•</span>
          HAQIDA
        </h2>
        <h3 className="text-2xl font-bold mb-6">{product.title}</h3>
        <div className="space-y-4 text-muted-foreground">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
