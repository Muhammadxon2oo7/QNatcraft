"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Check, AlertCircle, Search, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { produce } from "immer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

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
  onFilterChange: (selectedCategories: number[], sortByDiscount: boolean, searchTerm?: string) => void
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
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Add a state to track which options are checked
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>({})

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
            checked: checkedOptions[category.id.toString()] || false, // Use the tracked state
          })),
        },
      ])
      setLoading(false)
    }
  }, [categories, checkedOptions])

  // Function to get selected categories
  const getSelectedCategories = useCallback(() => {
    // Use the checkedOptions state to determine selected categories
    return Object.entries(checkedOptions)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => Number.parseInt(id, 10))
  }, [checkedOptions])

  // toggleSection kodining o'zi to'g'ri
  const toggleSection = useCallback((sectionId: string) => {
    setSections((prev) =>
      produce(prev, (draft) => {
        const section = draft.find((sec) => sec.id === sectionId)
        if (section) section.expanded = !section.expanded
      }),
    )
  }, [])

  // Completely rewritten toggleOption function to use the separate checkedOptions state
  const toggleOption = useCallback(
    (sectionId: string, optionId: string) => {
      console.log(`Toggle option clicked: ${optionId}`)

      // Update the checkedOptions state directly
      setCheckedOptions((prev) => {
        const newValue = !prev[optionId]
        console.log(`Setting option ${optionId} to ${newValue}`)

        // Create new state with the toggled option
        const newState = { ...prev, [optionId]: newValue }

        // Update sections to reflect the new checked state
        setSections((prevSections) =>
          produce(prevSections, (draft) => {
            const section = draft.find((sec) => sec.id === sectionId)
            if (section) {
              const option = section.options.find((opt) => opt.id === optionId)
              if (option) {
                option.checked = newValue
              }
            }
          }),
        )

        // Calculate selected categories from the new state
        const selectedCategories = Object.entries(newState)
          .filter(([_, isChecked]) => isChecked)
          .map(([id]) => Number.parseInt(id, 10))

        // Call onFilterChange with the updated categories and current search term
        onFilterChange(selectedCategories, sortByDiscount, searchTerm)

        return newState
      })
    },
    [onFilterChange, sortByDiscount, searchTerm],
  )

  const toggleDiscountFilter = useCallback(() => {
    setSortByDiscount((prev) => {
      const newValue = !prev
      // Get current selected categories
      const selectedCategories = getSelectedCategories()
      // Immediately call onFilterChange with the new discount value and current search term
      onFilterChange(selectedCategories, newValue, searchTerm)
      return newValue
    })
  }, [getSelectedCategories, onFilterChange, searchTerm])

  const clearAll = useCallback(() => {
    // Clear the checkedOptions state
    setCheckedOptions({})

    // Clear search term
    setSearchTerm("")

    // Update the sections state to reflect cleared options
    setSections((prev) =>
      produce(prev, (draft) => {
        draft.forEach((section) =>
          section.options.forEach((option) => {
            option.checked = false
          }),
        )
      }),
    )

    setSortByDiscount(false)

    // Call onFilterChange with empty categories and empty search
    onFilterChange([], false, "")
  }, [onFilterChange])

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)

      // Immediately update the filter with the new search term
      const selectedCategories = getSelectedCategories()
      onFilterChange(selectedCategories, sortByDiscount, newSearchTerm)
    },
    [getSelectedCategories, onFilterChange, sortByDiscount],
  )

  // Clear search term
  const clearSearch = useCallback(() => {
    setSearchTerm("")
    const selectedCategories = getSelectedCategories()
    onFilterChange(selectedCategories, sortByDiscount, "")
  }, [getSelectedCategories, onFilterChange, sortByDiscount])

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const selectedCategories = getSelectedCategories()
      onFilterChange(selectedCategories, sortByDiscount, searchTerm)
    },
    [getSelectedCategories, onFilterChange, searchTerm, sortByDiscount],
  )

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
              checked: checkedOptions[category.id.toString()] || false, // Use tracked state
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
  }, [checkedOptions])

  return (
    <Card className="w-[325px] p-[24px] bg-white shadow-md rounded-xl max-h-auto">
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-[20px]">
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
          {/* Modern search input with animation */}
          <form onSubmit={handleSearchSubmit} className="mb-[20px]">
            <div
              className={`flex flex-wrap p-[4px] rounded-[16px] bg-[#f6f6f6] items-center justify-between transition-all duration-300 ${isFocused ? "ring-2 ring-primary/30" : ""}`}
            >
              <div className="flex w-full relative items-center">
                <Input
                  placeholder="Qidirish..."
                  className="w-full text-gray-600 shadow-none border-none focus:outline-none h-full pl-4"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />

                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={clearSearch}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  variant="default"
                  className="rounded-[12px] w-[44px] h-[44px] flex justify-center items-center ml-2"
                >
                  <Search size={20} />
                </Button>
              </div>
            </div>
          </form>

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
                      section.options.map((option) => {
                        // Use the checkedOptions state to determine if this option is checked
                        const isChecked = checkedOptions[option.id] || false

                        return (
                          <div key={option.id} className="flex items-center space-x-3 p-[5px]">
                            <button
                              type="button"
                              onClick={() => toggleOption(section.id, option.id)}
                              className={`h-6 w-6 border rounded flex items-center justify-center transition-all focus:outline-none  ${
                                isChecked
                                  ? "bg-primary border-primary focus:ring-2 focus:ring-primary"
                                  : "border-gray-300 hover:border-primary/50"
                              }`}
                              role="checkbox"
                              aria-checked={isChecked}
                              aria-label={option.label}
                            >
                              {isChecked && <Check size={16} className="text-white" />}
                            </button>
                            <label
                              className={`flex-grow cursor-pointer transition-colors ${
                                isChecked ? "text-primary font-medium" : "text-gray-700 hover:text-primary/80"
                              }`}
                              onClick={() => toggleOption(section.id, option.id)}
                            >
                              {option.label}
                            </label>
                            <span className={`font-medium ${isChecked ? "text-primary" : "text-red-600"}`}>
                              {option.count}
                            </span>
                          </div>
                        )
                      })
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

