// "use client"

// import { useState, useEffect, useCallback, useMemo } from "react"
// import Image from "next/image"
// import { ArrowRight, AlertCircle, RefreshCw, Search, Heart } from "lucide-react"
// import { motion } from "framer-motion"
// import Filter from "../Filter/Filter"
// import Link from "next/link"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Button } from "@/components/ui/button"
// import { PriceTag } from "../../../../public/store/PriceTag"
// import { useAuth } from "../../../../context/auth-context"
// import { toast } from "sonner"


// const ITEMS_PER_PAGE = 8

// interface Product {
//   id: number
//   name: string
//   price: string
//   discount?: string | null
//   category: number
//   product_images: { id: number; image: string; product: number }[]
//   threed_model?: string | null
//   description?: string
//   address?: string
//   view_count?: number
//   created_at?: string
//   updated_at?: string
//   is_liked: boolean
//   like_count: number
// }

// interface Category {
//   id: number
//   name: string
//   product_count: number
//   description: string
//   image: string | null
// }

// export default function ProductList() {
//   const { user, getToken } = useAuth()
//   const [allProducts, setAllProducts] = useState<Product[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [sortByDiscount, setSortByDiscount] = useState(false)
//   const [showLikedOnly, setShowLikedOnly] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isLiking, setIsLiking] = useState<number | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const token = user ? await getToken() : null
//         const headers: HeadersInit = { "Content-Type": "application/json" }
//         if (token) {
//           headers["Authorization"] = `Bearer ${token}`
//         }

//         const [categoriesResponse, productsResponse] = await Promise.all([
//           fetch("https://qqrnatcraft.uz/api/categories/", {
//             method: "GET",
//             headers,
//           }),
//           fetch("https://qqrnatcraft.uz/api/products/", {
//             method: "GET",
//             headers,
//           }),
//         ])

//         if (!categoriesResponse.ok || !productsResponse.ok) {
//           throw new Error(
//             `Failed to fetch data: Categories (${categoriesResponse.status}), Products (${productsResponse.status})`
//           )
//         }

//         const categoriesData = await categoriesResponse.json()
//         const productsData = await productsResponse.json()

//         setCategories(Array.isArray(categoriesData) ? categoriesData : [])
//         setAllProducts(Array.isArray(productsData) ? productsData : [])
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")
//         toast.error("Ma'lumotlarni yuklashda xatolik!")
//         setAllProducts([])
//         setCategories([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user, getToken])

//   const handleFilterChange = useCallback(
//     (categories: string[], sortDiscount: boolean, showLiked: boolean, search?: string) => {
//       setSelectedCategories(categories)
//       setSortByDiscount(sortDiscount)
//       setShowLikedOnly(showLiked)
//       setCurrentPage(1)
//       if (search !== undefined) setSearchTerm(search)
//     },
//     []
//   )

//   const toggleLike = useCallback(
//     async (productId: number) => {
//       if (!user) {
//         toast.error("Iltimos, tizimga kiring!")
//         return
//       }

//       setIsLiking(productId)
//       try {
//         const token = await getToken()
//         if (!token) {
//           toast.error("Autentifikatsiya tokeni topilmadi. Iltimos, qayta kiring.")
//           return
//         }

//         const product = allProducts.find((p) => p.id === productId)
//         const isLiked = product?.is_liked

//         const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/like/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         })

//         if (!response.ok) {
//           const errorData = await response.json()
//           if (response.status === 403) {
//             toast.error("Sizda bu amalni bajarish uchun ruxsat yo‘q.")
//             throw new Error(errorData.detail || "Ruxsat yo‘q")
//           }
//           throw new Error(errorData.detail || `Failed to toggle like: ${response.status}`)
//         }

//         const data = await response.json()
//         // Faqat backend javobidan keyin yangilash
//         setAllProducts((prev) =>
//           prev.map((product) =>
//             product.id === productId
//               ? {
//                   ...product,
//                   is_liked: data.status === "liked",
//                   like_count: data.status === "liked" ? product.like_count + 1 : product.like_count - 1,
//                 }
//               : product
//           )
//         )

