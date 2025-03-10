"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function ProfileHeader() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-primary/5"></div>
        <div className="absolute right-1/4 bottom-0 w-32 h-32 rounded-full bg-primary/5"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative"
        >
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-camera"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-2xl font-bold">Abdujabbor Ahmedov</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
              Kulol
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone text-primary"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="text-sm">+998 90 000 00 00</span>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail text-primary"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="text-sm">Emailpochta@gmail.com</span>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin text-primary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm">Toshkent, O'zbekiston</span>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 text-primary hover:underline text-sm font-medium"
          >
            Profilni tahrirlash
          </motion.button>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-red-50 p-4 rounded-lg text-center min-w-[150px]">
          <div className="text-3xl font-bold text-primary">845 ta</div>
          <div className="text-sm text-muted-foreground">Mahsulotlarim</div>
        </motion.div>
      </div>
    </div>
  )
}

