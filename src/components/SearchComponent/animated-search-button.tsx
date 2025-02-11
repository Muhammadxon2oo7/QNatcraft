"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AnimatedSearchButton() {
  const [isInputActive, setIsInputActive] = useState(false)

  const handleButtonClick = () => {
    setIsInputActive(true)
  }

  const handleInputBlur = () => {
    setIsInputActive(false)
  }

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {isInputActive ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center w-full"
          >
            <Search className="absolute left-3 text-gray-400" />
            <Input
              className="pl-10 pr-3 py-2 w-full flex flex-grow bg-[#f6f6f6] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              autoFocus
              onBlur={handleInputBlur}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ width: "100%", opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="bg-[#f6f6f6] hover:bg-[#f6f6f6] hover:cursor-pointer w-full flex justify-center items-center"
              onClick={handleButtonClick}
            >
              <Search />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

