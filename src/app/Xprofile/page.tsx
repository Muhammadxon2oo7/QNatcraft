// "use client";

// import { useState, useEffect, Suspense, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   BarChart3,
//   Settings,
//   LogOut,
//   Edit,
//   Clock,
//   Package,
//   ShoppingBag,
//   Save,
//   Upload,
//   Star,
//   MapPin,
//   Plus,
//   X,
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Play,
//   Trash2,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { User } from "../../../public/img/auth/user";
// import { Mail } from "../../../public/img/auth/Mail";
// import { CartIcon } from "../../../public/img/header/CartIcon";
// import { Phone } from "../../../public/img/auth/phone";
// import { Pin } from "../../../public/img/auth/Pin";
// import { useAuth } from "../../../context/auth-context";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import StatsComponent from "@/components/StatsComponent/StatsComponent";
// import { useTranslations } from "next-intl";
// import ProductsContent from "@/components/Xprofile/ProductsContent/ProductsContent";
// import fetchWrapperClient from "@/services/fetchWrapperClient";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import VirtualTourCard from "@/components/Virtual/VirtualTourCard";

// interface SidebarItem {
//   id: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// const sidebarItems: SidebarItem[] = [
//   { id: "profile", icon: User },
//   { id: "workshop", icon: CartIcon },
//   { id: "products", icon: CartIcon },
//   { id: "payments", icon: Clock },
//   { id: "statistics", icon: BarChart3 },
//   { id: "orders", icon: Settings },
//   { id: "logout", icon: LogOut },
// ];

// interface Profession {
//   id: number;
//   name: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ProfileData {
//   id: number | string;
//   user_email: string;
//   user_first_name: string;
//   phone_number?: string | null;
//   address?: string | null;
//   profile_image?: string | null;
//   experience?: number | null;
//   mentees?: number | null;
//   profession?: Profession | null;
//   bio?: string | null;
//   latitude?: number | null;
//   longitude?: number | null;
//   award?: string | null;
//   created_at?: string;
//   updated_at?: string;
//   user?: number | string;
//   is_verified: boolean;
// }

// interface UserData {
//   email: string;
//   message?: string;
//   profile: ProfileData;
//   user_id: number | string;
// }

// export default function ProfilePage() {
//   const t = useTranslations("profile");
//   const { user, loading, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("profile");

//   if (loading) {
//     return <div className="text-center p-8">{t("loading")}</div>;
//   }

//   if (!user) {
//     return <div className="text-center p-8 text-red-500">{t("noData")}</div>;
//   }

//   // is_verified ga qarab ikkita turli UI ko'rsatamiz
//   if (!user.profile.is_verified) {
//     return (
//       <ProtectedRoute>
//         <ProfileContentSimple userData={user} />
//       </ProtectedRoute>
//     );
//   }

//   // Agar is_verified true bo'lsa, to'liq profil sahifasi ko'rsatiladi
//   return (
//     <ProtectedRoute>
//       <div className="flex flex-wrap max-w-[1380px] px-[10px] mx-auto">
//         <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
//           <Link href="/" className="hover:text-primary">
//             {t("breadcrumbs.home")}
//           </Link>
//           <span className="mx-2">/</span>
//           <span className="text-foreground">{t("breadcrumbs.profile")}</span>
//         </nav>

//         <div className="flex w-full">
//           <div className="border rounded-lg h-fit bg-white overflow-hidden">
//             <nav className="flex flex-col">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={cn(
//                     "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-50",
//                     activeTab === item.id ? "bg-red-50 text-red-800" : "text-gray-700"
//                   )}
//                 >
//                   <item.icon className="h-5 w-5" />
//                   <span>{t(`sidebar.${item.id}`)}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="flex-1 pl-[20px]">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTab}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white rounded-lg border p-6 min-h-[500px]"
//               >
//                 {activeTab === "profile" && <ProfileContent userData={user} />}
//                 {activeTab === "workshop" && <WorkshopContent userData={user} />}
//                 {activeTab === "products" && <ProductsContent />}
//                 {activeTab === "payments" && <PaymentsContent />}
//                 {activeTab === "statistics" && <StatisticsContent />}
//                 {activeTab === "orders" && <OrdersContent />}
//                 {activeTab === "logout" && <LogoutContent onLogout={logout} />}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// // Yangi ProfileContentSimple komponenti
// function ProfileContentSimple({ userData }: { userData: UserData }) {
//   const t = useTranslations("profile.profileContent");
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState<string>("");
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [profileData, setProfileData] = useState<ProfileData | undefined>(userData?.profile);
//   const [editedData, setEditedData] = useState({
//     user_first_name: userData?.profile.user_first_name || "",
//   });
//   const [inputErrors, setInputErrors] = useState({
//     user_first_name: "",
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { refreshUser } = useAuth();

//   const validateInput = (name: string, value: string) => {
//     if (name === "user_first_name") {
//       if (!/^[A-Za-z\s]+$/.test(value) && value !== "") {
//         return t("fields.user_first_name.errors.second");
//       }
//     }
//     return "";
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//     const errorMessage = validateInput(name, value);
//     setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (!isEditing) return;
//     const file = e.dataTransfer.files[0];
//     handleImageChange(file);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (isEditing) setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     handleImageChange(file);
//   };

