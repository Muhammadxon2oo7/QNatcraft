"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Settings,
  LogOut,
  Edit,
  Clock,
  Package,
  ShoppingBag,
  Save,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { User } from "../../../public/img/auth/user";
import { Mail } from "../../../public/img/auth/Mail";
import { CartIcon } from "../../../public/img/header/CartIcon";
import { Phone } from "../../../public/img/auth/phone";
import { Pin } from "../../../public/img/auth/Pin";
import { useAuth } from "../../../context/auth-context";
import fetchWrapperClient from "@/services/fetchWrapperClient";

const sidebarItems = [
  { id: "profile", icon: User, label: "Mening profilim" },
  { id: "workshop", icon: CartIcon, label: "Mening ustaxonam" },
  { id: "products", icon: CartIcon, label: "Mening mahsulotlarim" },
  { id: "payments", icon: Clock, label: "Tolovlar tarixi" },
  { id: "statistics", icon: BarChart3, label: "Statistikalar" },
  { id: "orders", icon: Settings, label: "Buyurmalarni boshqarish" },
  { id: "logout", icon: LogOut, label: "Profildan chiqish" },
];

interface Profession {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ProfileData {
  id: number | string;
  user_email: string;
  user_first_name: string;
  phone_number?: string | null;
  address?: string | null;
  profile_image?: string | null;
  experience?: number | null;
  mentees?: number | null;
  profession?: Profession | null;
  bio?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  award?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: number | string;
}

interface UserData {
  email: string;
  message?: string;
  profile: ProfileData;
  user_id: number | string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading, logout } = useAuth();

  console.log("useAuth user:", user);

  if (loading) {
    return <div className="text-center p-8">Yuklanmoqda...</div>;
  }

  if (!user) {
    return <div className="text-center p-8 text-red-500">Ma'lumotlar mavjud emas yoki tizimga kirmagansiz</div>;
  }

  return (
    <div className="flex flex-wrap max-w-[1380px] px-[10px] mx-auto">
      <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
        <Link href="/" className="hover:text-primary">
          Bosh sahifa
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Profile</span>
      </nav>

      <div className="flex w-full">
        <div className="border rounded-lg h-fit bg-white overflow-hidden">
          <nav className="flex flex-col">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-50",
                  activeTab === item.id ? "bg-red-50 text-red-800" : "text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

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
              {activeTab === "profile" && <ProfileContent userData={user} />}
              {activeTab === "workshop" && <WorkshopContent />}
              {activeTab === "products" && <ProductsContent />}
              {activeTab === "payments" && <PaymentsContent />}
              {activeTab === "statistics" && <StatisticsContent />}
              {activeTab === "orders" && <OrdersContent />}
              {activeTab === "logout" && <LogoutContent onLogout={logout} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfileContent({ userData }: { userData: UserData | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | undefined>(userData?.profile);
  const [editedData, setEditedData] = useState({
    user_first_name: userData?.profile.user_first_name || "",
    phone_number: userData?.profile.phone_number || "",
    address: userData?.profile.address || "",
    experience: String(userData?.profile.experience || ""),
    mentees: String(userData?.profile.mentees || ""),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshUser } = useAuth();

  // Matnli maydonlar uchun o‘zgarishlarni boshqarish
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Drag-and-drop eventlari
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isEditing) return;
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isEditing) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageChange(file);
  };

  const handleImageChange = (file?: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Fayl hajmi 5MB dan kichik bo‘lishi kerak!");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllarini yuklash mumkin!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");
    try {
      if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

      const formData = new FormData();
      Object.entries(editedData).forEach(([key, value]) => {
        if (key === "experience" || key === "mentees") {
          formData.append(key, value ? String(Number(value)) : "");
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append("profile_image", imageFile);
        setIsUploading(true);
      }

      console.log("Yuborilayotgan FormData:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const updatedProfile = await fetchWrapperClient<ProfileData>(
        `/accounts/profiles/${userData.profile.id}/`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      setProfileData(updatedProfile);
      setIsUploading(false);
      setImageFile(null);
      setImagePreview(null);
      setIsEditing(false);
      setSuccessMessage("Ma'lumotlar muvaffaqiyatli yangilandi!");
      console.log("Ma'lumotlar muvaffaqiyatli saqlandi:", updatedProfile);

      await refreshUser();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(`Ma'lumotlarni saqlashda xatolik yuz berdi: ${error.message}`);
      setIsUploading(false);
      console.error("Xatolik detallari:", error);
    }
  };

  return (
    <div
      className="space-y-6 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h1 className="text-2xl font-bold mb-8">Mening profilim</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && (
        <div className="text-green-600 text-center">{successMessage}</div>
      )}

      {isDragging && isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <p className="text-white text-lg">Rasmni bu yerga tashlang</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <div
            className={cn(
              "w-[146px] h-[146px] rounded-md border border-gray-300 flex items-center justify-center relative overflow-hidden",
              isEditing && "cursor-pointer hover:bg-gray-100",
              isUploading && "opacity-50"
            )}
            onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
          >
            <img
              src={
                imagePreview ||
                (profileData?.profile_image
                  ? `https://qqrnatcraft.uz${profileData.profile_image}`
                  : "/img/user.png")
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {isEditing && !isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Upload className="h-6 w-6 text-white" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white">Yuklanmoqda...</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept="image/*"
          />
          {isEditing && (
            <p className="text-xs text-gray-500 mt-2">
              Drag-and-drop yoki tanlash orqali rasm yuklang (max 5MB)
            </p>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ism familiya</p>
              {isEditing ? (
                <input
                  type="text"
                  name="user_first_name"
                  value={editedData.user_first_name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User />
                  <span>{profileData?.user_first_name}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Mail />
                <span>{profileData?.user_email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Telefon raqam</p>
              {isEditing ? (
                <input
                  type="text"
                  name="phone_number"
                  value={editedData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Phone />
                  <span>{profileData?.phone_number || "Noma'lum"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Joylashuv</p>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Pin />
                  <span>{profileData?.address || "Noma'lum"}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Tajriba</p>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={editedData.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <CartIcon />
                  <span>{profileData?.experience || "Noma'lum"}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Shogirtlar</p>
              {isEditing ? (
                <input
                  type="text"
                  name="mentees"
                  value={editedData.mentees}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User />
                  <span>{profileData?.mentees || "Noma'lum"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 gap-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={isUploading}
            className={cn(
              "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
              isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            )}
          >
            <Save className="h-4 w-4" />
            Saqlash
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Tahrirlash
          </button>
        )}
      </div>
    </div>
  );
}
// Boshqa komponentlar o‘zgarmagan holda qoladi
function WorkshopContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Mening ustaxonam</h1>
      <div className="p-8 text-center text-gray-500">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Ustaxona ma'lumotlari bu yerda ko'rsatiladi</p>
      </div>
    </div>
  );
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
  );
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
  );
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
  );
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
  );
}

function LogoutContent({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Profildan chiqish</h1>
      <div className="p-8 text-center text-gray-500">
        <LogOut className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>Hisobdan chiqish uchun tasdiqlash</p>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors"
        >
          Chiqishni tasdiqlash
        </button>
      </div>
    </div>
  );
}