// "use client"

// import { useState, useEffect, useCallback, useRef, useMemo } from "react"
// import Image from "next/image"
// import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react"
// import { motion } from "framer-motion"
// import Filter from "../Filter/Filter"
// import Link from "next/link"
// import fetchWrapper from "@/services/fetchwrapper"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Button } from "@/components/ui/button"

// const ITEMS_PER_PAGE = 8

// interface Product {
//   id: number
//   name: string
//   price: number
//   discount?: number
//   category: {
//     id: number
//     name: string
//     product_count: number
//     description: string
//     image: string | null
//   }
//   product_images: { id: number; image: string; product: number }[]
//   threed_model?: string
//   description?: string
//   address?: string
//   view_count?: number
//   created_at?: string
//   updated_at?: string
// }

// interface Category {
//   id: number
//   name: string
//   product_count: number
//   description: string
//   image: string | null
// }

// export default function ProductList() {
//   const [allProducts, setAllProducts] = useState<Product[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([])
//   const [sortByDiscount, setSortByDiscount] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const isProcessingFilterChangeRef = useRef(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const [categoriesData, productsData] = await Promise.all([
//           fetchWrapper<Category[]>("/api/categories/"),
//           fetchWrapper<Product[]>("/api/products/"),
//         ])

//         setCategories(categoriesData)
//         setAllProducts(productsData)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleFilterChange = useCallback((categories: number[], sortDiscount: boolean) => {
//     if (isProcessingFilterChangeRef.current) return

//     isProcessingFilterChangeRef.current = true

//     try {
//       console.log("Filter changed:", { categories, sortDiscount })
//       setSelectedCategories(categories)
//       setSortByDiscount(sortDiscount)
//       setCurrentPage(1) // Reset to first page when filters change
//     } finally {
//       isProcessingFilterChangeRef.current = false
//     }
//   }, [])

//   // Compute filtered products
//   const filteredProducts = useMemo(() => {
//     console.log("Filtering products with categories:", selectedCategories)
//     return allProducts
//       .filter((product) => {
//         // If no categories selected, show all products
//         if (selectedCategories.length === 0) return true
//         // Check if the product's category is in the selected categories
//         return selectedCategories.includes(product.category.id)
//       })
//       .sort((a, b) => {
//         if (sortByDiscount) {
//           // Sort by discount (highest first)
//           return (b.discount || 0) - (a.discount || 0)
//         }
//         return 0
//       })
//   }, [allProducts, selectedCategories, sortByDiscount])

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
//   const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

//   const handleSaveProductToLocal = useCallback((product: Product) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("selectedProduct", JSON.stringify(product))
//     }
//   }, [])

//   const calculateOriginalPrice = useCallback((price: number, discount: number) => {
//     if (!discount) return price
//     return price / (1 - discount / 100)
//   }, [])

//   const formatPrice = useCallback((price: number) => {
//     return new Intl.NumberFormat("uz-UZ").format(price)
//   }, [])

//   const retryFetch = useCallback(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const [categoriesData, productsData] = await Promise.all([
//           fetchWrapper<Category[]>("/api/categories/"),
//           fetchWrapper<Product[]>("/api/products/"),
//         ])

//         setCategories(categoriesData)
//         setAllProducts(productsData)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <div className="flex flex-col md:flex-row gap-[20px] p-[20px]">
//       <Filter
//         categories={categories.map((cat) => ({ id: cat.id, name: cat.name, product_count: cat.product_count || 0 }))}
//         onFilterChange={handleFilterChange}
//       />

//       <div className="w-full">
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//             <Button variant="outline" size="sm" onClick={retryFetch} className="mt-2" aria-label="Qayta urinib ko'rish">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Qayta urinib ko'rish
//             </Button>
//           </Alert>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-40" aria-live="polite" aria-busy="true">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//             <span className="sr-only">Loading...</span>
//             <p className="ml-3">Loading...</p>
//           </div>
//         ) : (
//           <>
//             <div className="mb-4 flex flex-wrap gap-2">
//               {selectedCategories.length > 0 && (
//                 <div className="p-2 bg-gray-50 rounded-md border-gray-200 border cursor-pointer">
//                   <p className="text-sm text-gray-600">Tanlangan kategoriyalar: {selectedCategories.length}</p>
//                 </div>
//               )}

//               {sortByDiscount && (
//                 <div className="p-2 bg-gray-50 rounded-md border-gray-200 border cursor-pointer">
//                   <p className="text-sm text-gray-600">Chegirma bo'yicha saralangan</p>
//                 </div>
//               )}
//             </div>