//   const handleImageChange = (file?: File) => {
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setError(t("image.errors.size"));
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         setError(t("image.errors.type"));
//         return;
//       }
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = async () => {
//     setError("");
//     setSuccessMessage("");

//     const hasErrors = Object.values(inputErrors).some((err) => err !== "");
//     if (hasErrors) {
//       setError(t("messages.validationError"));
//       return;
//     }

//     try {
//       if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

//       const formData = new FormData();
//       formData.append("user_first_name", editedData.user_first_name);
//       if (imageFile) {
//         formData.append("profile_image", imageFile);
//         setIsUploading(true);
//       }

//       const updatedProfile = await fetchWrapperClient<ProfileData>(
//         `/accounts/profiles/${userData.profile.id}/`,
//         {
//           method: "PATCH",
//           body: formData,
//         }
//       );

//       setProfileData(updatedProfile);
//       setIsUploading(false);
//       setImageFile(null);
//       setImagePreview(null);
//       setIsEditing(false);
//       setSuccessMessage(t("messages.success"));
//       await refreshUser();
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: any) {
//       setError(`${t("messages.error")}: ${error.message}`);
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-[1380px] px-[10px] mx-auto py-8">
//       <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
//         <Link href="/" className="hover:text-primary">
//           {t("breadcrumbs.home")}
//         </Link>
//         <span className="mx-2">/</span>
//         <span className="text-foreground">{t("breadcrumbs.profile")}</span>
//       </nav>

//       <div className="bg-white rounded-lg border p-6">
//         <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
//         {error && <div className="text-red-500 text-center mb-4">{error}</div>}
//         {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}
//         {isDragging && isEditing && (
//           <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
//             <p className="text-white text-lg">{t("dragDrop")}</p>
//           </div>
//         )}

//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="flex-shrink-0">
//             <div
//               className={cn(
//                 "w-[146px] h-[146px] rounded-md border border-gray-300 flex items-center justify-center relative overflow-hidden",
//                 isEditing && "cursor-pointer hover:bg-gray-100",
//                 isUploading && "opacity-50"
//               )}
//               onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//             >
//               <img
//                 src={
//                   imagePreview ||
//                   (profileData?.profile_image
//                     ? `https://qqrnatcraft.uz${profileData.profile_image}`
//                     : "/img/user.png")
//                 }
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//               {isEditing && !isUploading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                   <Upload className="h-6 w-6 text-white" />
//                 </div>
//               )}
//               {isUploading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                   <span className="text-white">{t("image.uploading")}</span>
//                 </div>
//               )}
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileInputChange}
//               className="hidden"
//               accept="image/*"
//             />
//             {isEditing && <p className="text-xs text-gray-500 mt-2">{t("image.upload")}</p>}
//           </div>

//           <div className="flex-1 space-y-4">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.user_first_name.label")}</p>
//               {isEditing ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="user_first_name"
//                     value={editedData.user_first_name}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                       inputErrors.user_first_name && "border-red-500"
//                     )}
//                     required
//                   />
//                   {inputErrors.user_first_name && (
//                     <p className="text-red-500 text-xs mt-1">{inputErrors.user_first_name}</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <User />
//                   <span>{profileData?.user_first_name}</span>
//                 </div>
//               )}
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.email.label")}</p>
//               <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                 <Mail />
//                 <span>{userData.email}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end mt-8 gap-4">
//           {isEditing ? (
//             <button
//               onClick={handleSave}
//               disabled={isUploading || Object.values(inputErrors).some((err) => err !== "")}
//               className={cn(
//                 "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
//                 (isUploading || Object.values(inputErrors).some((err) => err !== ""))
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-green-700"
//               )}
//             >
//               <Save className="h-4 w-4" />
//               {t("buttons.save")}
//             </button>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
//             >
//               <Edit className="h-4 w-4" />
//               {t("buttons.edit")}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// // Qolgan komponentlar (ProfileContent, WorkshopContent, va boshqalar) o'zgarishsiz qoladi
// // Faqat ProfileContent va boshqa komponentlarni ushbu faylda saqlashingiz mumkin
// function ProfileContent({ userData }: { userData: UserData | null }) {
//   const t = useTranslations("profile.profileContent");
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState<string>("");
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [profileData, setProfileData] = useState<ProfileData | undefined>(userData?.profile);
//   const [editedData, setEditedData] = useState({
//     user_first_name: userData?.profile.user_first_name || "",
//     phone_number: userData?.profile.phone_number || "",
//     address: userData?.profile.address || "",
//     experience: String(userData?.profile.experience || ""),
//     mentees: String(userData?.profile.mentees || ""),
//   });
//   const [inputErrors, setInputErrors] = useState({
//     user_first_name: "",
//     phone_number: "",
//     experience: "",
//     mentees: "",
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { refreshUser } = useAuth();

//   const validateInput = (name: string, value: string) => {
//     switch (name) {
//       case "user_first_name":
//         if (!/^[A-Za-z\s]+$/.test(value) && value !== "") {
//           return t("fields.user_first_name.errors.second");
//         }
//         return "";
//       case "phone_number":
//         if (!/^\+998[0-9]{9}$/.test(value) && value !== "") {
//           return t("fields.phone_number.errors.second");
//         }
//         return "";
//       case "experience":
//         if (!/^[0-9]+$/.test(value) && value !== "") {
//           return t("fields.experience.errors.second");
//         }
//         return "";
//       case "mentees":
//         if (!/^[0-9]+$/.test(value) && value !== "") {
//           return t("fields.mentees.errors.second");
//         }
//         return "";
//       default:
//         return "";
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//     const errorMessage = validateInput(name, value);
//     setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
//   };

//   const handleSelectChange = (value: string) => {
//     setEditedData((prev) => ({ ...prev, address: value }));
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (!isEditing) return;
//     const file = e.dataTransfer.files[0];
//     handleImageChange(file);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (isEditing) setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     handleImageChange(file);
//   };

