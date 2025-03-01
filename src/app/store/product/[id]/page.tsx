"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag, Star, Loader, LoaderPinwheel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "@/components/Store/Model/Model";
import { Html } from "@react-three/drei";
import { Cube } from "../../../../../public/store/model/Cube";

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
    try {
      if (typeof window !== "undefined") {
        const savedProduct = localStorage.getItem("selectedProduct");
        if (savedProduct) {
          setProduct(JSON.parse(savedProduct));
        }
      }
    } catch (error) {
      console.error("Mahsulotni yuklashda xatolik:", error);
    }
  }, []);

  const images = product?.images || [];
  const thumbnails = product?.thumbnails || [];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
    setShow3D(false); // Thumbnail bosilganda 3D ni o‘chirish
  };

  const handleCubeClick = () => {
    setShow3D(true);
    setActiveImage(-1); // Cube bosilganda hech qaysi thumbnail aktiv bo‘lmasligi uchun
  };

  if (!product) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[224px]">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Bosh sahifa</Link>
        <span className="mx-2">/</span>
        <Link href="/store" className="hover:text-primary">Dokon</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8">
        <div className="space-y-4 w-[670px]">
          {!show3D ? (
            <Image
              src={images[activeImage] || "/placeholder.svg"}
              alt="Product image"
              width={670}
              height={486}
              className="w-full max-w-[670px] h-auto cursor-pointer"
            />
          ) : (
            <div className="w-full h-[500px] shadow-lg rounded-md">
              <Canvas className="w-full h-full">
                <Suspense fallback={<Html><LoaderPinwheel/></Html>}>
                  <OrbitControls enableZoom enablePan enableRotate />
                  <ambientLight intensity={2} />
                  <directionalLight position={[10, 10, 10]} />
                  <Model />
                </Suspense>
              </Canvas>
            </div>
          )}
          <div className="flex space-x-2 overflow-x-auto p-[5px] ">
            {thumbnails.length > 0 ? (
              thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden cursor-pointer min-w-[50px] ${activeImage === index ? "ring-2 ring-primary" : ""}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image src={thumb || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} width={100} height={100} className=" object-cover aspect-square" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Rasmlar mavjud emas</p>
            )}
            <div
              className={`border rounded-lg overflow-hidden cursor-pointer w-[100px] flex items-center justify-center bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-100 ${show3D ? "ring-2 ring-primary" : ""} ${activeImage === -1 ? "ring-0" : ""}`}
              onClick={() =>{ setShow3D(true),setActiveImage(-1)}}
            >
              <Cube/>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
          <p className="text-muted-foreground">{product.description}</p>
          <Separator />
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{product.currentPrice} so'm</span>
            {product.originalPrice && <span className="text-muted-foreground line-through">{product.originalPrice} so'm</span>}
            {product.discount > 0 && <span className="text-sm text-red-500">{product.discount}% chegirma</span>}
          </div>
          <div className="flex items-center gap-[4px]">
            <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1} className="rounded-full" aria-label="Kamaytirish">
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-12 h-[40px] flex justify-center items-center text-center rounded-[20px] bg-[#f6f6f6] font-medium">{quantity}</div>
            <Button variant="outline" size="icon" onClick={incrementQuantity} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" aria-label="Ko‘paytirish">
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