//             {displayedProducts.length === 0 ? (
//               <div className="text-center py-10">
//                 <p className="text-gray-500">Mahsulotlar topilmadi</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
//                 {displayedProducts.map((product) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     whileHover={{ y: -5 }}
//                     className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
//                   >
//                     <div className="relative">
//                       <div className="absolute top-2 left-2 z-10 flex flex-col">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
//                           • {product.category.name}
//                         </span>
//                         {product.discount && (
//                           <div className="text-xs font-semibold mt-1 rounded-[46px] bg-white/90 text-gray-700 w-[74px] h-[28px] flex justify-center items-center">
//                             🔥 -{product.discount}%
//                           </div>
//                         )}
//                       </div>
//                       <div className="aspect-square relative overflow-hidden">
//                         <Image
//                           src={product.product_images[0]?.image || "/placeholder.svg"}
//                           alt={product.name}
//                           fill
//                           className="object-cover transition-transform duration-300 hover:scale-105"
//                         />
//                       </div>
//                     </div>

//                     <div className="p-4">
//                       <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>

//                       <div className="flex justify-between mt-2">
//                         <p className="text-sm text-gray-600">
//                           {product.discount
//                             ? `${formatPrice(calculateOriginalPrice(product.price, product.discount))} so'm`
//                             : `${formatPrice(product.price)} so'm`}
//                         </p>
//                         {product.discount && (
//                           <p className="text-xs text-gray-500 line-through">{formatPrice(product.price)} so'm</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="p-4 flex justify-between items-center">
//                       <Link href={`/products/${product.id}`} onClick={() => handleSaveProductToLocal(product)}>
//                         <Button variant="link" className="text-sm text-primary font-medium">
//                           Batafsil <ArrowRight />
//                         </Button>
//                       </Link>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         <div className="flex justify-center mt-6">
//           <Button
//             variant="outline"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
//           >
//             Oldingi
//           </Button>

//           <span className="mx-4 text-gray-600">
//             {currentPage} / {totalPages}
//           </span>

//           <Button
//             variant="outline"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
//           >
//             Keyingi
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }







// "use client"

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Heart, ArrowRight } from "lucide-react";
// import { motion } from "framer-motion";
// import Filter from "../Filter/Filter";
// import Link from "next/link";

// const ITEMS_PER_PAGE = 8;

// interface Product {
//   id: string;
//   title: string;
//   category: string;
//   image: string;
//   currentPrice: number;
//   originalPrice?: number;
//   discount?: number;
//   workshop: string;
//   isFavorite?: boolean;
// }

// interface Category {
//   id: number;
//   name: string;
//   product_count: number;
// }

// export default function Product() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [sortByDiscount, setSortByDiscount] = useState(false);

//   // Mahsulotlarni olish
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const response = await fetch(`/api/products`);
//         const data = await response.json();
  
//         const formattedData = data.map((item: any) => ({
//           id: item.id.toString(),
//           title: item.name,
//           category: item.category.name,
//           image: item.product_images.length > 0 ? item.product_images[0].image : "/placeholder.svg",
//           currentPrice: parseFloat(item.price),
//           workshop: item.address,
//           isFavorite: false,
//         }));
  
//         setProducts(formattedData);
//         setFilteredProducts(formattedData);
//       } catch (error) {
//         console.error("Mahsulotlarni olishda xatolik:", error);
//       }
//     }
//     fetchProducts();
//   }, []);

//   // Kategoriyalarni olish
//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const response = await fetch(`/api/categories`);
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("Kategoriyalarni olishda xatolik:", error);
//       }
//     }
//     fetchCategories();
//   }, []);

//   // Filter va sortni qo‘llash
//   useEffect(() => {
//     let newProducts = [...products];

//     if (selectedCategories.length > 0) {
//       newProducts = newProducts.filter((product) =>
//         selectedCategories.includes(product.category)
//       );
//     }

//     if (sortByDiscount) {
//       newProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
//     }

//     setFilteredProducts(selectedCategories.length > 0 || sortByDiscount ? newProducts : products);
//     setCurrentPage(1);
//   }, [selectedCategories, sortByDiscount, products]);

//   const toggleFavorite = (productId: string) => {
//     setFilteredProducts((prev) =>
//       prev.map((product) =>
//         product.id === productId
//           ? { ...product, isFavorite: !product.isFavorite }
//           : product
//       )
//     );
//   };

//   const handleSaveProductToLocal = (product: Product) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("selectedProduct", JSON.stringify(product));
//     }
//   };

//   const formatPrice = (price: number) =>
//     new Intl.NumberFormat("uz-UZ").format(price);

//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );
//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

//   return (
//     <div className="flex gap-[20px] p-[20px]">
//       {/* Filter component */}
//       <Filter
//         categories={categories}
//         onFilterChange={(categories, sortDiscount) => {
//           setSelectedCategories(categories);
//           setSortByDiscount(sortDiscount);
//         }}
//       />

