"use client"

import type React from "react"

import { useState, useEffect, Suspense, useRef } from "react"
import { useParams } from "next/navigation"
import { Heart, Minus, Plus, ShoppingBag, Star, Loader2, LoaderPinwheel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Model from "@/components/Store/Model/Model"
import { Html } from "@react-three/drei"
import { Cube } from "../../../../../public/store/model/Cube"
import { Group } from "../../../../../public/store/pdp/Group"
import fetchWrapper from "@/services/fetchwrapper"
import { ContactDialog } from "@/components/Store/ContactModal/Contact-Modal"


// Dummy component to replace Componay
const Componay = () => {
  return <div>C</div>
}

interface RawProductType {
  id: number
  category: {
    id: number
    product_count: number
    name: string
    description: string
    image: string | null
  }
  product_images: { id: number; image: string; product: number }[]
  name: string
  description: string
  price: string
  threed_model: string | null
  discount: string
  address: string
  view_count: number
  created_at: string
  updated_at: string
}

interface ProductType {
  id: number
  category: {
    id: number
    product_count: number
    name: string
    description: string
    image: string | null
  }
  product_images: { id: number; image: string; product: number }[]
  name: string
  description: string
  price: number
  threed_model: string | null
  discount: number
  address: string
  view_count: number
  created_at: string
  updated_at: string
  originalPrice?: number | null
  workshop?: string
  artisans?: string[]
  images?: string[]
  thumbnails?: string[]
  rating?: number
  totalRatings?: number
  isFavorite?: boolean
}

export default function ProductDetail() {
  const [product, setProduct] = useState<ProductType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [show3D, setShow3D] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number } | null>(null)
  const [zoomLevel, setZoomLevel] = useState(3) // Default 3x zoom
  const [isZoomActive, setIsZoomActive] = useState(false)
  const [isHoveringControls, setIsHoveringControls] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const controlsRef = useRef<HTMLDivElement>(null)

  const params = useParams()
  const productId = params?.id as string | undefined

  useEffect(() => {
    if (!productId || typeof productId !== "string") {
      setError("Noto'g'ri mahsulot ID")
      setIsLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const rawData = await fetchWrapper(`/api/products/${productId}`)
        console.log("API javobi:", rawData)
        const data = rawData as RawProductType

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
          workshop: data.address || "Noma'lum",
          artisans: [],
          images: data.product_images.map((img) => img.image),
          thumbnails: data.product_images.map((img) => img.image),
          rating: 0,
          totalRatings: 0,
          isFavorite: false,
        }
        setProduct(transformedData)
      } catch (err) {
        console.error("Mahsulotni yuklashda xatolik:", err)
        setError("Mahsulotni yuklashda xato yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const images = product?.images || []
  const thumbnails = product?.thumbnails || []

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1)

  const handleThumbnailClick = (index: number) => {
    if (index >= 0 && index < images.length) {
      setActiveImage(index)
      setShow3D(false)
    }
  }

  const handleCubeClick = () => {
    setShow3D(true)
    setActiveImage(-1)
  }

  const formatPrice = (price?: number) => {
    return price !== undefined ? price.toLocaleString("uz-UZ") + " so'm" : "Narx yo'q"
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if we're hovering over the controls area
    if (controlsRef.current) {
      const controlsRect = controlsRef.current.getBoundingClientRect()
      const isOverControls =
        e.clientX >= controlsRect.left &&
        e.clientX <= controlsRect.right &&
        e.clientY >= controlsRect.top &&
        e.clientY <= controlsRect.bottom

      if (isOverControls) {
        setIsHoveringControls(true)
        return
      } else {
        setIsHoveringControls(false)
      }
    }

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setIsZoomActive(true)
      // Add a slight delay for smoother movement
      requestAnimationFrame(() => {
        setZoomPosition({
          x: Math.max(90, Math.min(rect.width - 90, x)),
          y: Math.max(90, Math.min(rect.height - 90, y)),
        })
      })
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if we're moving to the controls
    if (controlsRef.current) {
      const controlsRect = controlsRef.current.getBoundingClientRect()
      const isMovingToControls =
        e.clientX >= controlsRect.left &&
        e.clientX <= controlsRect.right &&
        e.clientY >= controlsRect.top &&
        e.clientY <= controlsRect.bottom

      if (isMovingToControls) {
        setIsHoveringControls(true)
        return
      }
    }

    setZoomPosition(null)
    setIsZoomActive(false)
    setIsHoveringControls(false)
  }

  const handleControlsMouseEnter = () => {
    setIsHoveringControls(true)
  }

  const handleControlsMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isLeavingToImage =
      e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom

    if (isLeavingToImage) {
      setIsHoveringControls(false)
    } else {
      // If not leaving to the image, we're leaving the page
      setIsHoveringControls(false)
      setIsZoomActive(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return <div className="flex justify-center items-center py-20 text-red-500">{error || "Mahsulot topilmadi"}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Bosh sahifa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/store" className="hover:text-primary">
          Do'kon
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 w-full max-w-[670px] relative">
          {!show3D ? (
            <div className="relative">
              <div
                className="relative w-full h-[486px] rounded-lg overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={images[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-crosshair"
                />

                {/* Zoom controls - always visible when zoom is active */}
                {isZoomActive && (
                  <div
                    ref={controlsRef}
                    className="absolute top-4 right-4 bg-black/70 rounded-full px-3 py-1 flex items-center gap-2 z-30"
                    onMouseEnter={handleControlsMouseEnter}
                    onMouseLeave={handleControlsMouseLeave}
                  >
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(1.5, prev - 0.5))}
                      className="text-white hover:text-primary transition-colors"
                      disabled={zoomLevel <= 1.5}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white text-xs font-medium">{zoomLevel.toFixed(1)}x</span>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(5, prev + 0.5))}
                      className="text-white hover:text-primary transition-colors"
                      disabled={zoomLevel >= 5}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Magnifying glass - only show when zoom is active and not hovering over controls */}
                {zoomPosition && isZoomActive && !isHoveringControls && (
                  <div
                    className="absolute pointer-events-none transition-all duration-75 ease-in-out z-10  cursor-none"
                    style={{
                      width: "150px",
                      height: "150px",
                      top: `${zoomPosition.y - 90}px`,
                      left: `${zoomPosition.x - 90}px`,
                    }}
                  >
                    {/* Magnifying glass handle */}
                    <div
                      className="absolute w-4 h-40 bg-gradient-to-b from-gray-800 to-gray-600 rounded-t-full"
                      style={{
                        top: "180px",
                        left: "88px",
                        transform: "rotate(45deg)",
                        transformOrigin: "top center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    />

                    {/* Magnifying glass rim */}
                    <div
                      className="absolute w-full h-full rounded-full border-[6px] border-gradient-to-br from-gray-700 via-gray-500 to-gray-800"
                      style={{
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.2)",
                        background: "conic-gradient(from 90deg at 50% 50%, #555, #333, #555, #777, #555)",
                        overflow: "hidden",
                      }}
                    >
                      {/* Glass content with zoom effect */}
                      <div
                        className="absolute inset-0 rounded-full overflow-hidden cur"
                        style={{
                          backgroundImage: `url(${images[activeImage] || "/placeholder.svg"})`,
                          backgroundSize: `${670 * zoomLevel}px ${486 * zoomLevel}px`, // Dynamic magnification
                          backgroundPosition: `-${zoomPosition.x * zoomLevel - 90}px -${zoomPosition.y * zoomLevel - 90}px`,
                          boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
                        }}
                      >
                        {/* Glass reflection effect */}
                        <div
                          className="absolute w-full h-full bg-gradient-to-br from-white/20 to-transparent"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 70%)",
                            transform: "translateY(-20%)",
                          }}
                        />

                        {/* Crosshair for precise targeting */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                          <div className="w-[1px] h-6 bg-white/80" />
                          <div className="h-[1px] w-6 bg-white/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    i < Math.round(product.rating || 0) ? "fill-primary text-primary" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating !== undefined ? product.rating.toFixed(1) : "N/A"}</span>
            <span className="text-muted-foreground">({product.totalRatings} baho)</span>
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
                    : "Ma'lumot yo'q"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice !== undefined && product.originalPrice !== null && (
              <span className="text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount > 0 && <span className="text-sm text-red-500">{product.discount}% chegirma</span>}
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
            <Button
              className="bg-primary text-white py-6 px-8 rounded-md w-full"
              onClick={() => setIsContactDialogOpen(true)}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Bog'lanish
            </Button>
            <Button variant="outline" className="w-full py-6 px-8 rounded-md">
              <Heart className="w-4 h-4 mr-2" />
              Sevimlilarga qo'shish
            </Button>
            <Button variant="outline" className="w-full py-6 px-8 rounded-md">
              <Heart className="w-4 h-4 mr-2" />
              Sotib olish
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactDialog isOpen={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
    </div>
  )
}