//   const handleImageChange = (file?: File) => {
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setError(t("image.errors.size"));
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         setError(t("image.errors.type"));
//         return;
//       }
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSave = async () => {
//     setError("");
//     setSuccessMessage("");

//     const hasErrors = Object.values(inputErrors).some((err) => err !== "");
//     if (hasErrors) {
//       setError(t("messages.validationError"));
//       return;
//     }

//     try {
//       if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

//       const formData = new FormData();
//       Object.entries(editedData).forEach(([key, value]) => {
//         if (key === "experience" || key === "mentees") {
//           formData.append(key, value ? String(Number(value)) : "");
//         } else {
//           formData.append(key, value);
//         }
//       });
//       if (imageFile) {
//         formData.append("profile_image", imageFile);
//         setIsUploading(true);
//       }

//       const updatedProfile = await fetchWrapperClient<ProfileData>(
//         `/accounts/profiles/${userData.profile.id}/`,
//         {
//           method: "PATCH",
//           body: formData,
//         }
//       );

//       setProfileData(updatedProfile);
//       setIsUploading(false);
//       setImageFile(null);
//       setImagePreview(null);
//       setIsEditing(false);
//       setSuccessMessage(t("messages.success"));
//       await refreshUser();
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: any) {
//       setError(`${t("messages.error")}: ${error.message}`);
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 relative" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
//       <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
//       {error && <div className="text-red-500 text-center">{error}</div>}
//       {successMessage && <div className="text-green-600 text-center">{successMessage}</div>}
//       {isDragging && isEditing && (
//         <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
//           <p className="text-white text-lg">{t("dragDrop")}</p>
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="flex-shrink-0">
//           <div
//             className={cn(
//               "w-[146px] h-[146px] rounded-md border border-gray-300 flex items-center justify-center relative overflow-hidden",
//               isEditing && "cursor-pointer hover:bg-gray-100",
//               isUploading && "opacity-50"
//             )}
//             onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
//           >
//             <img
//               src={
//                 imagePreview ||
//                 (profileData?.profile_image ? `https://qqrnatcraft.uz${profileData.profile_image}` : "/img/user.png")
//               }
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//             {isEditing && !isUploading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                 <Upload className="h-6 w-6 text-white" />
//               </div>
//             )}
          
//             {isUploading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                 <span className="text-white">{t("image.uploading")}</span>
//               </div>
//             )}
//           </div>
//           <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" accept="image/*" />
//           {isEditing && <p className="text-xs text-gray-500 mt-2">{t("image.upload")}</p>}
//         </div>

//         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.user_first_name.label")}</p>
//               {isEditing ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="user_first_name"
//                     value={editedData.user_first_name}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                       inputErrors.user_first_name && "border-red-500"
//                     )}
//                     required
//                   />
//                   {inputErrors.user_first_name && (
//                     <p className="text-red-500 text-xs mt-1">{inputErrors.user_first_name}</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <User />
//                   <span>{profileData?.user_first_name}</span>
//                 </div>
//               )}
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.email.label")}</p>
//               <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                 <Mail />
//                 <span>{profileData?.user_email}</span>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.phone_number.label")}</p>
//               {isEditing ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="phone_number"
//                     value={editedData.phone_number}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                       inputErrors.phone_number && "border-red-500"
//                     )}
//                     required
//                   />
//                   {inputErrors.phone_number && (
//                     <p className="text-red-500 text-xs mt-1">{inputErrors.phone_number}</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <Phone />
//                   <span>{profileData?.phone_number || t("unknown")}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.address.label")}</p>
//               {isEditing ? (
//                 <Select value={editedData.address} onValueChange={handleSelectChange}>
//                   <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
//                     <SelectValue placeholder={t("fields.address.placeholder")} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Qo`ng`irot">Qo`ng`irot</SelectItem>
//                     <SelectItem value="Mo`ynoq">Mo`ynoq</SelectItem>
//                     <SelectItem value="Shumanag">Shumanag</SelectItem>
//                     <SelectItem value="Taxtako`pir">Taxtako`pir</SelectItem>
//                     <SelectItem value="Amudaryo">Amudaryo</SelectItem>
//                     <SelectItem value="Nukus">Nukus</SelectItem>
//                     <SelectItem value="Xo`jayli">Xo`jayli</SelectItem>
//                     <SelectItem value="Taxiatosh">Taxiatosh</SelectItem>
//                     <SelectItem value="Beruniy">Beruniy</SelectItem>
//                     <SelectItem value="Ellik qal`a">Ellik qal`a</SelectItem>
//                     <SelectItem value="To`rtko`l">To`rtko`l</SelectItem>
//                     <SelectItem value="Qorao`zak">Qorao`zak</SelectItem>
//                     <SelectItem value="Chimboy">Chimboy</SelectItem>
//                     <SelectItem value="Bo`zatov">Bo`zatov</SelectItem>
//                     <SelectItem value="Kegeyli">Kegeyli</SelectItem>
//                   </SelectContent>
//                 </Select>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <Pin />
//                   <span>{profileData?.address || t("unknown")}</span>
//                 </div>
//               )}
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.experience.label")}</p>
//               {isEditing ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="experience"
//                     value={editedData.experience}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                       inputErrors.experience && "border-red-500"
//                     )}
//                     required
//                   />
//                   {inputErrors.experience && (
//                     <p className="text-red-500 text-xs mt-1">{inputErrors.experience}</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <CartIcon />
//                   <span>{profileData?.experience || t("unknown")}</span>
//                 </div>
//               )}
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">{t("fields.mentees.label")}</p>
//               {isEditing ? (
//                 <div>
//                   <input
//                     type="text"
//                     name="mentees"
//                     value={editedData.mentees}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                       inputErrors.mentees && "border-red-500"
//                     )}
//                     required
//                   />
//                   {inputErrors.mentees && (
//                     <p className="text-red-500 text-xs mt-1">{inputErrors.mentees}</p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                   <User />
//                   <span>{profileData?.mentees || t("unknown")}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end mt-8 gap-4">
//         {isEditing ? (
//           <button
//             onClick={handleSave}
//             disabled={isUploading || Object.values(inputErrors).some((err) => err !== "")}
//             className={cn(
//               "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
//               (isUploading || Object.values(inputErrors).some((err) => err !== "")) ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
//             )}
//           >
//             <Save className="h-4 w-4" />
//             {t("buttons.save")}
//           </button>
//         ) : (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
//           >
//             <Edit className="h-4 w-4" />
//             {t("buttons.edit")}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }













// // workshop start
// interface WorkshopData {
//   id?: number | string;
//   name: string;
//   description: string;
//   img: string | null;
//   address: string;
//   images_360?: { id: number; image_360: string }[];
//   rating?: number;
//   reviews?: number;
// }

// interface VirtualTourItem {
//   id?: number;
//   file: File | null;
//   preview: string | null;
// }

// interface UserData {
//   user_id: number | string;
// }

// const WorkshopContent: React.FC<{ userData: UserData | null }> = ({ userData }) => {
//   const t = useTranslations("profile.workshopContent");
//   const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [editedData, setEditedData] = useState<WorkshopData>({
//     name: "",
//     description: "",
//     img: null,
//     address: "",
//     images_360: [],
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [virtualTours, setVirtualTours] = useState<VirtualTourItem[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const tourFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     fetchWorkshop();
//   }, []);

//   useEffect(() => {
//     tourFileInputRefs.current = Array(virtualTours.length).fill(null);
//   }, [virtualTours.length]);

//   const fetchWorkshop = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchWrapperClient<WorkshopData>("/workshop/workshops/my_workshop/", { method: "GET" });
//       if (data) {
//         setWorkshop(data);
//         setEditedData({ ...data, images_360: data.images_360 || [] });
//         setImagePreview(data.img || null);
//         setVirtualTours(
//           (data.images_360 || []).map((item) => ({
//             id: item.id,
//             file: null,
//             preview: item.image_360,
//           }))
//         );
//       } else {
//         setError(t("messages.noData"));
//       }
//     } catch (err: any) {
//       setError(t("messages.error") + (err.message ? `: ${err.message}` : ""));
//       console.error("Fetch workshop error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (file?: File) => {
//     if (!file || file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
//       setError(file?.size ? t("image.errors.size") : t("image.errors.type"));
//       return;
//     }
//     setImageFile(file);
//     const preview = URL.createObjectURL(file);
//     setImagePreview(preview);
//     setEditedData((prev) => ({ ...prev, img: preview }));
//   };

//   const handleTourImageChange = (index: number, file?: File) => {
//     if (!file || file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
//       setError(file?.size ? t("image.errors.tourSize").replace("{index}", String(index + 1)) : t("image.errors.tourType"));
//       return;
//     }
//     const updatedTours = [...virtualTours];
//     updatedTours[index] = { ...updatedTours[index], file, preview: URL.createObjectURL(file) };
//     setVirtualTours(updatedTours);
//   };

//   const handleSave = async () => {
//     if (!userData?.user_id) {
//       setError(t("messages.authError"));
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("name", editedData.name || "");
//       formData.append("description", editedData.description || "");
//       formData.append("address", editedData.address || "");
//       formData.append("user", String(userData.user_id));
//       if (imageFile) formData.append("img", imageFile);

//       const workshopData = workshop?.id
//         ? await fetchWrapperClient<WorkshopData>(`/workshop/workshops/${workshop.id}/`, { method: "PUT", body: formData })
//         : await fetchWrapperClient<WorkshopData>("/workshop/workshops/", { method: "POST", body: formData });

//       for (const tour of virtualTours) {
//         if (tour.file) {
//           const tourFormData = new FormData();
//           tourFormData.append("image_360", tour.file);
//           await fetchWrapperClient(`/workshop/workshops/${workshopData.id}/add_image_360/`, {
//             method: "POST",
//             body: tourFormData,
//           });
//         }
//       }

//       const updatedWorkshop = await fetchWrapperClient<WorkshopData>(`/workshop/workshops/${workshopData.id}/`, {
//         method: "GET",
//       });
//       setWorkshop(updatedWorkshop);
//       setEditedData({ ...updatedWorkshop, images_360: updatedWorkshop.images_360 || [] });
//       setImageFile(null);
//       setImagePreview(updatedWorkshop.img || null);
//       setVirtualTours(
//         (updatedWorkshop.images_360 || []).map((item) => ({ id: item.id, file: null, preview: item.image_360 }))
//       );
//       setIsEditing(false);
//       setSuccess(t("messages.success"));
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err: any) {
//       setError(`${t("messages.error")}: ${err.message || "Unknown error"}`);
//       console.error("Save workshop error:", err);
//     }
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setImageFile(null);
//     setImagePreview(workshop?.img || null);

//     const defaultWorkshop: WorkshopData = {
//       id: workshop?.id || "",
//       name: workshop?.name || "",
//       description: workshop?.description || "",
//       img: workshop?.img || null,
//       address: workshop?.address || "",
//       images_360: workshop?.images_360 || [],
//       rating: workshop?.rating || 0,
//       reviews: workshop?.reviews || 0,
//     };

//     setEditedData(defaultWorkshop);
//     setVirtualTours(
//       (workshop?.images_360 || []).map((item) => ({
//         id: item.id,
//         file: null,
//         preview: item.image_360,
//       }))
//     );
//   };

//   const addVirtualTour = () => setVirtualTours((prev) => [...prev, { file: null, preview: null }]);
//   const removeVirtualTour = (index: number) => setVirtualTours((prev) => prev.filter((_, i) => i !== index));

//   if (loading) return <div className="text-center p-8">{t("messages.loading")}</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">{t("title")}</h1>
//         {!isEditing && (
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsEditing(true)}
//             className="bg-red-800 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-900"
//           >
//             <Edit className="h-4 w-4" />
//             {t("buttons.edit")}
//           </motion.button>
//         )}
//       </div>

//       {error && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-red-500 text-center bg-red-50 p-3 rounded-md"
//         >
//           {error}
//         </motion.div>
//       )}
//       {success && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-green-600 text-center bg-green-50 p-3 rounded-md"
//         >
//           {success}
//         </motion.div>
//       )}

//       {workshop ? (
//         <div className="space-y-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             <div
//               className="w-full md:w-1/3 relative"
//               onDrop={isEditing ? (e) => handleImageChange(e.dataTransfer.files[0]) : undefined}
//               onDragOver={isEditing ? (e) => e.preventDefault() : undefined}
//             >
//               {isEditing ? (
//                 <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
//                   <img
//                     src={imagePreview || workshop.img || "/placeholder-workshop.jpg"}
//                     alt="Workshop"
//                     className="w-full h-48 object-cover rounded-md"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                     <Upload className="h-6 w-6 text-white" />
//                   </div>
//                 </div>
//               ) : (
//                 <img
//                   src={imagePreview || workshop.img || "/placeholder-workshop.jpg"}
//                   alt="Workshop"
//                   className="w-full h-48 object-cover rounded-md"
//                 />
//               )}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={(e) => handleImageChange(e.target.files?.[0])}
//                 accept="image/*"
//                 className="hidden"
//               />
//             </div>
//             <div className="flex-1 space-y-4">
//               <div>
//                 <label className="text-sm text-gray-500">{t("fields.name.label")}</label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={editedData.name}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                     placeholder={t("fields.name.placeholder")}
//                   />
//                 ) : (
//                   <h2 className="text-xl font-bold">{workshop.name}</h2>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-5 w-5 ${
//                       i < (workshop?.rating ?? 4.8) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//                 <span className="text-gray-600">
//                   {workshop?.rating ?? 4.8} ({workshop?.reviews ?? 364} {t("fields.reviews")})
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5 text-gray-500" />
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="address"
//                     value={editedData.address}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                     placeholder={t("fields.address.placeholder")}
//                   />
//                 ) : (
//                   <span className="text-gray-600">{workshop.address}</span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="text-sm text-gray-500">{t("fields.description.label")}</label>
//             {isEditing ? (
//               <textarea
//                 name="description"
//                 value={editedData.description}
//                 onChange={handleInputChange}
//                 className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                 rows={5}
//                 placeholder={t("fields.description.placeholder")}
//               />
//             ) : (
//               <p className="text-gray-600">{workshop.description}</p>
//             )}
//           </div>

//           <div>
//             <h3 className="text-lg font-semibold mb-2">{t("virtualTours.title")}</h3>
//             {isEditing ? (
//               <div className="space-y-2">
//                 {virtualTours.map((tour, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <div
//                       className="relative w-24 h-24 cursor-pointer"
//                       onDrop={(e) => handleTourImageChange(index, e.dataTransfer.files[0])}
//                       onDragOver={(e) => e.preventDefault()}
//                       onClick={() => tourFileInputRefs.current[index]?.click()}
//                     >
//                       <img
//                         src={tour.preview || "/placeholder-tour.jpg"}
//                         alt={`Tour ${index + 1}`}
//                         className="w-full h-full object-cover rounded-md"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                         <Upload className="h-5 w-5 text-white" />
//                       </div>
//                     </div>
//                     <input
//                       type="file"
//                       ref={(el) => {
//                         tourFileInputRefs.current[index] = el;
//                       }}
//                       onChange={(e) => handleTourImageChange(index, e.target.files?.[0])}
//                       accept="image/*"
//                       className="hidden"
//                     />
//                     <motion.button
//                       whileHover={{ scale: 1.1 }}
//                       onClick={() => removeVirtualTour(index)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <X className="h-5 w-5" />
//                     </motion.button>
//                   </div>
//                 ))}
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   onClick={addVirtualTour}
//                   className="text-red-800 hover:underline flex items-center gap-1"
//                 >
//                   <Plus className="h-4 w-4" />
//                   {t("buttons.addTour")}
//                 </motion.button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
//                 {(workshop?.images_360 || []).length > 0 ? (
//                   workshop.images_360?.map((tour) => (
//                     <VirtualTourCard key={tour.id} tour={tour.image_360} />
//                   ))
//                 ) : (
//                   <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
//                     <p className="text-gray-500">{t("virtualTours.noTours")}</p>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       onClick={() => setIsEditing(true)}
//                       className="mt-2 text-red-800 hover:underline flex items-center gap-1 justify-center"
//                     >
//                       <Plus className="h-4 w-4" />
//                       {t("buttons.addTour")}
//                     </motion.button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="p-8 text-center text-gray-500">
//           <p>{t("messages.noData")}</p>
//           {isEditing && (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={editedData.name}
//                 onChange={handleInputChange}
//                 className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                 placeholder={t("fields.name.placeholder")}
//               />
//               <input
//                 type="text"
//                 name="address"
//                 value={editedData.address}
//                 onChange={handleInputChange}
//                 className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                 placeholder={t("fields.address.placeholder")}
//               />
//               <textarea
//                 name="description"
//                 value={editedData.description}
//                 onChange={handleInputChange}
//                 className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
//                 rows={5}
//                 placeholder={t("fields.description.placeholder")}
//               />
//               <div
//                 className="relative cursor-pointer"
//                 onDrop={(e) => handleImageChange(e.dataTransfer.files[0])}
//                 onDragOver={(e) => e.preventDefault()}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <img
//                   src={imagePreview || "/placeholder-workshop.jpg"}
//                   alt="Preview"
//                   className="w-full h-48 object-cover rounded-md"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                   <Upload className="h-6 w-6 text-white" />
//                 </div>
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={(e) => handleImageChange(e.target.files?.[0])}
//                 accept="image/*"
//                 className="hidden"
//               />
//             </div>
//           )}
//           {!isEditing && (
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               onClick={() => setIsEditing(true)}
//               className="mt-4 text-red-800 hover:underline"
//             >
//               {t("buttons.addWorkshop")}
//             </motion.button>
//           )}
//         </div>
//       )}

//       {isEditing && (
//         <div className="flex justify-end gap-4">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             onClick={handleCancel}
//             className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600"
//           >
//             <X className="h-4 w-4" />
//             {t("buttons.cancel")}
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             onClick={handleSave}
//             className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
//           >
//             <Save className="h-4 w-4" />
//             {t("buttons.save")}
//           </motion.button>
//         </div>
//       )}
//     </div>
//   );
// };



// // workshop end

// function PaymentsContent() {
//   const t = useTranslations("profile.paymentsContent");
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
//       <div className="p-8 text-center text-gray-500">
//         <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
//         <p>{t("placeholder")}</p>
//       </div>
//     </div>
//   );
// }

// function StatisticsContent() {
//   const t = useTranslations("profile.statisticsContent");
//   return (
//     <div className="space-y-6">
//       <StatsComponent />
//     </div>
//   );
// }

// function OrdersContent() {
//   const t = useTranslations("profile.ordersContent");
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
//       <div className="p-8 text-center text-gray-500">
//         <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
//         <p>{t("placeholder")}</p>
//       </div>
//     </div>
//   );
// }

// function LogoutContent({ onLogout }: { onLogout: () => void }) {
//   const t = useTranslations("profile.logoutContent");
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
//       <div className="p-8 text-center text-gray-500">
//         <LogOut className="h-16 w-16 mx-auto mb-4 text-gray-400" />
//         <p>{t("prompt")}</p>
//         <button
//           onClick={onLogout}
//           className="mt-4 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors"
//         >
//           {t("confirm")}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Trash2,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { User } from "../../../public/img/auth/user";
import { Mail } from "../../../public/img/auth/Mail";
import { CartIcon } from "../../../public/img/header/CartIcon";
import { Phone } from "../../../public/img/auth/phone";
import { Pin } from "../../../public/img/auth/Pin";
import { useAuth } from "../../../context/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatsComponent from "@/components/StatsComponent/StatsComponent";
import { useTranslations } from "next-intl";
import ProductsContent from "@/components/Xprofile/ProductsContent/ProductsContent";
import fetchWrapperClient from "@/services/fetchWrapperClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VirtualTourCard from "@/components/Virtual/VirtualTourCard";

interface SidebarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { id: "profile", icon: User },
  { id: "workshop", icon: CartIcon },
  { id: "products", icon: CartIcon },
  { id: "payments", icon: Clock },
  { id: "statistics", icon: BarChart3 },
  { id: "orders", icon: Settings },
  { id: "logout", icon: LogOut },
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
  profession?: number | null;
  bio?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  award?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: number | string;
  is_verified: boolean;
}

