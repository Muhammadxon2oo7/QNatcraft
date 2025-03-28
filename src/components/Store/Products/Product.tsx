"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import { ArrowRight, AlertCircle, RefreshCw, Search } from "lucide-react"
import { motion } from "framer-motion"
import Filter from "../Filter/Filter"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { PriceTag } from "../../../../public/store/PriceTag"

const ITEMS_PER_PAGE = 8

interface Product {
  id: number
  name: string
  price: number
  discount?: number
  category: {
    id: number
    name: string
    product_count: number
    description: string
    image: string | null
  }
  product_images: { id: number; image: string; product: number }[]
  threed_model?: string
  description?: string
  address?: string
  view_count?: number
  created_at?: string
  updated_at?: string
}

interface Category {
  id: number
  name: string
  product_count: number
  description: string
  image: string | null
}

export default function ProductList() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [sortByDiscount, setSortByDiscount] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const isProcessingFilterChangeRef = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch("https://qqrnatcraft.uz/api/categories/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("https://qqrnatcraft.uz/api/products/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ])

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error(
            `Failed to fetch data: Categories (${categoriesResponse.status}), Products (${productsResponse.status})`
          )
        }

        const categoriesData = await categoriesResponse.json()
        const productsData = await productsResponse.json()

        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setAllProducts(Array.isArray(productsData) ? productsData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")
        setAllProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = useCallback(
    (categories: number[], sortDiscount: boolean, search?: string) => {
      if (isProcessingFilterChangeRef.current) return

      isProcessingFilterChangeRef.current = true
      try {
        setSelectedCategories(categories)
        setSortByDiscount(sortDiscount)
        setCurrentPage(1)
        if (search !== undefined) setSearchTerm(search)
      } finally {
        isProcessingFilterChangeRef.current = false
      }
    },
    []
  )

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return []

    let filtered = [...allProducts]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.category?.name?.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => product.category?.id && selectedCategories.includes(product.category.id))
    }

    if (sortByDiscount) {
      filtered = filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return filtered
  }, [allProducts, searchTerm, selectedCategories, sortByDiscount])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSaveProductToLocal = useCallback((product: Product) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedProduct", JSON.stringify(product))
    }
  }, [])

  const calculateOriginalPrice = useCallback((price: number, discount?: number) => {
    if (!discount) return price
    return Math.round(price / (1 - discount / 100))
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price)
  }, [])

  const retryFetch = useCallback(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch("/api/categories/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("/api/products/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ])

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error(
            `Failed to fetch data: Categories (${categoriesResponse.status}), Products (${productsResponse.status})`
          )
        }

        const categoriesData = await categoriesResponse.json()
        const productsData = await productsResponse.json()

        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setAllProducts(Array.isArray(productsData) ? productsData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")
        setAllProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col max-w-[100%] md:flex-row gap-[20px] p-[20px]">
      <Filter
        categories={categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          product_count: cat.product_count || 0,
        }))}
        onFilterChange={handleFilterChange}
      />
      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={retryFetch}
              className="mt-2"
              aria-label="Qayta urinib ko'rish"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Qayta urinib ko'rish
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40" aria-live="polite" aria-busy="true">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="sr-only">Yuklanmoqda...</span>
            <p className="ml-3">Yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {displayedProducts.length === 0 ? (
              <div className="text-center w-full h-full py-10 bg-gray-50 rounded-lg border border-gray-100">
                {searchTerm ? (
                  <div className="flex flex-col items-center justify-center gap-2 p-8">
                    <Search size={40} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">"{searchTerm}" bo'yicha mahsulotlar topilmadi</p>
                    <p className="text-gray-400 text-sm">Boshqa so'z bilan qidirib ko'ring</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Mahsulotlar topilmadi</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[20px]">
                {displayedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-white overflow-hidden shadow-sm border border-gray-100 p-[4px] rounded-[20px]"
                  >
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10 flex flex-col">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                          • {product.category.name}
                        </span>
                        {product.discount && (
                          <div className="text-xs font-semibold mt-1 rounded-[46px] bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">
                            🔥 -{product.discount}%
                          </div>
                        )}
                      </div>
                      <div className="aspect-square relative overflow-hidden mb-[12px]">
                        <Image
                          src={product.product_images[0]?.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 rounded-[20px]"
                        />
                      </div>
                    </div>

                    <div className="px-[12px]">
                      <h3 className="text-[18px] font-[500] text-[#242b3a] line-clamp-2">{product.name}</h3>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-600 flex gap-[4px] text-[18px] text-primary">
                          <PriceTag />
                          {product.discount
                            ? `${formatPrice(product.price)} so'm`
                            : `${formatPrice(product.price)} so'm`}
                        </p>
                        {product.discount && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(calculateOriginalPrice(product.price, product.discount))} so'm
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`store/product/${product.id}`} onClick={() => handleSaveProductToLocal(product)}>
                      <Button
                        variant="default"
                        className="text-sm text-primary font-medium bg-transparent w-full h-[52px] rounded-[16px] border border-primary my-[16px]"
                      >
                        Batafsil <ArrowRight />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {displayedProducts.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            >
              Oldingi
            </Button>
            <span className="mx-4 text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            >
              Keyingi
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}