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
  categories?: { id: string | number; name: string; product_count: number }[]
  onFilterChange: (selectedCategories: string[], sortByDiscount: boolean, searchTerm?: string) => void
}

export default function Filter({ categories, onFilterChange }: FilterProps) {
  const prevCategoriesRef = useRef<typeof categories>()
  const [sections, setSections] = useState<FilterSection[]>([])
  const [sortByDiscount, setSortByDiscount] = useState(false)
  const [loading, setLoading] = useState(!categories)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (categories === prevCategoriesRef.current) return
    prevCategoriesRef.current = categories

    if (!categories) {
      const fetchCategories = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await fetch("https://qqrnatcraft.uz/api/categories/")
          if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`)
          }
          const fetchedCategories = await response.json()
          setSections([
            {
              id: "craft-types",
              title: "Hunarmandchilik turi",
              expanded: true,
              options: fetchedCategories.map((category: any) => ({
                id: String(category.id),
                label: category.name,
                count: category.product_count || 0,
                checked: false,
              })),
            },
          ])
        } catch (error) {
          console.error("Kategoriyalarni olishda xatolik:", error)
          setError("Kategoriyalarni yuklashda xatolik yuz berdi.")
        } finally {
          setLoading(false)
        }
      }
      fetchCategories()
    } else {
      setSections([
        {
          id: "craft-types",
          title: "Hunarmandchilik turi",
          expanded: true,
          options: categories.map((category) => ({
            id: String(category.id),
            label: category.name,
            count: category.product_count || 0,
            checked: checkedOptions[String(category.id)] || false,
          })),
        },
      ])
      setLoading(false)
    }
  }, [categories, checkedOptions])

  const getSelectedCategories = useCallback(() => {
    return Object.entries(checkedOptions)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => id)
  }, [checkedOptions])

  const toggleSection = useCallback((sectionId: string) => {
    setSections((prev) =>
      produce(prev, (draft) => {
        const section = draft.find((sec) => sec.id === sectionId)
        if (section) section.expanded = !section.expanded
      })
    )
  }, [])

  const toggleOption = useCallback(
    (sectionId: string, optionId: string) => {
      setCheckedOptions((prev) => {
        const newValue = !prev[optionId]
        const newState = { ...prev, [optionId]: newValue }

        setSections((prevSections) =>
          produce(prevSections, (draft) => {
            const section = draft.find((sec) => sec.id === sectionId)
            if (section) {
              const option = section.options.find((opt) => opt.id === optionId)
              if (option) option.checked = newValue
            }
          })
        )

        const selectedCategories = Object.entries(newState)
          .filter(([_, isChecked]) => isChecked)
          .map(([id]) => id)

        onFilterChange(selectedCategories, sortByDiscount, searchTerm)
        return newState
      })
    },
    [onFilterChange, sortByDiscount, searchTerm]
  )

  const toggleDiscountFilter = useCallback(() => {
    setSortByDiscount((prev) => {
      const newValue = !prev
      const selectedCategories = getSelectedCategories()
      onFilterChange(selectedCategories, newValue, searchTerm)
      return newValue
    })
  }, [getSelectedCategories, onFilterChange, searchTerm])

  const clearAll = useCallback(() => {
    setCheckedOptions({})
    setSearchTerm("")
    setSections((prev) =>
      produce(prev, (draft) => {
        draft.forEach((section) =>
          section.options.forEach((option) => {
            option.checked = false
          })
        )
      })
    )
    setSortByDiscount(false)
    onFilterChange([], false, "")
  }, [onFilterChange])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)
      const selectedCategories = getSelectedCategories()
      onFilterChange(selectedCategories, sortByDiscount, newSearchTerm)
    },
    [getSelectedCategories, onFilterChange, sortByDiscount]
  )

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
    [getSelectedCategories, onFilterChange, searchTerm, sortByDiscount]
  )

  const retryFetch = useCallback(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("https://qqrnatcraft.uz/api/categories/")
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }
        const fetchedCategories = await response.json()
        setSections([
          {
            id: "craft-types",
            title: "Hunarmandchilik turi",
            expanded: true,
            options: fetchedCategories.map((category: any) => ({
              id: String(category.id),
              label: category.name,
              count: category.product_count || 0,
              checked: checkedOptions[String(category.id)] || false,
            })),
          },
        ])
      } catch (error) {
        console.error("Kategoriyalarni olishda xatolik:", error)
        setError("Kategoriyalarni yuklashda xatolik yuz berdi.")
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
          <form onSubmit={handleSearchSubmit} className="mb-[20px]">
            <div
              className={`flex flex-wrap p-[4px] rounded-[16px] bg-[#f6f6f6] items-center justify-between transition-all duration-300 ${
                isFocused ? "ring-2 ring-primary/30" : ""
              }`}
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
                        const isChecked = checkedOptions[option.id] || false
                        return (
                          <div key={option.id} className="flex items-center space-x-3 p-[5px]">
                            <button
                              type="button"
                              onClick={() => toggleOption(section.id, option.id)}
                              className={`h-6 w-6 border rounded flex items-center justify-center transition-all focus:outline-none ${
                                isChecked
                                  ? "bg-primary border-primary focus:ring-2 focus:ring-primary"
                                  : "border-gray-300 hover:border-primary/50"
                              }`}
                              role="checkbox"
                              aria-checked={isChecked}
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