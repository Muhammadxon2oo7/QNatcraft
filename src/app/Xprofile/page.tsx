"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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
  Star,
  MapPin,
  Plus,
  X,
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
import { toast } from "sonner";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

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
              {activeTab === "workshop" && <WorkshopContent userData={user} />}
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
      if (file.size > 10 * 1024 * 1024) {
        setError("Fayl hajmi 10MB dan kichik bo‘lishi kerak!");
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

// 



// Foydalanuvchi ma'lumotlari uchun interfeys
interface UserData {
  user_id: number | string;
}

// API javobiga mos interfeys
interface WorkshopData {
  id?: number | string;
  name: string;
  description: string;
  image_360?: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  user?: number | string;
  rating?: number;
  reviews?: number;
  virtual_tours?: string[];
}

// Virtual ko‘rgazma uchun rasm va preview ma'lumotlari
interface VirtualTourItem {
  file: File | null;
  preview: string | null;
  url: string | null;
}

// Panorama komponenti
const Panorama = ({ image, onLoad }: { image: string; onLoad: () => void }) => {
  let texture;
  try {
    texture = useTexture(image);
  } catch (err) {
    console.error(`Panorama tasvirini yuklashda xatolik (${image}):`, err);
    return <div className="text-red-500">Tasvirni yuklashda xatolik</div>;
  }

  useEffect(() => {
    if (texture) onLoad();
  }, [texture, onLoad]);

  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={<div className="text-white text-center">Yuklanmoqda...</div>}>
        <mesh>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={1000}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
};







function WorkshopContent({ userData }: { userData: UserData | null }) {
  const [workshopData, setWorkshopData] = useState<WorkshopData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingTour, setIsDraggingTour] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tourFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [editedData, setEditedData] = useState<WorkshopData>({
    name: "",
    description: "",
    address: "",
    image_360: "",
    virtual_tours: [],
    rating: 0,
    reviews: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [virtualTours, setVirtualTours] = useState<VirtualTourItem[]>([]);

  // Sync tourFileInputRefs with virtualTours length
  useEffect(() => {
    tourFileInputRefs.current = Array(virtualTours.length).fill(null);
  }, [virtualTours.length]);

  // Fetch workshop data from API
  useEffect(() => {
    const fetchWorkshopData = async () => {
      setLoading(true);
      try {
        const data = await fetchWrapperClient<WorkshopData[]>(
          "/workshop/workshops/",
          {
            method: "GET",
          }
        );
        if (data && data.length > 0) {
          const workshop = data[0];
          setWorkshopData(workshop);
          setEditedData({
            name: workshop.name || "",
            description: workshop.description || "",
            address: workshop.address || "",
            image_360: workshop.image_360 || "",
            virtual_tours: workshop.virtual_tours || (workshop.image_360 ? [workshop.image_360] : []),
            rating: workshop.rating || 4.8,
            reviews: workshop.reviews || 364,
          });
          if (workshop.image_360) {
            setImagePreview(workshop.image_360);
          }
          if (workshop.virtual_tours) {
            setVirtualTours(
              workshop.virtual_tours.map((url) => ({
                file: null,
                preview: url,
                url,
              }))
            );
          }
        } else {
          setWorkshopData(null);
        }
      } catch (err: any) {
        setError("Ustaxona ma'lumotlarini yuklashda xatolik yuz berdi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, []);

  // Handle input changes for editing
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle virtual tour image change
  const handleTourImageChange = (index: number, file?: File) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`Virtual ko‘rgazma ${index + 1}: Fayl hajmi 10MB dan kichik bo‘lishi kerak!`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError(`Virtual ko‘rgazma ${index + 1}: Faqat rasm fayllarini yuklash mumkin!`);
        return;
      }
      const updatedTours = [...virtualTours];
      updatedTours[index] = {
        ...updatedTours[index],
        file,
        preview: URL.createObjectURL(file),
      };
      setVirtualTours(updatedTours);
    }
  };

  const handleTourFileInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleTourImageChange(index, file);
  };

  const handleTourDragOver = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingTour(index);
  };

  const handleTourDragLeave = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingTour(null);
  };

  const handleTourDrop = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingTour(null);
    const file = e.dataTransfer.files[0];
    handleTourImageChange(index, file);
  };

  const addVirtualTour = () => {
    setVirtualTours((prev) => [
      ...prev,
      { file: null, preview: null, url: null },
    ]);
  };

  const removeVirtualTour = (index: number) => {
    const updatedTours = [...virtualTours];
    updatedTours.splice(index, 1);
    setVirtualTours(updatedTours);
  };

  // Drag-and-drop for image_360
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  // Handle image_360 change
  const handleImageChange = (file?: File) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Fayl hajmi 10MB dan kichik bo‘lishi kerak!");
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImageChange(file);
  };

  // Save changes
  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (!userData || !userData.user_id) {
      setError("Foydalanuvchi autentifikatsiya qilinmagan. Iltimos, tizimga kiring.");
      toast.error("Foydalanuvchi autentifikatsiya qilinmagan.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editedData.name);
      formData.append("description", editedData.description);
      formData.append("address", editedData.address);
      formData.append("user", String(userData.user_id));
      if (imageFile) {
        formData.append("image_360", imageFile);
      }
      virtualTours.forEach((tour, index) => {
        if (tour.file) {
          console.log(`Virtual tour ${index} fayli:`, tour.file);
          formData.append(`virtual_tours[${index}]`, tour.file);
        } else if (tour.url) {
          console.log(`Virtual tour ${index} URL:`, tour.url);
          formData.append(`virtual_tours[${index}]`, tour.url);
        }
      });

      let updatedWorkshop;
      if (workshopData?.id) {
        try {
          await fetchWrapperClient(`/workshop/workshops/${workshopData.id}/`, {
            method: "DELETE",
          });
        } catch (deleteErr: any) {
          console.warn("DELETE so‘rovi muvaffaqiyatsiz: ", deleteErr.message);
        }
      }

      updatedWorkshop = await fetchWrapperClient<WorkshopData>(
        "/workshop/workshops/",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Serverdan qaytgan virtual_tours:", updatedWorkshop.virtual_tours);

      setWorkshopData(updatedWorkshop);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(updatedWorkshop.image_360 || null);
      setVirtualTours(
        (updatedWorkshop.virtual_tours || []).map((url) => ({
          file: null,
          preview: url,
          url,
        }))
      );
      setSuccessMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
      toast.success("Ustaxona ma'lumotlari saqlandi!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Ma'lumotlarni saqlashda xatolik yuz berdi: " + (err.message || "Noma'lum xatolik"));
      toast.error("Ma'lumotlarni saqlashda xatolik yuz berdi");
      console.error(err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(workshopData?.image_360 || null);
    setEditedData({
      name: workshopData?.name || "",
      description: workshopData?.description || "",
      address: workshopData?.address || "",
      image_360: workshopData?.image_360 || "",
      virtual_tours: workshopData?.virtual_tours || (workshopData?.image_360 ? [workshopData.image_360] : []),
      rating: workshopData?.rating || 4.8,
      reviews: workshopData?.reviews || 364,
    });
    setVirtualTours(
      (workshopData?.virtual_tours || []).map((url) => ({
        file: null,
        preview: url,
        url,
      }))
    );
  };

  if (loading) {
    return <div className="text-center p-8">Yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mening ustaxonam</h1>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-red-800 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Tahrirlash
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-center bg-red-50 p-3 rounded-md"
        >
          {error}
        </motion.div>
      )}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-600 text-center bg-green-50 p-3 rounded-md"
        >
          {successMessage}
        </motion.div>
      )}

      {workshopData ? (
        <div className="space-y-6">
          {/* Workshop name and rating */}
          <div className="flex flex-col md:flex-row gap-6">
            <div
              className="w-full md:w-1/3 relative"
              onDragOver={isEditing ? handleDragOver : undefined}
              onDragLeave={isEditing ? handleDragLeave : undefined}
              onDrop={isEditing ? handleDrop : undefined}
            >
              {isEditing && isDragging && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                  <p className="text-white">Rasmni bu yerga tashlang</p>
                </div>
              )}
              {isEditing ? (
                <div
                  className="relative cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img
                    src={
                      imagePreview ||
                      (workshopData.image_360
                        ? workshopData.image_360
                        : "/placeholder-workshop.jpg")
                    }
                    alt="Ustaxona"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={
                    imagePreview ||
                    (workshopData.image_360
                      ? workshopData.image_360
                      : "/placeholder-workshop.jpg")
                  }
                  alt="Ustaxona"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <label className="text-sm text-gray-500">Ustaxona nomi</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 mt-1"
                    placeholder="Ustaxona nomini kiriting"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{workshopData.name}</h2>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (workshopData.rating || 4.8)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {workshopData.rating || 4.8} ({workshopData.reviews || 364}{" "}
                  ta baho)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800"
                    placeholder="Joylashuvni kiriting"
                  />
                ) : (
                  <span className="text-gray-600">{workshopData.address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Bio (description) */}
          <div>
            <label className="text-sm text-gray-500">Ustaxona haqida</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 mt-1"
                rows={5}
                placeholder="Ustaxona haqida ma'lumot kiriting"
              />
            ) : (
              <p className="text-gray-600 mt-1">{workshopData.description}</p>
            )}
          </div>

          {/* Virtual tours */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Virtual ko‘rgazmalar</h3>
            {isEditing ? (
              <div className="space-y-2">
                {virtualTours.map((tour, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="relative w-24 h-24 cursor-pointer"
                      onDragOver={handleTourDragOver(index)}
                      onDragLeave={handleTourDragLeave(index)}
                      onDrop={handleTourDrop(index)}
                      onClick={() => tourFileInputRefs.current[index]?.click()}
                    >
                      <div className="w-full h-full bg-gray-50 rounded-md border border-gray-300 flex items-center justify-center">
                        {tour.preview ? (
                          <img
                            src={tour.preview}
                            alt={`Virtual ko‘rgazma ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <p className="text-gray-500 text-center text-xs">
                            Rasmni bu yerga tashlang yoki tanlang
                          </p>
                        )}
                      </div>
                      {isDraggingTour === index && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                          <p className="text-white text-xs">Rasmni bu yerga tashlang</p>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Upload className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={(el) => {
                        tourFileInputRefs.current[index] = el;
                      }}
                      onChange={handleTourFileInputChange(index)}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeVirtualTour(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addVirtualTour}
                  className="text-red-800 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Yangi ko‘rgazma qo‘shish
                </motion.button>
              </div>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {(workshopData.virtual_tours || []).map((tour, index) => (
                  <div key={index} className="relative w-64 h-64">
                    <Panorama image={tour} onLoad={() => console.log(`Panorama ${index + 1} yuklandi`)} />
                    <button className="absolute top-1 right-1 bg-gray-200 rounded-full p-1">
                      <span className="text-xs">3D</span>
                    </button>
                  </div>
                ))}
                {(workshopData.virtual_tours || []).length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <button className="text-red-800 hover:underline">
                      Virtual ko‘rgazma qo‘shish
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <p>Ustaxona ma'lumotlari mavjud emas</p>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Ustaxona nomi</label>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 mt-1"
                  placeholder="Ustaxona nomini kiriting"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Joylashuv</label>
                <input
                  type="text"
                  name="address"
                  value={editedData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 mt-1"
                  placeholder="Joylashuvni kiriting"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Ustaxona haqida</label>
                <textarea
                  name="description"
                  value={editedData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800 mt-1"
                  rows={5}
                  placeholder="Ustaxona haqida ma'lumot kiriting"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Rasm yuklash</label>
                <div
                  className="relative cursor-pointer mt-1"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-full h-48 bg-gray-50 rounded-md border border-gray-300 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500">
                        Rasmni bu yerga tashlang yoki tanlang
                      </p>
                    )}
                  </div>
                  {isDragging && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                      <p className="text-white">Rasmni bu yerga tashlang</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="mt-4 text-red-800 hover:underline"
            >
              Ustaxona qo‘shish
            </motion.button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end mt-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
            Bekor qilish
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Saqlash
          </motion.button>
        </div>
      )}
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