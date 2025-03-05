"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { produce } from "immer"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FilterOption {
  id: string
  label: string
  count: number
  checked: boolean
}

interface FilterSection {
  id: string
  title: string
  expanded: boolean
  options: FilterOption[]
}

interface FilterProps {
  categories?: { id: number; name: string; product_count: number }[]
  onFilterChange: (selectedCategories: number[], sortByDiscount: boolean) => void
}

export default function Filter({ categories, onFilterChange }: FilterProps) {
  // Use refs to track previous values and prevent unnecessary updates
  const prevCategoriesRef = useRef<typeof categories>()
  const isFirstRenderRef = useRef(true)
  const prevSelectedCategoriesRef = useRef<number[]>([])
  const prevSortByDiscountRef = useRef(false)

  const [sections, setSections] = useState<FilterSection[]>([])
  const [sortByDiscount, setSortByDiscount] = useState(false)
  const [loading, setLoading] = useState(!categories)
  const [error, setError] = useState<string | null>(null)

  // Initialize sections from categories
  useEffect(() => {
    // Skip if categories haven't changed
    if (categories === prevCategoriesRef.current) return

    prevCategoriesRef.current = categories

    if (!categories) {
      // If no categories provided, fetch them
      const fetchCategories = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetch(`/api/categories/`)

          if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
          }

          const fetchedCategories = await response.json()

          setSections([
            {
              id: "craft-types",
              title: "Hunarmandchilik turi",
              expanded: true,
              options: fetchedCategories.map((category: any) => ({
                id: category.id.toString(),
                label: category.name,
                count: category.product_count || 0,
                checked: false,
              })),
            },
          ])
        } catch (error) {
          console.error("Kategoriyalarni olishda xatolik: ", error)
          setError("Kategoriyalarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
        } finally {
          setLoading(false)
        }
      }

      fetchCategories()
    } else {
      // Use provided categories
      setSections([
        {
          id: "craft-types",
          title: "Hunarmandchilik turi",
          expanded: true,
          options: categories.map((category) => ({
            id: category.id.toString(),
            label: category.name,
            count: category.product_count || 0,
            checked: false,
          })),
        },
      ])
      setLoading(false)
    }
  }, [categories])

  // Function to get selected categories
  const getSelectedCategories = useCallback(() => {
    return sections
      .flatMap((section) => section.options)
      .filter((option) => option.checked)
      .map((option) => Number.parseInt(option.id, 10))
  }, [sections])

  // Update parent component when filters change, but only if they've actually changed
  useEffect(() => {
    // Skip the first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    const selectedCategories = getSelectedCategories()

    // Check if the selected categories or sort by discount have changed
    const categoriesChanged =
      selectedCategories.length !== prevSelectedCategoriesRef.current.length ||
      selectedCategories.some((id, index) => id !== prevSelectedCategoriesRef.current[index])

    const sortChanged = sortByDiscount !== prevSortByDiscountRef.current

    // Only call onFilterChange if something has changed
    if (categoriesChanged || sortChanged) {
      prevSelectedCategoriesRef.current = selectedCategories
      prevSortByDiscountRef.current = sortByDiscount
      onFilterChange(selectedCategories, sortByDiscount)
    }
  }, [getSelectedCategories, sortByDiscount, onFilterChange])

// toggleSection kodining o'zi to'g'ri
const toggleSection = useCallback((sectionId: string) => {
  setSections((prev) =>
    produce(prev, (draft) => {
      const section = draft.find((sec) => sec.id === sectionId);
      if (section) section.expanded = !section.expanded;
    }),
  );
}, []);

