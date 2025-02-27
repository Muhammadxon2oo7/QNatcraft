"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { produce } from "immer"

type FilterOption = {
  id: string
  label: string
  count: number
  checked: boolean
}

type FilterSection = {
  id: string
  title: string
  expanded: boolean
  options: FilterOption[]
}

export default function Filter() {
  const [sections, setSections] = useState<FilterSection[]>([
    {
      id: "craft-types",
      title: "Hunarmandchilik turi",
      expanded: true,
      options: [
        { id: "gilamdozlik", label: "Gilamdo'zlik", count: 3, checked: false },
        { id: "kulolchilik", label: "Kulolchilik", count: 1, checked: false },
        { id: "zargarlik", label: "Zargarlik", count: 0, checked: false },
        { id: "toqimachilik", label: "To'qimachilik", count: 2, checked: false },
      ],
    },
    {
      id: "workshops",
      title: "Hunarmandchilik ustaxonalari",
      expanded: false,
      options: [
        { id: "buxoro", label: "Buxoro ustaxonalari", count: 5, checked: false },
        { id: "xiva", label: "Xiva ustaxonalari", count: 3, checked: false },
      ],
    },
  ])

  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev =>
      produce(prev, draft => {
        const section = draft.find(sec => sec.id === sectionId)
        if (section) section.expanded = !section.expanded
      })
    )
  }, [])

  const toggleOption = useCallback((sectionId: string, optionId: string) => {
    setSections(prev =>
      produce(prev, draft => {
        const section = draft.find(sec => sec.id === sectionId)
        if (section) {
          const option = section.options.find(opt => opt.id === optionId)
          if (option) option.checked = !option.checked
        }
      })
    )
  }, [])

  const clearAll = useCallback(() => {
    setSections(prev =>
      produce(prev, draft => {
        draft.forEach(section => section.options.forEach(option => (option.checked = false)))
      })
    )
  }, [])

  return (
    <Card className="max-w-md p-5 bg-white shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filter</h2>
        <Button variant="ghost" onClick={clearAll} className="text-red-600">
          Tozalash
        </Button>
      </div>
      <div className="divide-y divide-gray-200">
        {sections.map(section => (
          <div key={section.id} className="py-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full justify-between items-center font-medium text-gray-800"
              aria-expanded={section.expanded}
            >
              {section.title}
              <motion.div animate={{ rotate: section.expanded ? 180 : 0 }}>
                {section.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </motion.div>
            </button>
            <AnimatePresence>
              {section.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden pt-4 space-y-3"
                >
                  {section.options.length === 0 ? (
                    <p className="text-gray-500">Hozircha mavjud emas</p>
                  ) : (
                    section.options.map(option => (
                      <motion.div key={option.id} className="flex items-center space-x-3 p-[5px]">
                        <button
                          onClick={() => toggleOption(section.id, option.id)}
                          className={`h-6 w-6 border rounded flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            option.checked ? "bg-red-600 border-red-600" : "border-gray-300"
                          }`}
                          role="checkbox"
                          aria-checked={option.checked}
                          aria-label={option.label}
                        >
                          {option.checked && <Check size={16} className="text-white" />}
                        </button>
                        <span className="flex-grow text-gray-700">{option.label}</span>
                        <span className="text-red-600 font-medium">{option.count}</span>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Card>
  )
}
