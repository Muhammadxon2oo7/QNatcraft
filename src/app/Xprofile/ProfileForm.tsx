// import { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useTranslations } from "next-intl";
// import { cn } from "@/lib/utils";
// import { User, Mail, Phone, Pin, Briefcase, Upload, Edit, Save, X } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import fetchWrapperClient from "@/services/fetchWrapperClient";
// import { useAuth } from "../../../context/auth-context";
// import { CartIcon } from "../../../public/img/header/CartIcon";

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
//   profession?: number | null;
//   bio?: string | null;
//   latitude?: number | null;
//   longitude?: number | null;
//   award?: string | null;
//   created_at?: string;
//   updated_at?: string;
//   user?: number | string;
//   is_verified: boolean;
// }

// interface ProfileFormProps {
//   userData: { email: string; profile: ProfileData; user_id: number | string };
//   isVerified: boolean;
// }

// export default function ProfileForm({ userData, isVerified }: ProfileFormProps) {
//   const t = useTranslations("profile.profileContent");
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [profileData, setProfileData] = useState<ProfileData | undefined>(userData?.profile);
//   const [editedData, setEditedData] = useState({
//     user_first_name: userData?.profile.user_first_name || "",
//     phone_number: userData?.profile.phone_number || "",
//     address: userData?.profile.address || "",
//     experience: String(userData?.profile.experience || ""),
//     mentees: String(userData?.profile.mentees || ""),
//     bio: userData?.profile.bio || "",
//     profession: String(userData?.profile.profession || ""),
//   });
//   const [inputErrors, setInputErrors] = useState({
//     user_first_name: "",
//     phone_number: "",
//     experience: "",
//     mentees: "",
//     bio: "",
//     profession: "",
//   });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [professions, setProfessions] = useState<Profession[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { refreshUser, getToken } = useAuth();
//   const token = getToken();

//   useEffect(() => {
//     if (isVerified) {
//       const fetchProfessions = async () => {
//         try {
//           if (!token) {
//             setError(t("messages.authRequired"));
//             return;
//           }
//           const data = await fetchWrapperClient<Profession[]>("/accounts/professions/", {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setProfessions(Array.isArray(data) ? data : []);
//         } catch (error: any) {
//           setError(t("messages.professionsFetchError"));
//           console.error("Failed to fetch professions:", error);
//         }
//       };
//       fetchProfessions();
//     }
//   }, [token, t, isVerified]);

//   const validateInput = (name: string, value: string) => {
//     switch (name) {
//       case "user_first_name":
//         return /^[A-Za-z\s]+$/.test(value) || value === "" ? "" : t("fields.user_first_name.errors.second");
//       case "phone_number":
//         return /^\+998[0-9]{9}$/.test(value) || value === "" ? "" : t("fields.phone_number.errors.second");
//       case "experience":
//         return /^[0-9]+$/.test(value) || value === "" ? "" : t("fields.experience.errors.second");
//       case "mentees":
//         return /^[0-9]+$/.test(value) || value === "" ? "" : t("fields.mentees.errors.second");
//       case "bio":
//         return value.length <= 3500 ? "" : t("fields.bio.errors.length");
//       case "profession":
//         return value ? "" : t("fields.profession.errors.required");
//       default:
//         return "";
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//     setInputErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setEditedData((prev) => ({ ...prev, [name]: value }));
//     setInputErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     if (!isEditing) return;
//     handleImageChange(e.dataTransfer.files[0]);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (isEditing) setIsDragging(true);
//   };

//   const handleDragLeave = () => setIsDragging(false);

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     handleImageChange(e.target.files?.[0]);
//   };

