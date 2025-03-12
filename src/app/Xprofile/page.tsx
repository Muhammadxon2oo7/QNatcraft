"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  
  BarChart3,
  Settings,
  LogOut,
  Trophy,
  
  
  Edit,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { User } from "../../../public/img/auth/user"
import { Mail } from "../../../public/img/auth/Mail"
import { CartIcon } from "../../../public/img/header/CartIcon"
import { Phone } from "../../../public/img/auth/phone"
import { Pin } from "../../../public/img/auth/Pin"
const sidebarItems = [
  { id: "profile", icon: User, label: "Mening profilim" },
  { id: "workshop", icon: CartIcon, label: "Mening ustaxonam" },
  { id: "products", icon: CartIcon, label: "Mening mahsulotlarim" },
  { id: "payments", icon: Clock, label: "Tolovlar tarixi" },
  { id: "statistics", icon: BarChart3, label: "Statistikalar" },
  { id: "orders", icon: Settings, label: "Buyurmalarni boshqarish" },
  { id: "logout", icon: LogOut, label: "Profildan chiqish" },
]

// Mock user data
const userData = {
  name: "Abdujabbor Ahmedov",
  email: "Emailpochta@gmail.com",
  phone: "+998 90 000 00 00",
  location: "Beruniy tumani",
  experience: "4",
  followers: "300+",
  achievements: "Xalqaro musobaqalar sovrindori",
  avatar: "/img/craftman.png",
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="flex   flex-wrap max-w-[1380px]  px-[10px] mx-auto">
      {/* Breadcrumb header */}
      <nav className=" flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
        <Link href="/" className="hover:text-primary">
          Bosh sahifa
        </Link>
        
        <span className="mx-2">/</span>
        <span className="text-foreground">Profile</span>
      </nav>

      {/* Main content with sidebar */}
      <div className="flex w-full ">
        {/* Sidebar */}
        <div className=" border rounded-lg  h-fit bg-white overflow-hidden">
          <nav className="flex flex-col">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-50",
                  activeTab === item.id ? "bg-red-50 text-red-800" : "text-gray-700",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 pl-[20px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg border p-6 min-h-[500px]"
            >
              {activeTab === "profile" && <ProfileContent userData={userData} />}
              {activeTab === "workshop" && <WorkshopContent />}
              {activeTab === "products" && <ProductsContent />}
              {activeTab === "payments" && <PaymentsContent />}
              {activeTab === "statistics" && <StatisticsContent />}
              {activeTab === "orders" && <OrdersContent />}
              {activeTab === "logout" && <LogoutContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ProfileContent({ userData }: { userData: typeof userData }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold  mb-8">Mening profilim</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <img
            src={userData.avatar || "/placeholder.svg"}
            alt="Profile"
            className="w-40 h-40 rounded-md object-cover"
          />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ism familiya</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <User  />
                <span>{userData.name}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Mail />
                <span>{userData.email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Tajriba</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <CartIcon />
                <span>{userData.experience}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Telefon raqam</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Phone />
                <span>{userData.phone}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Joylashuv</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Pin  />
                <span>{userData.location}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Shogirtlar</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <User  />
                <span>{userData.followers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Erishilgan yutuqlar</p>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
          <Trophy className="h-5 w-5 text-gray-500" />
          <span>{userData.achievements}</span>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors">
          <Edit className="h-4 w-4" />
          Tahrirlash
        </button>
      </div>
    </div>
  )
}

function WorkshopContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Mening ustaxonam</h1>
      <div className="p-8 text-center text-gray-500">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Ustaxona ma'lumotlari bu yerda ko'rsatiladi</p>
      </div>
    </div>
  )
}

function ProductsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Mening mahsulotlarim</h1>
      <div className="p-8 text-center text-gray-500">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Mahsulotlar ro'yxati bu yerda ko'rsatiladi</p>
      </div>
    </div>
  )
}

function PaymentsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Tolovlar tarixi</h1>
      <div className="p-8 text-center text-gray-500">
        <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>To'lovlar tarixi bu yerda ko'rsatiladi</p>
      </div>
    </div>
  )
}

function StatisticsContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Statistikalar</h1>
      <div className="p-8 text-center text-gray-500">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Statistika ma'lumotlari bu yerda ko'rsatiladi</p>
      </div>
    </div>
  )
}

function OrdersContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Buyurmalarni boshqarish</h1>
      <div className="p-8 text-center text-gray-500">
        <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Buyurtmalar boshqaruvi bu yerda ko'rsatiladi</p>
      </div>
    </div>
  )
}

function LogoutContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Profildan chiqish</h1>
      <div className="p-8 text-center text-gray-500">
        <LogOut className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Hisobdan chiqish uchun tasdiqlash</p>
        <button className="mt-4 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors">
          Chiqishni tasdiqlash
        </button>
      </div>
    </div>
  )
}