//         toast.success(data.status === "liked" ? "Mahsulot yoqdi!" : "Yoqtirish olindi!")
//       } catch (error: any) {
//         console.error("Error toggling like:", error)
//         setError(error.message || "Like qo'shishda xatolik yuz berdi.")
//         toast.error(error.message || "Like qo'shishda xatolik!")
//       } finally {
//         setIsLiking(null)
//       }
//     },
//     [user, getToken, allProducts]
//   )

//   const filteredProducts = useMemo(() => {
//     if (!Array.isArray(allProducts)) return []

//     let filtered = [...allProducts]

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase()
//       filtered = filtered.filter(
//         (product) =>
//           product.name?.toLowerCase().includes(searchLower) ||
//           (product.description && product.description.toLowerCase().includes(searchLower))
//       )
//     }

//     if (selectedCategories.length > 0) {
//       filtered = filtered.filter((product) =>
//         product.category !== undefined && selectedCategories.includes(String(product.category))
//       )
//     }

//     if (showLikedOnly) {
//       filtered = filtered.filter((product) => product.is_liked)
//     }

//     if (sortByDiscount) {
//       filtered = filtered.sort((a, b) => {
//         const discountA = a.discount ? parseFloat(a.discount) : 0
//         const discountB = b.discount ? parseFloat(b.discount) : 0
//         return discountB - discountA
//       })
//     }

//     return filtered
//   }, [allProducts, searchTerm, selectedCategories, showLikedOnly, sortByDiscount])

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
//   const displayedProducts = filteredProducts.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   )

//   const handleSaveProductToLocal = useCallback((product: Product) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("selectedProduct", JSON.stringify(product))
//     }
//   }, [])

//   const calculateOriginalPrice = useCallback((price: string, discount?: string | null) => {
//     const priceNum = parseFloat(price)
//     if (!discount) return priceNum
//     const discountNum = parseFloat(discount)
//     return Math.round(priceNum / (1 - discountNum / 100))
//   }, [])

//   const formatPrice = useCallback((price: number | string) => {
//     const priceNum = typeof price === "string" ? parseFloat(price) : price
//     return new Intl.NumberFormat("uz-UZ").format(priceNum)
//   }, [])

//   const retryFetch = useCallback(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const token = user ? await getToken() : null
//         const headers: HeadersInit = { "Content-Type": "application/json" }
//         if (token) {
//           headers["Authorization"] = `Bearer ${token}`
//         }

//         const [categoriesResponse, productsResponse] = await Promise.all([
//           fetch("https://qqrnatcraft.uz/api/categories/", {
//             method: "GET",
//             headers,
//           }),
//           fetch("https://qqrnatcraft.uz/api/products/", {
//             method: "GET",
//             headers,
//           }),
//         ])

//         if (!categoriesResponse.ok || !productsResponse.ok) {
//           throw new Error(
//             `Failed to fetch data: Categories (${categoriesResponse.status}), Products (${productsResponse.status})`
//           )
//         }

//         const categoriesData = await categoriesResponse.json()
//         const productsData = await productsResponse.json()

//         setCategories(Array.isArray(categoriesData) ? categoriesData : [])
//         setAllProducts(Array.isArray(productsData) ? productsData : [])
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.")
//         toast.error("Ma'lumotlarni yuklashda xatolik!")
//         setAllProducts([])
//         setCategories([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user, getToken])

