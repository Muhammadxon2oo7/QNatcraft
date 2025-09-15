// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { useTranslations } from "next-intl";
// import { MapPin, Star, Upload, Edit, Save, X, Plus } from "lucide-react";
// import fetchWrapperClient from "@/services/fetchWrapperClient";
// import VirtualTourCard from "@/components/Virtual/VirtualTourCard";

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

// interface WorkshopContentProps {
//   userData: { user_id: number | string } | null;
// }

// export default function WorkshopContent({ userData }: WorkshopContentProps) {
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
//     setEditedData({
//       id: workshop?.id || "",
//       name: workshop?.name || "",
//       description: workshop?.description || "",
//       img: workshop?.img || null,
//       address: workshop?.address || "",
//       images_360: workshop?.images_360 || [],
//       rating: workshop?.rating || 0,
//       reviews: workshop?.reviews || 0,
//     });
//     setVirtualTours(
//       (workshop?.images_360 || []).map((item) => ({
//         id: item.id,
//         file: null,
//         preview: item.image_360,
//       }))
//     );
//     setError("");
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
// }

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Star, Upload, Edit, Save, X, Plus } from "lucide-react";
import fetchWrapperClient from "@/services/fetchWrapperClient";
import VirtualTourCard from "@/components/Virtual/VirtualTourCard";

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

interface WorkshopContentProps {
  userData: { user_id: number | string } | null;
}

export default function WorkshopContent({ userData }: WorkshopContentProps) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              <div className="flex items-center gap-2 flex-wrap">
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
                <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
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
                  <span className="text-gray-600 break-all">{workshop.address}</span>
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
              <p className="text-gray-600 whitespace-pre-wrap">{workshop.description}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{t("virtualTours.title")}</h3>
            {isEditing ? (
              <div className="space-y-2">
                {virtualTours.map((tour, index) => (
                  <div key={index} className="flex items-center gap-2 flex-wrap">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(workshop?.images_360 || []).length > 0 ? (
                  workshop.images_360?.map((tour) => (
                    <VirtualTourCard key={tour.id} tour={tour.image_360} />
                  ))
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-md p-4 text-center col-span-full">
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
        <div className="flex justify-end gap-4 flex-wrap">
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
}