interface UserData {
  email: string;
  message?: string;
  profile: ProfileData;
  user_id: number | string;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) {
    return <div className="text-center p-8">{t("loading")}</div>;
  }

  if (!user) {
    return <div className="text-center p-8 text-red-500">{t("noData")}</div>;
  }

  if (!user.profile.is_verified) {
    return (
      <ProtectedRoute>
        <ProfileContentSimple userData={user} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-wrap max-w-[1380px] px-[10px] mx-auto">
        <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
          <Link href="/" className="hover:text-primary">
            {t("breadcrumbs.home")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{t("breadcrumbs.profile")}</span>
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
                  <span>{t(`sidebar.${item.id}`)}</span>
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
    </ProtectedRoute>
  );
}

function ProfileContentSimple({ userData }: { userData: UserData }) {
  const t = useTranslations("profile.profileContent");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | undefined>(userData?.profile);
  const [editedData, setEditedData] = useState({
    user_first_name: userData?.profile.user_first_name || "",
  });
  const [inputErrors, setInputErrors] = useState({
    user_first_name: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshUser } = useAuth();

  const validateInput = (name: string, value: string) => {
    if (name === "user_first_name") {
      if (!/^[A-Za-z\s]+$/.test(value) && value !== "") {
        return t("fields.user_first_name.errors.second");
      }
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validateInput(name, value);
    setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

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
        setError(t("image.errors.size"));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError(t("image.errors.type"));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      user_first_name: profileData?.user_first_name || "",
    });
    setInputErrors({ user_first_name: "" });
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    const hasErrors = Object.values(inputErrors).some((err) => err !== "");
    if (hasErrors) {
      setError(t("messages.validationError"));
      return;
    }

    try {
      if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

      const formData = new FormData();
      formData.append("user_first_name", editedData.user_first_name);
      if (imageFile) {
        formData.append("profile_image", imageFile);
        setIsUploading(true);
      }

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
      setSuccessMessage(t("messages.success"));
      await refreshUser();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(`${t("messages.error")}: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-[1380px] px-[10px] mx-auto py-8">
      <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
        <Link href="/" className="hover:text-primary">
          {t("breadcrumbs.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{t("breadcrumbs.profile")}</span>
      </nav>

      <div className="bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}
        {isDragging && isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
            <p className="text-white text-lg">{t("dragDrop")}</p>
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
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
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
                  <span className="text-white">{t("image.uploading")}</span>
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
            {isEditing && <p className="text-xs text-gray-500 mt-2">{t("image.upload")}</p>}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.user_first_name.label")}</p>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="user_first_name"
                    value={editedData.user_first_name}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                      inputErrors.user_first_name && "border-red-500"
                    )}
                    required
                  />
                  {inputErrors.user_first_name && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.user_first_name}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User />
                  <span>{profileData?.user_first_name}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.email.label")}</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Mail />
                <span>{userData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
                {t("buttons.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading || Object.values(inputErrors).some((err) => err !== "")}
                className={cn(
                  "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
                  (isUploading || Object.values(inputErrors).some((err) => err !== ""))
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                )}
              >
                <Save className="h-4 w-4" />
                {t("buttons.save")}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
            >
              <Edit className="h-4 w-4" />
              {t("buttons.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileContent({ userData }: { userData: UserData | null }) {
  const t = useTranslations("profile.profileContent");
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
    bio: userData?.profile.bio || "",
    profession: String(userData?.profile.profession || ""),
  });
  const [inputErrors, setInputErrors] = useState({
    user_first_name: "",
    phone_number: "",
    experience: "",
    mentees: "",
    bio: "",
    profession: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshUser, getToken } = useAuth();
  const token = getToken();
  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        if (!token) {
          setError(t("messages.authRequired"));
          setProfessions([]);
          return;
        }

        const data = await fetchWrapperClient<Profession[]>("/accounts/professions/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(data)) {
          setProfessions(data);
        } else {
          console.error("API javobi array emas:", data);
          setError(t("messages.professionsFetchError"));
          setProfessions([]);
        }
      } catch (error: any) {
        console.error("Kasblarni olishda xatolik:", error);
        setError(t("messages.professionsFetchError"));
        setProfessions([]);
      }
    };
    fetchProfessions();
  }, [token, t]);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "user_first_name":
        if (!/^[A-Za-z\s]+$/.test(value) && value !== "") {
          return t("fields.user_first_name.errors.second");
        }
        return "";
      case "phone_number":
        if (!/^\+998[0-9]{9}$/.test(value) && value !== "") {
          return t("fields.phone_number.errors.second");
        }
        return "";
      case "experience":
        if (!/^[0-9]+$/.test(value) && value !== "") {
          return t("fields.experience.errors.second");
        }
        return "";
      case "mentees":
        if (!/^[0-9]+$/.test(value) && value !== "") {
          return t("fields.mentees.errors.second");
        }
        return "";
      case "bio":
        if (value.length > 3500) {
          return t("fields.bio.errors.length");
        }
        return "";
      case "profession":
        if (!value) {
          return t("fields.profession.errors.required");
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validateInput(name, value);
    setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validateInput(name, value);
    setInputErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

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
        setError(t("image.errors.size"));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError(t("image.errors.type"));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      user_first_name: profileData?.user_first_name || "",
      phone_number: profileData?.phone_number || "",
      address: profileData?.address || "",
      experience: String(profileData?.experience || ""),
      mentees: String(profileData?.mentees || ""),
      bio: profileData?.bio || "",
      profession: String(profileData?.profession || ""),
    });
    setInputErrors({
      user_first_name: "",
      phone_number: "",
      experience: "",
      mentees: "",
      bio: "",
      profession: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    const hasErrors = Object.values(inputErrors).some((err) => err !== "");
    if (hasErrors) {
      setError(t("messages.validationError"));
      return;
    }

    try {
      if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

      const formData = new FormData();
      Object.entries(editedData).forEach(([key, value]) => {
        if (key === "experience" || key === "mentees") {
          formData.append(key, value ? String(Number(value)) : "");
        } else if (key === "profession" && value) {
          formData.append(key, value);
        } else if (key === "user_first_name") {
          formData.append("user_first_name", value);
        } else if (value) {
          formData.append(key, value);
        }
      });
      if (imageFile) {
        formData.append("profile_image", imageFile);
        setIsUploading(true);
      }

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
      setSuccessMessage(t("messages.success"));
      await refreshUser();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(`${t("messages.error")}: ${error.message}`);
      setIsUploading(false);
    }
  };

  const getProfessionName = (id: number | null | undefined) => {
    if (!id) return t("unknown");
    const profession = professions.find((p) => p.id === Number(id));
    return profession?.name || t("unknown");
  };

  return (
    <div className="space-y-6 relative" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <h1 className="text-2xl font-bold mb-8">{t("title")}</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && <div className="text-green-600 text-center">{successMessage}</div>}
      {isDragging && isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <p className="text-white text-lg">{t("dragDrop")}</p>
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
                (profileData?.profile_image ? `https://qqrnatcraft.uz${profileData.profile_image}` : "/img/user.png")
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
                <span className="text-white">{t("image.uploading")}</span>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" accept="image/*" />
          {isEditing && <p className="text-xs text-gray-500 mt-2">{t("image.upload")}</p>}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.user_first_name.label")}</p>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="user_first_name"
                    value={editedData.user_first_name}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                      inputErrors.user_first_name && "border-red-500"
                    )}
                    required
                  />
                  {inputErrors.user_first_name && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.user_first_name}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User />
                  <span>{profileData?.user_first_name}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.email.label")}</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <Mail />
                <span>{profileData?.user_email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.phone_number.label")}</p>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="phone_number"
                    value={editedData.phone_number}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                      inputErrors.phone_number && "border-red-500"
                    )}
                    required
                  />
                  {inputErrors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.phone_number}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Phone />
                  <span>{profileData?.phone_number || t("unknown")}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.address.label")}</p>
              {isEditing ? (
                <Select value={editedData.address} onValueChange={(value) => handleSelectChange("address", value)}>
                  <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
                    <SelectValue placeholder={t("fields.address.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qo`ng`irot">Qo`ng`irot</SelectItem>
                    <SelectItem value="Mo`ynoq">Mo`ynoq</SelectItem>
                    <SelectItem value="Shumanag">Shumanag</SelectItem>
                    <SelectItem value="Taxtako`pir">Taxtako`pir</SelectItem>
                    <SelectItem value="Amudaryo">Amudaryo</SelectItem>
                    <SelectItem value="Nukus">Nukus</SelectItem>
                    <SelectItem value="Xo`jayli">Xo`jayli</SelectItem>
                    <SelectItem value="Taxiatosh">Taxiatosh</SelectItem>
                    <SelectItem value="Beruniy">Beruniy</SelectItem>
                    <SelectItem value="Ellik qal`a">Ellik qal`a</SelectItem>
                    <SelectItem value="To`rtko`l">To`rtko`l</SelectItem>
                    <SelectItem value="Qorao`zak">Qorao`zak</SelectItem>
                    <SelectItem value="Chimboy">Chimboy</SelectItem>
                    <SelectItem value="Bo`zatov">Bo`zatov</SelectItem>
                    <SelectItem value="Kegeyli">Kegeyli</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Pin />
                  <span>{profileData?.address || t("unknown")}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.profession.label")}</p>
              {isEditing ? (
                <div>
                  <Select
                    value={editedData.profession}
                    onValueChange={(value) => handleSelectChange("profession", value)}
                  >
                    <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
                      <SelectValue placeholder={t("fields.profession.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(professions) && professions.length > 0 ? (
                        professions.map((profession) => (
                          <SelectItem key={profession.id} value={String(profession.id)}>
                            {profession.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-gray-500">{t("fields.profession.noData")}</div>
                      )}
                    </SelectContent>
                  </Select>
                  {inputErrors.profession && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.profession}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Briefcase />
                  <span>{getProfessionName(profileData?.profession)}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.experience.label")}</p>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="experience"
                    value={editedData.experience}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                      inputErrors.experience && "border-red-500"
                    )}
                    required
                  />
                  {inputErrors.experience && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.experience}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <CartIcon />
                  <span>{profileData?.experience || t("unknown")}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{t("fields.mentees.label")}</p>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="mentees"
                    value={editedData.mentees}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                      inputErrors.mentees && "border-red-500"
                    )}
                    required
                  />
                  {inputErrors.mentees && (
                    <p className="text-red-500 text-xs mt-1">{inputErrors.mentees}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <User />
                  <span>{profileData?.mentees || t("unknown")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500 mb-1">Bio</p>
        {isEditing ? (
          <div>
            <textarea
              name="bio"
              value={editedData.bio}
              onChange={handleInputChange}
              className={cn(
                "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
                inputErrors.bio && "border-red-500"
              )}
              rows={5}
              placeholder={t("fields.bio.placeholder")}
            />
            {inputErrors.bio && <p className="text-red-500 text-xs mt-1">{inputErrors.bio}</p>}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-gray-600">{profileData?.bio || t("fields.bio.placeholder")}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8 gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
              {t("buttons.cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading || Object.values(inputErrors).some((err) => err !== "")}
              className={cn(
                "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
                (isUploading || Object.values(inputErrors).some((err) => err !== ""))
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              )}
            >
              <Save className="h-4 w-4" />
              {t("buttons.save")}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {t("buttons.edit")}
          </button>
        )}
      </div>
    </div>
  );
}

interface WorkshopData {
  id?: number | string;
  name: string;
  description: string;
  img: string | null;
  address: string;
  images_360?: { id: number; image_360: string }[];
  rating?: number;
  reviews?: number;
}

interface VirtualTourItem {
  id?: number;
  file: File | null;
  preview: string | null;
}

const WorkshopContent: React.FC<{ userData: UserData | null }> = ({ userData }) => {
  const t = useTranslations("profile.workshopContent");
  const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editedData, setEditedData] = useState<WorkshopData>({
    name: "",
    description: "",
    img: null,
    address: "",
    images_360: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [virtualTours, setVirtualTours] = useState<VirtualTourItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tourFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchWorkshop();
  }, []);

  useEffect(() => {
    tourFileInputRefs.current = Array(virtualTours.length).fill(null);
  }, [virtualTours.length]);

  const fetchWorkshop = async () => {
    setLoading(true);
    try {
      const data = await fetchWrapperClient<WorkshopData>("/workshop/workshops/my_workshop/", { method: "GET" });
      if (data) {
        setWorkshop(data);
        setEditedData({ ...data, images_360: data.images_360 || [] });
        setImagePreview(data.img || null);
        setVirtualTours(
          (data.images_360 || []).map((item) => ({
            id: item.id,
            file: null,
            preview: item.image_360,
          }))
        );
      } else {
        setError(t("messages.noData"));
      }
    } catch (err: any) {
      setError(t("messages.error") + (err.message ? `: ${err.message}` : ""));
      console.error("Fetch workshop error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file?: File) => {
    if (!file || file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
      setError(file?.size ? t("image.errors.size") : t("image.errors.type"));
      return;
    }
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setEditedData((prev) => ({ ...prev, img: preview }));
  };

  const handleTourImageChange = (index: number, file?: File) => {
    if (!file || file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")) {
      setError(file?.size ? t("image.errors.tourSize").replace("{index}", String(index + 1)) : t("image.errors.tourType"));
      return;
    }
    const updatedTours = [...virtualTours];
    updatedTours[index] = { ...updatedTours[index], file, preview: URL.createObjectURL(file) };
    setVirtualTours(updatedTours);
  };

  const handleSave = async () => {
    if (!userData?.user_id) {
      setError(t("messages.authError"));
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", editedData.name || "");
      formData.append("description", editedData.description || "");
      formData.append("address", editedData.address || "");
      formData.append("user", String(userData.user_id));
      if (imageFile) formData.append("img", imageFile);

      const workshopData = workshop?.id
        ? await fetchWrapperClient<WorkshopData>(`/workshop/workshops/${workshop.id}/`, { method: "PUT", body: formData })
        : await fetchWrapperClient<WorkshopData>("/workshop/workshops/", { method: "POST", body: formData });

      for (const tour of virtualTours) {
        if (tour.file) {
          const tourFormData = new FormData();
          tourFormData.append("image_360", tour.file);
          await fetchWrapperClient(`/workshop/workshops/${workshopData.id}/add_image_360/`, {
            method: "POST",
            body: tourFormData,
          });
        }
      }

      const updatedWorkshop = await fetchWrapperClient<WorkshopData>(`/workshop/workshops/${workshopData.id}/`, {
        method: "GET",
      });
      setWorkshop(updatedWorkshop);
      setEditedData({ ...updatedWorkshop, images_360: updatedWorkshop.images_360 || [] });
      setImageFile(null);
      setImagePreview(updatedWorkshop.img || null);
      setVirtualTours(
        (updatedWorkshop.images_360 || []).map((item) => ({ id: item.id, file: null, preview: item.image_360 }))
      );
      setIsEditing(false);
      setSuccess(t("messages.success"));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(`${t("messages.error")}: ${err.message || "Unknown error"}`);
      console.error("Save workshop error:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(workshop?.img || null);
    setEditedData({
      id: workshop?.id || "",
      name: workshop?.name || "",
      description: workshop?.description || "",
      img: workshop?.img || null,
      address: workshop?.address || "",
      images_360: workshop?.images_360 || [],
      rating: workshop?.rating || 0,
      reviews: workshop?.reviews || 0,
    });
    setVirtualTours(
      (workshop?.images_360 || []).map((item) => ({
        id: item.id,
        file: null,
        preview: item.image_360,
      }))
    );
    setError("");
  };

  const addVirtualTour = () => setVirtualTours((prev) => [...prev, { file: null, preview: null }]);
  const removeVirtualTour = (index: number) => setVirtualTours((prev) => prev.filter((_, i) => i !== index));

  if (loading) return <div className="text-center p-8">{t("messages.loading")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-red-800 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-900"
          >
            <Edit className="h-4 w-4" />
            {t("buttons.edit")}
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-center bg-red-50 p-3 rounded-md"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-center bg-green-50 p-3 rounded-md"
        >
          {success}
        </motion.div>
      )}

      {workshop ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div
              className="w-full md:w-1/3 relative"
              onDrop={isEditing ? (e) => handleImageChange(e.dataTransfer.files[0]) : undefined}
              onDragOver={isEditing ? (e) => e.preventDefault() : undefined}
            >
              {isEditing ? (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                  <img
                    src={imagePreview || workshop.img || "/placeholder-workshop.jpg"}
                    alt="Workshop"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={imagePreview || workshop.img || "/placeholder-workshop.jpg"}
                  alt="Workshop"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm text-gray-500">{t("fields.name.label")}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                    placeholder={t("fields.name.placeholder")}
                  />
                ) : (
                  <h2 className="text-xl font-bold">{workshop.name}</h2>
                )}
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < (workshop?.rating ?? 4.8) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-gray-600">
                  {workshop?.rating ?? 4.8} ({workshop?.reviews ?? 364} {t("fields.reviews")})
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
                    className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                    placeholder={t("fields.address.placeholder")}
                  />
                ) : (
                  <span className="text-gray-600">{workshop.address}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">{t("fields.description.label")}</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                rows={5}
                placeholder={t("fields.description.placeholder")}
              />
            ) : (
              <p className="text-gray-600">{workshop.description}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("virtualTours.title")}</h3>
            {isEditing ? (
              <div className="space-y-2">
                {virtualTours.map((tour, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="relative w-24 h-24 cursor-pointer"
                      onDrop={(e) => handleTourImageChange(index, e.dataTransfer.files[0])}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => tourFileInputRefs.current[index]?.click()}
                    >
                      <img
                        src={tour.preview || "/placeholder-tour.jpg"}
                        alt={`Tour ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Upload className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={(el) => {
                        tourFileInputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleTourImageChange(index, e.target.files?.[0])}
                      accept="image/*"
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => removeVirtualTour(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={addVirtualTour}
                  className="text-red-800 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t("buttons.addTour")}
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
                {(workshop?.images_360 || []).length > 0 ? (
                  workshop.images_360?.map((tour) => (
                    <VirtualTourCard key={tour.id} tour={tour.image_360} />
                  ))
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                    <p className="text-gray-500">{t("virtualTours.noTours")}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-red-800 hover:underline flex items-center gap-1 justify-center"
                    >
                      <Plus className="h-4 w-4" />
                      {t("buttons.addTour")}
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <p>{t("messages.noData")}</p>
          {isEditing && (
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                placeholder={t("fields.name.placeholder")}
              />
              <input
                type="text"
                name="address"
                value={editedData.address}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                placeholder={t("fields.address.placeholder")}
              />
              <textarea
                name="description"
                value={editedData.description}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-md border focus:ring-2 focus:ring-red-800"
                rows={5}
                placeholder={t("fields.description.placeholder")}
              />
              <div
                className="relative cursor-pointer"
                onDrop={(e) => handleImageChange(e.dataTransfer.files[0])}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={imagePreview || "/placeholder-workshop.jpg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEditing(true)}
              className="mt-4 text-red-800 hover:underline"
            >
              {t("buttons.addWorkshop")}
            </motion.button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600"
          >
            <X className="h-4 w-4" />
            {t("buttons.cancel")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
          >
            <Save className="h-4 w-4" />
            {t("buttons.save")}
          </motion.button>
        </div>
      )}
    </div>
  );
};

function PaymentsContent() {
  const t = useTranslations("profile.paymentsContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-8 text-center text-gray-500">
        <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("placeholder")}</p>
        <h4><strong>Ushbu funksiya tez orada ishga tushadi</strong></h4>
      </div>
    </div>
  );
}

function StatisticsContent() {
  const t = useTranslations("profile.statisticsContent");
  return (
    <div className="space-y-6">
      <StatsComponent />
    </div>
  );
}

function OrdersContent() {
  const t = useTranslations("profile.ordersContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-8 text-center text-gray-500">
        <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("placeholder")}</p>
        <h4><strong>Ushbu funksiya tez orada ishga tushadi</strong></h4>
      </div>
    </div>
  );
}

function LogoutContent({ onLogout }: { onLogout: () => void }) {
  const t = useTranslations("profile.logoutContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-8 text-center text-gray-500">
        <LogOut className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("prompt")}</p>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}