//   return (
//     <div className="flex flex-col max-w-[100%] md:flex-row gap-[20px] p-[20px]">
//       <Filter
//         categories={categories.map((cat) => ({
//           id: String(cat.id),
//           name: cat.name,
//           product_count: cat.product_count || 0,
//         }))}
//         onFilterChange={handleFilterChange}
//       />
//       <div className="w-full">
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={retryFetch}
//               className="mt-2"
//               aria-label="Qayta urinib ko'rish"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Qayta urinib ko'rish
//             </Button>
//           </Alert>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-40" aria-live="polite" aria-busy="true">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//             <span className="sr-only">Yuklanmoqda...</span>
//             <p className="ml-3">Yuklanmoqda...</p>
//           </div>
//         ) : (
//           <>
//             {displayedProducts.length === 0 ? (
//               <div className="text-center w-full h-full py-10 bg-gray-50 rounded-lg border border-gray-100">
//                 {searchTerm ? (
//                   <div className="flex flex-col items-center justify-center gap-2 p-8">
//                     <Search size={40} className="text-gray-300" />
//                     <p className="text-gray-500 font-medium">"{searchTerm}" bo'yicha mahsulotlar topilmadi</p>
//                     <p className="text-gray-400 text-sm">Boshqa so'z bilan qidirib ko'ring</p>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">Mahsulotlar topilmadi</p>
//                 )}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[20px]">
//                 {displayedProducts.map((product) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     whileHover={{ y: -5 }}
//                     className="bg-white overflow-hidden shadow-sm border border-gray-100 p-[4px] rounded-[20px]"
//                   >
//                     <div className="relative">
//                       <div className="absolute top-2 left-2 z-10 flex flex-col">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
//                           • {categories.find((cat) => cat.id === product.category)?.name || "Noma'lum"}
//                         </span>
//                         {product.discount && (
//                           <div className="text-xs font-semibold mt-1 rounded-[46px] bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">
//                             🔥 -{product.discount}%
//                           </div>
//                         )}
//                       </div>
//                       <motion.button
//                         whileTap={{ scale: user ? 1.2 : 1 }}
//                         disabled={isLiking === product.id || !user}
//                         onClick={() => toggleLike(product.id)}
//                         className={`absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors ${
//                           isLiking === product.id || !user ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                         aria-label={product.is_liked ? "Unlike product" : "Like product"}
//                         title={!user ? "Like qo‘yish uchun tizimga kiring" : ""}
//                       >
//                         <div className="flex items-center gap-1">
//                           <Heart
//                             size={20}
//                             className={product.is_liked && user ? "text-red-500 fill-red-500" : "text-gray-600"}
//                           />
//                           <span className="text-xs font-medium text-gray-600">{product.like_count}</span>
//                         </div>
//                       </motion.button>
//                       <div className="aspect-square relative overflow-hidden mb-[12px]">
//                         <Image
//                           src={product.product_images[0]?.image || "/placeholder.svg"}
//                           alt={product.name}
//                           fill
//                           className="object-cover transition-transform duration-300 rounded-[20px]"
//                         />
//                       </div>
//                     </div>

//                     <div className="px-[12px]">
//                       <h3 className="text-[18px] font-[500] text-[#242b3a] line-clamp-2">{product.name}</h3>
//                       <div className="flex justify-between mt-2">
//                         <p className="text-sm text-gray-600 flex gap-[4px] text-[18px] text-primary">
//                           <PriceTag />
//                           {product.discount
//                             ? `${formatPrice(product.price)} so'm`
//                             : `${formatPrice(product.price)} so'm`}
//                         </p>
//                         {product.discount && (
//                           <p className="text-xs text-gray-500 line-through">
//                             {formatPrice(calculateOriginalPrice(product.price, product.discount))} so'm
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     <Link href={`store/product/${product.id}`} onClick={() => handleSaveProductToLocal(product)}>
//                       <Button
//                         variant="default"
//                         className="text-sm text-primary font-medium bg-transparent w-full h-[52px] rounded-[16px] border border-primary my-[16px]"
//                       >
//                         Batafsil <ArrowRight />
//                       </Button>
//                     </Link>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {displayedProducts.length > 0 && (
//           <div className="flex justify-center mt-6">
//             <Button
//               variant="outline"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
//             >
//               Oldingi
//             </Button>
//             <span className="mx-4 text-gray-600">
//               {currentPage} / {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
//             >
//               Keyingi
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { ArrowRight, AlertCircle, RefreshCw, Search, Heart, Filter as FilterIcon } from "lucide-react"
import { motion } from "framer-motion"
import Filter from "../Filter/Filter"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { PriceTag } from "../../../../public/store/PriceTag"
import { useAuth } from "../../../../context/auth-context"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const ITEMS_PER_PAGE = 12