//       {/* Mahsulotlar ro‘yxati */}
//       <div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
//           {paginatedProducts.map((product) => (
//             <motion.div
//               key={product.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               whileHover={{ y: -5 }}
//               className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
//             >
//               <div className="relative">
//                 <div className="absolute top-2 left-2 z-10 flex flex-col">
//                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
//                     • {product.category}
//                   </span>
//                 </div>

//                 <motion.button
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => toggleFavorite(product.id)}
//                   className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm"
//                 >
//                   <Heart
//                     size={18}
//                     className={
//                       product.isFavorite
//                         ? "fill-red-500 text-red-500"
//                         : "text-gray-400"
//                     }
//                   />
//                 </motion.button>

//                 <div className="aspect-square relative overflow-hidden">
//                   <Image
//                     src={product.image || "/placeholder.svg"}
//                     alt={product.title}
//                     fill
//                     className="object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                 </div>
//               </div>

//               <div className="p-4">
//                 <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
//                   <Link href={`store/product/${product.id}`} onClick={() => handleSaveProductToLocal(product)}>
//                     {product.title}
//                   </Link>
//                 </h3>
//                 <p className="text-xs text-gray-500 mb-3">{product.workshop}</p>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm font-semibold text-gray-900">
//                         {formatPrice(product.currentPrice)} so'm
//                       </span>
//                     </div>
//                   </div>

//                   <motion.button
//                     whileHover={{ x: 3 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="text-sm font-medium text-[#7D1A1D] flex items-center gap-1"
//                   >
//                     Sotib olish
//                     <ArrowRight size={16} />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import Image from "next/image"
import { ArrowRight, AlertCircle, RefreshCw, Search } from "lucide-react"
import { motion } from "framer-motion"
import Filter from "../Filter/Filter"
import Link from "next/link"
import fetchWrapper from "@/services/fetchwrapper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

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

        const [categoriesData, productsData] = await Promise.all([
          fetchWrapper<Category[]>("/api/categories/"),
          fetchWrapper<Product[]>("/api/products/"),
        ])

        setCategories(categoriesData)
        setAllProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = useCallback((categories: number[], sortDiscount: boolean, search?: string) => {
    if (isProcessingFilterChangeRef.current) return

    isProcessingFilterChangeRef.current = true

    try {
      console.log("Filter changed:", { categories, sortDiscount, search })
      setSelectedCategories(categories)
      setSortByDiscount(sortDiscount)
      setCurrentPage(1) // Reset to first page when filters change

      // Update search term if provided
      if (search !== undefined) {
        setSearchTerm(search)
      }
    } finally {
      isProcessingFilterChangeRef.current = false
    }
  }, [])

  // Filter products based on search term, categories, and discount
  const filteredProducts = useMemo(() => {
    // Start with all products
    let filtered = [...allProducts]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category.id))
    }

    // Apply discount sort
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

  const calculateOriginalPrice = useCallback((price: number, discount: number) => {
    if (!discount) return price
    return price / (1 - discount / 100)
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price)
  }, [])

  const retryFetch = useCallback(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [categoriesData, productsData] = await Promise.all([
          fetchWrapper<Category[]>("/api/categories/"),
          fetchWrapper<Product[]>("/api/products/"),
        ])

        setCategories(categoriesData)
        setAllProducts(productsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col md:flex-row gap-[20px] p-[20px]">
      <Filter
        categories={categories.map((cat) => ({ id: cat.id, name: cat.name, product_count: cat.product_count || 0 }))}
        onFilterChange={handleFilterChange}
      />

      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" onClick={retryFetch} className="mt-2" aria-label="Qayta urinib ko'rish">
              <RefreshCw className="h-4 w-4 mr-2" />
              Qayta urinib ko'rish
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40" aria-live="polite" aria-busy="true">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="sr-only">Loading...</span>
            <p className="ml-3">Loading...</p>
          </div>
        ) : (
          <>
            

            {displayedProducts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
                {displayedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
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
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={product.product_images[0]?.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>

                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-600">
                          {product.discount
                            ? `${formatPrice(calculateOriginalPrice(product.price, product.discount))} so'm`
                            : `${formatPrice(product.price)} so'm`}
                        </p>
                        {product.discount && (
                          <p className="text-xs text-gray-500 line-through">{formatPrice(product.price)} so'm</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                      <Link href={`/products/${product.id}`} onClick={() => handleSaveProductToLocal(product)}>
                        <Button variant="link" className="text-sm text-primary font-medium">
                          Batafsil <ArrowRight />
                        </Button>
                      </Link>
                    </div>
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