//   const handleImageChange = (file?: File) => {
//     if (!file) return;
//     if (file.size > 10 * 1024 * 1024) {
//       setError(t("image.errors.size"));
//       return;
//     }
//     if (!file.type.startsWith("image/")) {
//       setError(t("image.errors.type"));
//       return;
//     }
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedData({
//       user_first_name: profileData?.user_first_name || "",
//       phone_number: profileData?.phone_number || "",
//       address: profileData?.address || "",
//       experience: String(profileData?.experience || ""),
//       mentees: String(profileData?.mentees || ""),
//       bio: profileData?.bio || "",
//       profession: String(profileData?.profession || ""),
//     });
//     setInputErrors({
//       user_first_name: "",
//       phone_number: "",
//       experience: "",
//       mentees: "",
//       bio: "",
//       profession: "",
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setError("");
//   };

//   const handleSave = async () => {
//     setError("");
//     setSuccessMessage("");
//     if (Object.values(inputErrors).some((err) => err !== "")) {
//       setError(t("messages.validationError"));
//       return;
//     }

//     try {
//       if (!userData?.profile.id) throw new Error("Profil ID topilmadi");

//       const formData = new FormData();
//       Object.entries(editedData).forEach(([key, value]) => {
//         if (key === "experience" || key === "mentees") {
//           formData.append(key, value ? String(Number(value)) : "");
//         } else if (key === "profession" && value) {
//           formData.append(key, value);
//         } else if (value) {
//           formData.append(key, value);
//         }
//       });
//       if (imageFile) {
//         formData.append("profile_image", imageFile);
//         setIsUploading(true);
//       }

//       const updatedProfile = await fetchWrapperClient<ProfileData>(
//         `/accounts/profiles/${userData.profile.id}/`,
//         { method: "PATCH", body: formData }
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

//   const getProfessionName = (id: number | null | undefined) => {
//     if (!id) return t("unknown");
//     const profession = professions.find((p) => p.id === Number(id));
//     return profession?.name || t("unknown");
//   };

//   const addresses = [
//     "Qo`ng`irot",
//     "Mo`ynoq",
//     "Shumanag",
//     "Taxtako`pir",
//     "Amudaryo",
//     "Nukus",
//     "Xo`jayli",
//     "Taxiatosh",
//     "Beruniy",
//     "Ellik qal`a",
//     "To`rtko`l",
//     "Qorao`zak",
//     "Chimboy",
//     "Bo`zatov",
//     "Kegeyli",
//   ];

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
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileInputChange}
//             className="hidden"
//             accept="image/*"
//           />
//           {isEditing && <p className="text-xs text-gray-500 mt-2">{t("image.upload")}</p>}
//         </div>

//         <div className={cn("flex-1", isVerified ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4")}>
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
//                 <span>{userData.email}</span>
//               </div>
//             </div>

//             {isVerified && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{t("fields.phone_number.label")}</p>
//                 {isEditing ? (
//                   <div>
//                     <input
//                       type="text"
//                       name="phone_number"
//                       value={editedData.phone_number}
//                       onChange={handleInputChange}
//                       className={cn(
//                         "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                         inputErrors.phone_number && "border-red-500"
//                       )}
//                       required
//                     />
//                     {inputErrors.phone_number && (
//                       <p className="text-red-500 text-xs mt-1">{inputErrors.phone_number}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                     <Phone />
//                     <span>{profileData?.phone_number || t("unknown")}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {isVerified && (
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{t("fields.address.label")}</p>
//                 {isEditing ? (
//                   <Select
//                     value={editedData.address}
//                     onValueChange={(value) => handleSelectChange("address", value)}
//                   >
//                     <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
//                       <SelectValue placeholder={t("fields.address.placeholder")} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {addresses.map((address) => (
//                         <SelectItem key={address} value={address}>
//                           {address}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                     <Pin />
//                     <span>{profileData?.address || t("unknown")}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{t("fields.profession.label")}</p>
//                 {isEditing ? (
//                   <div>
//                     <Select
//                       value={editedData.profession}
//                       onValueChange={(value) => handleSelectChange("profession", value)}
//                     >
//                       <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
//                         <SelectValue placeholder={t("fields.profession.placeholder")} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {professions.length > 0 ? (
//                           professions.map((profession) => (
//                             <SelectItem key={profession.id} value={String(profession.id)}>
//                               {profession.name}
//                             </SelectItem>
//                           ))
//                         ) : (
//                           <div className="px-2 py-1 text-gray-500">{t("fields.profession.noData")}</div>
//                         )}
//                       </SelectContent>
//                     </Select>
//                     {inputErrors.profession && (
//                       <p className="text-red-500 text-xs mt-1">{inputErrors.profession}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                     <Briefcase />
//                     <span>{getProfessionName(profileData?.profession)}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{t("fields.experience.label")}</p>
//                 {isEditing ? (
//                   <div>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={editedData.experience}
//                       onChange={handleInputChange}
//                       className={cn(
//                         "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                         inputErrors.experience && "border-red-500"
//                       )}
//                       required
//                     />
//                     {inputErrors.experience && (
//                       <p className="text-red-500 text-xs mt-1">{inputErrors.experience}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                     <CartIcon />
//                     <span>{profileData?.experience || t("unknown")}</span>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <p className="text-sm text-gray-500 mb-1">{t("fields.mentees.label")}</p>
//                 {isEditing ? (
//                   <div>
//                     <input
//                       type="text"
//                       name="mentees"
//                       value={editedData.mentees}
//                       onChange={handleInputChange}
//                       className={cn(
//                         "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                         inputErrors.mentees && "border-red-500"
//                       )}
//                       required
//                     />
//                     {inputErrors.mentees && (
//                       <p className="text-red-500 text-xs mt-1">{inputErrors.mentees}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
//                     <User />
//                     <span>{profileData?.mentees || t("unknown")}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {isVerified && (
//         <div className="space-y-4">
//           <p className="text-sm text-gray-500 mb-1">{t("fields.bio.label")}</p>
//           {isEditing ? (
//             <div>
//               <textarea
//                 name="bio"
//                 value={editedData.bio}
//                 onChange={handleInputChange}
//                 className={cn(
//                   "w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800",
//                   inputErrors.bio && "border-red-500"
//                 )}
//                 rows={5}
//                 placeholder={t("fields.bio.placeholder")}
//               />
//               {inputErrors.bio && <p className="text-red-500 text-xs mt-1">{inputErrors.bio}</p>}
//             </div>
//           ) : (
//             <div className="p-3 bg-gray-50 rounded-md">
//               <p className="text-gray-600">{profileData?.bio || t("fields.bio.placeholder")}</p>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex justify-end mt-8 gap-4">
//         {isEditing ? (
//           <>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               onClick={handleCancel}
//               className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors"
//             >
//               <X className="h-4 w-4" />
//               {t("buttons.cancel")}
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               onClick={handleSave}
//               disabled={isUploading || Object.values(inputErrors).some((err) => err !== "")}
//               className={cn(
//                 "bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors",
//                 isUploading || Object.values(inputErrors).some((err) => err !== "") ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
//               )}
//             >
//               <Save className="h-4 w-4" />
//               {t("buttons.save")}
//             </motion.button>
//           </>
//         ) : (
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             onClick={() => setIsEditing(true)}
//             className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
//           >
//             <Edit className="h-4 w-4" />
//             {t("buttons.edit")}
//           </motion.button>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Pin, Briefcase, Upload, Edit, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import fetchWrapperClient from "@/services/fetchWrapperClient";
import { useAuth } from "../../../context/auth-context";
import { CartIcon } from "../../../public/img/header/CartIcon";

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

interface ProfileFormProps {
  userData: { email: string; profile: ProfileData; user_id: number | string };
  isVerified: boolean;
}

export default function ProfileForm({ userData, isVerified }: ProfileFormProps) {
  const t = useTranslations("profile.profileContent");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    if (isVerified) {
      const fetchProfessions = async () => {
        try {
          if (!token) {
            setError(t("messages.authRequired"));
            return;
          }
          const data = await fetchWrapperClient<Profession[]>("/accounts/professions/", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfessions(Array.isArray(data) ? data : []);
        } catch (error: any) {
          setError(t("messages.professionsFetchError"));
          console.error("Failed to fetch professions:", error);
        }
      };
      fetchProfessions();
    }
  }, [token, t, isVerified]);

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "user_first_name":
        return /^[A-Za-z\s]+$/.test(value) || value === "" ? "" : t("fields.user_first_name.errors.second");
      case "phone_number":
        return /^\+998[0-9]{9}$/.test(value) || value === "" ? "" : t("fields.phone_number.errors.second");
      case "experience":
        return /^[0-9]+$/.test(value) || value === "" ? "" : t("fields.experience.errors.second");
      case "mentees":
        return /^[0-9]+$/.test(value) || value === "" ? "" : t("fields.mentees.errors.second");
      case "bio":
        return value.length <= 3500 ? "" : t("fields.bio.errors.length");
      case "profession":
        return value ? "" : t("fields.profession.errors.required");
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
    setInputErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [name]: value }));
    setInputErrors((prev) => ({ ...prev, [name]: validateInput(name, value) }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isEditing) return;
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isEditing) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files?.[0]);
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
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
    if (Object.values(inputErrors).some((err) => err !== "")) {
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
        { method: "PATCH", body: formData }
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

  const addresses = [
    "Qo`ng`irot",
    "Mo`ynoq",
    "Shumanag",
    "Taxtako`pir",
    "Amudaryo",
    "Nukus",
    "Xo`jayli",
    "Taxiatosh",
    "Beruniy",
    "Ellik qal`a",
    "To`rtko`l",
    "Qorao`zak",
    "Chimboy",
    "Bo`zatov",
    "Kegeyli",
  ];

  return (
    <div className="space-y-6 relative" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <h1 className="text-2xl font-bold mb-6 sm:mb-8">{t("title")}</h1>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {successMessage && <div className="text-green-600 text-center">{successMessage}</div>}
      {isDragging && isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <p className="text-white text-lg">{t("dragDrop")}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="flex-shrink-0 w-full sm:w-auto">
          <div
            className={cn(
              "w-full max-w-[146px] h-[146px] rounded-md border border-gray-300 flex items-center justify-center relative overflow-hidden mx-auto",
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
          {isEditing && <p className="text-xs text-gray-500 mt-2 text-center">{t("image.upload")}</p>}
        </div>

        <div className={cn("flex-1 grid grid-cols-1 gap-6", isVerified ? "sm:grid-cols-2" : "space-y-4")}>
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
                <span className="break-all">{userData.email}</span>
              </div>
            </div>

            {isVerified && (
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
            )}
          </div>

          {isVerified && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t("fields.address.label")}</p>
                {isEditing ? (
                  <Select
                    value={editedData.address}
                    onValueChange={(value) => handleSelectChange("address", value)}
                  >
                    <SelectTrigger className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-800">
                      <SelectValue placeholder={t("fields.address.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address} value={address}>
                          {address}
                        </SelectItem>
                      ))}
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
                        {professions.length > 0 ? (
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
          )}
        </div>
      </div>

      {isVerified && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-1">{t("fields.bio.label")}</p>
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
              <p className="text-gray-600 whitespace-pre-wrap">{profileData?.bio || t("fields.bio.placeholder")}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end mt-8 gap-4 flex-wrap">
        {isEditing ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
              {t("buttons.cancel")}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
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
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="bg-red-800 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-red-900 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {t("buttons.edit")}
          </motion.button>
        )}
      </div>
    </div>
  );
}