interface Product {
  id: number
  name: string
  price: string
  discount?: string | null
  category: number
  product_images: { id: number; image: string; product: number }[]
  threed_model?: string | null
  description?: string
  address?: string
  view_count?: number
  created_at?: string
  updated_at?: string
  is_liked: boolean
  like_count: number
}

interface Category {
  id: number
  name: string
  product_count: number
  description: string
  image: string | null
}

export default function ProductList() {
  const { user, getToken } = useAuth()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortByDiscount, setSortByDiscount] = useState(false)
  const [showLikedOnly, setShowLikedOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLiking, setIsLiking] = useState<number | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = user ? await getToken() : null
      const headers: HeadersInit = { "Content-Type": "application/json" }
      if (token) headers["Authorization"] = `Bearer ${token}`

      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch("https://qqrnatcraft.uz/api/categories/", { method: "GET", headers }),
        fetch("https://qqrnatcraft.uz/api/products/", { method: "GET", headers }),
      ])

      if (!categoriesResponse.ok || !productsResponse.ok) {
        throw new Error(`Failed to fetch data: Categories (${categoriesResponse.status}), Products (${productsResponse.status})`)
      }

      const categoriesData = await categoriesResponse.json()
      const productsData = await productsResponse.json()

      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setAllProducts(Array.isArray(productsData) ? productsData : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
      toast.error("Ma'lumotlarni yuklashda xatolik!")
      setAllProducts([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [user, getToken])

  useEffect(() => {
    fetchData()
  }, [fetchData])


useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "auto !important";
      document.documentElement.style.overflow = "auto !important";
      // Paddingni layout shift oldini olish uchun
      document.body.style.paddingRight = "0px";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isFilterOpen]);

  const handleFilterChange = useCallback(
    (categories: string[], sortDiscount: boolean, showLiked: boolean, search?: string) => {
      setSelectedCategories(categories)
      setSortByDiscount(sortDiscount)
      setShowLikedOnly(showLiked)
      setCurrentPage(1)
      if (search !== undefined) setSearchTerm(search)
      // setIsFilterOpen(false)
    },
    []
  )

  const toggleLike = useCallback(
    async (productId: number) => {
      if (!user) {
        toast.error("Iltimos, tizimga kiring!")
        return
      }

      setIsLiking(productId)
      try {
        const token = await getToken()
        if (!token) throw new Error("Autentifikatsiya tokeni topilmadi.")
        const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/like/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || `Failed to toggle like: ${response.status}`)
        }

        const data = await response.json()
        setAllProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  is_liked: data.status === "liked",
                  like_count: data.status === "liked" ? product.like_count + 1 : product.like_count - 1,
                }
              : product
          )
        )
        toast.success(data.status === "liked" ? "Mahsulot yoqdi!" : "Yoqtirish olindi!")
      } catch (error: any) {
        console.error("Error toggling like:", error)
        toast.error(error.message || "Like qo'shishda xatolik!")
      } finally {
        setIsLiking(null)
      }
    },
    [user, getToken]
  )

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      )
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(String(product.category)))
    }
    if (showLikedOnly) {
      filtered = filtered.filter((product) => product.is_liked)
    }
    if (sortByDiscount) {
      filtered = filtered.sort((a, b) => {
        const discountA = parseFloat(a.discount || '0')
        const discountB = parseFloat(b.discount || '0')
        return discountB - discountA
      })
    }
    return filtered
  }, [allProducts, searchTerm, selectedCategories, showLikedOnly, sortByDiscount])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const displayedProducts = useMemo(() => 
    filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredProducts, currentPage]
  )

  const calculateOriginalPrice = useCallback((price: string, discount?: string | null) => {
    const priceNum = parseFloat(price)
    if (!discount) return priceNum
    const discountNum = parseFloat(discount)
    return Math.round(priceNum / (1 - discountNum / 100))
  }, [])

  const formatPrice = useCallback((price: number | string) => {
    const priceNum = typeof price === "string" ? parseFloat(price) : price
    return new Intl.NumberFormat("uz-UZ").format(priceNum)
  }, [])

  return (
    <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-0">
{/* Desktop Filter */}
      <div className="hidden md:block w-64 lg:w-80 sticky top-[156px] self-start">
        <Filter
          categories={categories.map((cat) => ({
            id: String(cat.id),
            name: cat.name,
            product_count: cat.product_count || 0,
          }))}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Mobile Filter Trigger - z-index yuqori qilindi */}
      <div className="md:hidden sticky top-[64px] z-30 bg-white py-2 px-4 shadow-md w-[95%] mx-auto">
        <Sheet modal={false} open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-base">
              <FilterIcon size={20} /> Filter
            </Button>
          </SheetTrigger>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <SheetContent side="bottom" className="h-auto max-h-[60vh] xs:max-h-[55vh] rounded-t-xl p-4 overflow-y-auto z-40 w-[95%] mx-auto">
              <SheetTitle className="sr-only">Filterlar</SheetTitle>
              <SheetDescription className="sr-only">Filterlar ro‘yxati</SheetDescription>
              <Filter
                categories={categories.map((cat) => ({
                  id: String(cat.id),
                  name: cat.name,
                  product_count: cat.product_count || 0,
                }))}
                onFilterChange={handleFilterChange}
              />
            </SheetContent>
          </motion.div>
        </Sheet>
      </div>

      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="mt-2"
              aria-label="Qayta urinib ko'rish"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Qayta urinib ko'rish
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-3">Yuklanmoqda...</p>
          </div>
        ) : (
          <>
            {displayedProducts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                {searchTerm ? (
                  <div className="flex flex-col items-center gap-2 p-6">
                    <Search size={40} className="text-gray-300" />
                    <p className="text-gray-500 font-medium">"{searchTerm}" bo'yicha mahsulotlar topilmadi</p>
                    <p className="text-gray-400 text-sm">Boshqa so'z bilan qidirib ko'ring</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Mahsulotlar topilmadi</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="relative">
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 text-xs">
                        <span className="bg-white/90 px-2 py-1 rounded-full text-gray-700">
                          {categories.find((cat) => cat.id === product.category)?.name || "Noma'lum"}
                        </span>
                        {product.discount && (
                          <span className="bg-white/90 px-2 py-1 rounded-full text-gray-700">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <button
                        disabled={isLiking === product.id || !user}
                        onClick={() => toggleLike(product.id)}
                        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 transition-colors ${
                          isLiking === product.id || !user ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
                        }`}
                        aria-label={product.is_liked ? "Unlike" : "Like"}
                        title={!user ? "Tizimga kiring" : ""}
                      >
                        <Heart
                          size= {18}
                          className={product.is_liked ? "text-red-500 fill-red-500" : "text-gray-600"}
                        />
                      </button>
                      <div className="aspect-square relative">
                        <Image
                          src={product.product_images[0]?.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-t-xl"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-medium text-[#242b3a] mb-2 line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-primary flex gap-1">
                          <PriceTag  />
                          {formatPrice(product.price)} so'm
                        </p>
                        {product.discount && (
                          <p className="text-gray-500 line-through">
                            {formatPrice(calculateOriginalPrice(product.price, product.discount))} so'm
                          </p>
                        )}
                      </div>
                      <Link href={`store/product/${product.id}`} onClick={() => localStorage.setItem("selectedProduct", JSON.stringify(product))}>
                        <Button
                          variant="outline"
                          className="w-full mt-4 h-10 rounded-xl"
                        >
                          Batafsil <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Oldingi
            </Button>
            <span className="self-center text-gray-600">{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Keyingi
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