const toggleOption = useCallback((sectionId: string, optionId: string) => {
  setSections((prev) => {
    return produce(prev, (draft) => {
      const section = draft.find((sec) => sec.id === sectionId);
      
      if (section) {
        const option = section.options.find((opt) => opt.id === optionId);
       
        if (option) {
          option.checked = !option.checked; // checked qiymatini teskari qilish
          console.log('Updated option checked:', option.checked);
        }
      }
    });
  });
}, []);


  const toggleDiscountFilter = useCallback(() => {
    setSortByDiscount((prev) => !prev)
  }, [])

  const clearAll = useCallback(() => {
    setSections((prev) =>
      produce(prev, (draft) => {
        draft.forEach((section) => section.options.forEach((option) => (option.checked = false)))
      }),
    )
    setSortByDiscount(false)
  }, [])

  const retryFetch = useCallback(() => {
    setLoading(true)
    setError(null)

    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories/`)

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`)
        }

        const fetchedCategories = await response.json()

        setSections([
          {
            id: "craft-types",
            title: "Hunarmandchilik turi",
            expanded: true,
            options: fetchedCategories.map((category: any) => ({
              id: category.id.toString(),
              label: category.name,
              count: category.product_count || 0,
              checked: false,
            })),
          },
        ])
      } catch (error) {
        console.error("Kategoriyalarni olishda xatolik: ", error)
        setError("Kategoriyalarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <Card className="w-[325px] p-[24px] bg-white shadow-md rounded-xl max-h-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filter</h2>
        <Button variant="ghost" onClick={clearAll} className="text-red-600" aria-label="Barcha filtrlarni tozalash">
          Tozalash
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" onClick={retryFetch} className="mt-2" aria-label="Qayta urinib ko'rish">
            Qayta urinib ko'rish
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="sr-only">Yuklanmoqda...</span>
          <p className="ml-3 text-gray-500">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          <div className="py-4">
            <button
              onClick={toggleDiscountFilter}
              className={`w-full text-left font-medium flex justify-between items-center ${
                sortByDiscount ? "text-primary" : "text-gray-800"
              }`}
              aria-pressed={sortByDiscount}
              aria-label="Eng katta chegirmali mahsulotlarni ko'rsatish"
            >
              Eng katta chegirmali
              <Check size={20} className={sortByDiscount ? "text-primary" : "invisible"} />
            </button>
          </div>
          {sections.map((section) => (
            <div key={section.id} className="py-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full justify-between items-center font-medium text-gray-800"
                aria-expanded={section.expanded}
                aria-controls={`section-${section.id}-content`}
              >
                {section.title}
                <motion.div animate={{ rotate: section.expanded ? 180 : 0 }}>
                  {section.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </motion.div>
              </button>

              <AnimatePresence>
                {section.expanded && (
                  <motion.div
                    id={`section-${section.id}-content`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden pt-4 space-y-3"
                  >
                    {section.options.length === 0 ? (
                      <p className="text-gray-500">Hozircha mavjud emas</p>
                    ) : (
                      section.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-[5px]">
                          <button
                            type="button"
                            onClick={() => toggleOption(section.id, option.id)}
                            className={`h-6 w-6 border rounded flex items-center justify-center transition-all focus:outline-none  ${
                              option.checked
                                ? "bg-primary border-primary focus:ring-2 focus:ring-primary"
                                : "border-gray-300 hover:border-primary/50"
                            }`}
                            role="checkbox"
                            aria-checked={option.checked}
                            aria-label={option.label}
                          >
                            {option.checked && <Check size={16} className="text-white" />}
                          </button>
                          <label
  className={`flex-grow cursor-pointer transition-colors ${
    option.checked ? "text-primary font-medium" : "text-gray-700 hover:text-primary/80"
  }`}
  onClick={() => toggleOption(section.id, option.id)} // optionni teskari qilish
>
  {option.label}
</label>
                          <span className={`font-medium ${option.checked ? "text-primary" : "text-red-600"}`}>
                            {option.count}
                          </span>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}





// "use client";

// import { useState, useCallback, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp, Check } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { produce } from "immer";
// import fetchWrapper from "@/services/fetchwrapper";

// type FilterOption = {
//   id: string;
//   label: string;
//   count: number;
//   checked: boolean;
// };

// type FilterSection = {
//   id: string;
//   title: string;
//   expanded: boolean;
//   options: FilterOption[];
// };

// interface FilterProps {
//   onFilterChange: (selectedCategories: string[], sortByDiscount: boolean) => void;
// }

// export default function Filter({ onFilterChange }: FilterProps) {
//   const [sections, setSections] = useState<FilterSection[]>([]);
//   const [sortByDiscount, setSortByDiscount] = useState(false);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const categories = await fetchWrapper<{ id: string; name: string; count: number }[]>(
//         `${process.env.BACKEND_BASE_URL}/api/categories/`
//       );
//       setSections([
//         {
//           id: "craft-types",
//           title: "Hunarmandchilik turi",
//           expanded: true,
//           options: categories.map(({ id, name, count }) => ({
//             id,
//             label: name,
//             count,
//             checked: false,
//           })),
//         },
//       ]);
//     } catch (error) {
//       console.error("Kategoriyalarni olishda xatolik:", error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const selectedCategories = useMemo(() => 
//     sections.flatMap(({ options }) =>
//       options.filter(({ checked }) => checked).map(({ id }) => id)
//     ), [sections]
//   );

//   useEffect(() => {
//     onFilterChange(selectedCategories, sortByDiscount);
//   }, [selectedCategories, sortByDiscount, onFilterChange]);

//   const toggleSection = useCallback((sectionId: string) => {
//     setSections((prev) =>
//       produce(prev, (draft) => {
//         const section = draft.find((sec) => sec.id === sectionId);
//         if (section) section.expanded = !section.expanded;
//       })
//     );
//   }, []);

//   const toggleOption = useCallback((sectionId: string, optionId: string) => {
//     setSections((prev) =>
//       produce(prev, (draft) => {
//         const section = draft.find((sec) => sec.id === sectionId);
//         if (section) {
//           const option = section.options.find((opt) => opt.id === optionId);
//           if (option) option.checked = !option.checked;
//         }
//       })
//     );
//   }, []);

//   const toggleDiscountFilter = () => {
//     setSortByDiscount((prev) => !prev);
//   };

//   const clearAll = useCallback(() => {
//     setSections((prev) =>
//       produce(prev, (draft) => {
//         draft.forEach((section) =>
//           section.options.forEach((option) => (option.checked = false))
//         );
//       })
//     );
//     setSortByDiscount(false);
//   }, []);

//   return (
//     <Card className="w-[325px] p-[24px] bg-white shadow-md rounded-xl max-h-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Filter</h2>
//         <Button variant="ghost" onClick={clearAll} className="text-red-600">
//           Tozalash
//         </Button>
//       </div>
//       <div className="divide-y divide-gray-200">
//         <div className="py-4">
//           <button
//             onClick={toggleDiscountFilter}
//             className={`w-full text-left font-medium text-gray-800 flex justify-between items-center ${
//               sortByDiscount ? "text-primary" : ""
//             }`}
//           >
//             Eng katta chegirmali
//             <Check size={20} className={sortByDiscount ? "text-primary" : "invisible"} />
//           </button>
//         </div>
//         {sections.map((section) => (
//           <div key={section.id} className="py-4">
//             <button
//               onClick={() => toggleSection(section.id)}
//               className="flex w-full justify-between items-center font-medium text-gray-800"
//               aria-expanded={section.expanded}
//             >
//               {section.title}
//               <motion.div animate={{ rotate: section.expanded ? 180 : 0 }}>
//                 {section.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//               </motion.div>
//             </button>
//             <AnimatePresence>
//               {section.expanded && (
//                 <motion.div
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.3, ease: "easeInOut" }}
//                   className="overflow-hidden pt-4 space-y-3"
//                 >
//                   {section.options.length === 0 ? (
//                     <p className="text-gray-500">Hozircha mavjud emas</p>
//                   ) : (
//                     section.options.map((option) => (
//                       <motion.div key={option.id} className="flex items-center space-x-3 p-[5px]">
//                         <button
//                           onClick={() => toggleOption(section.id, option.id)}
//                           className={`h-6 w-6 border rounded flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
//                             option.checked ? "bg-primary border-primary" : "border-gray-300"
//                           }`}
//                           role="checkbox"
//                           aria-checked={option.checked}
//                           aria-label={option.label}
//                         >
//                           {option.checked && <Check size={16} className="text-white" />}
//                         </button>
//                         <span className="flex-grow text-gray-700">{option.label}</span>
//                         <span className="text-red-600 font-medium">{option.count}</span>
//                       </motion.div>
//                     ))
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// }