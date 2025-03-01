"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Componay } from "../../../../../public/store/pdp/Componay";
import { Group } from "../../../../../public/store/pdp/Group";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Model from "@/components/Store/Model/Model";
import { Html } from "@react-three/drei";

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
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedProduct");
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct));
    }
  }, []);

  const images = product?.images || [];
  const thumbnails = product?.thumbnails || [];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  if (!product) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[224px]">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Bosh sahifa</Link>
        <span className="mx-2">/</span>
        <Link href="/store" className="hover:text-primary">Dokon</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8">
        {/* Product Images & 3D Model */}
        <div className="space-y-4">
          {!show3D ? (
            <Image
              src={images[activeImage] || "/placeholder.svg"}
              alt="Product image"
              width={670}
              height={486}
              className="w-[670px] h-[486px] cursor-pointer"
              onClick={() => setShow3D(true)}
            />
          ) : (
            <Canvas style={{ width: "670px", height: "486px" }}>
            <Suspense fallback={<Html>Yuklanmoqda...</Html>}>
              <OrbitControls enableZoom enablePan enableRotate />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 10]} />
              <Model />
            </Suspense>
          </Canvas>


          )}
          <Button onClick={() => setShow3D(!show3D)} className="w-full">
            {show3D ? "Rasmni ko‘rish" : "3D modelni ko‘rish"}
          </Button>
          <div className="flex space-x-2 overflow-x-auto p-[5px]">
            {thumbnails.map((thumb, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden cursor-pointer min-w-[80px] ${
                  activeImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image src={thumb || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} width={100} height={100} className="w-full h-auto object-cover aspect-square" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
          <p className="text-muted-foreground">{product.description}</p>
          <Separator />
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{product.currentPrice} so'm</span>
            {product.originalPrice && <span className="text-muted-foreground line-through">{product.originalPrice} so'm</span>}
            {product.discount && <span className="text-sm text-red-500">{product.discount}% chegirma</span>}
          </div>
          <div className="flex items-center gap-[4px]">
            <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="rounded-full">
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-12 h-[40px] flex justify-center items-center text-center rounded-[20px] bg-[#f6f6f6] font-medium">{quantity}</div>
            <Button variant="outline" size="icon" onClick={incrementQuantity} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary text-white py-6 px-8 rounded-md w-full">
              <ShoppingBag className="w-4 h-4 mr-2" /> Savatchaga qo‘shish
            </Button>
            <Button variant="outline" className="w-full py-6 px-8 rounded-md">
              <Heart className="w-4 h-4 mr-2" /> Sevimlilarga qo‘shish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}