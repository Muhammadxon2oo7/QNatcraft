// "use client";

// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTranslations } from "next-intl";
// import { Search, Edit, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { toast } from "sonner";

// import fetchWrapperClient from "@/services/fetchWrapperClient";
// import { useAuth } from "../../../../context/auth-context";

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// const getMediaUrl = (mediaPath: string | undefined) => {
//   if (!mediaPath) return PLACEHOLDER_IMAGE;
//   return mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`;
// };

// interface Category {
//   id: number;
//   name: string;
// }
// const ITEMS_PER_PAGE = 4;

// interface Product {
//   id: number;
//   category: Category;
//   product_images: { id: number; image: string }[];
//   name: string;
//   description: string;
//   price: string;
//   threed_model: string | null;
//   discount: string | null;
//   address: string;
// }

// interface FormData {
//   name: string;
//   description: string;
//   price: string;
//   address: string;
//   category: number | null;
//   threed_model: File | null;
//   discount: string | null;
//   product_images?: { id: number; image: string }[];
// }

// const SafeImage = ({
//   src,
//   alt,
//   width,
//   height,
//   className,
//   onClick,
// }: {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
//   className?: string;
//   onClick?: () => void;
// }) => {
//   const [hasError, setHasError] = useState(false);

//   return (
//     <Image
//       src={hasError ? PLACEHOLDER_IMAGE : getMediaUrl(src)}
//       alt={alt}
//       width={width}
//       height={height}
//       className={className}
//       onClick={onClick}
//       onError={() => setHasError(true)}
//     />
//   );
// };

// const ProductForm = ({
//   isEdit = false,
//   initialData,
//   categories,
//   userAddress,
//   onSubmit,
//   onClose,
// }: {
//   isEdit?: boolean;
//   initialData: FormData;
//   categories: Category[];
//   userAddress?: string | null;
//   onSubmit: (data: FormData, images: File[]) => Promise<void>;
//   onClose: () => void;
// }) => {
//   const t = useTranslations("productcontent");
//   const [formData, setFormData] = useState<FormData>(initialData);
//   const [images, setImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>(
//     initialData.product_images?.map((img) => getMediaUrl(img.image)) || []
//   );
//   const [isDragging, setIsDragging] = useState(false);
//   const [isDraggingImages, setIsDraggingImages] = useState(false);
//   const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [showAddressOptions, setShowAddressOptions] = useState(false);

//   const refs = {
//     name: useRef<HTMLInputElement>(null),
//     price: useRef<HTMLInputElement>(null),
//     category: useRef<HTMLSelectElement>(null),
//     address: useRef<HTMLInputElement>(null),
//     discount: useRef<HTMLInputElement>(null),
//     description: useRef<HTMLTextAreaElement>(null),
//   };

//   useEffect(() => {
//     Object.values(refs).forEach((ref) => {
//       if (ref.current && document.activeElement === ref.current) {
//         ref.current.focus();
//       }
//     });
//   }, [formData]);

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: name === "category" ? (value ? Number(value) : null) : value,
//       }));
//     },
//     []
//   );

//   const handleAddressSelect = (address: string) => {
//     setFormData((prev) => ({ ...prev, address }));
//     setShowAddressOptions(false);
//   };

//   const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newImages = Array.from(e.target.files);
//       setImages((prev) => [...prev, ...newImages]);
//       const previews = newImages.map((file) => URL.createObjectURL(file));
//       setImagePreviews((prev) => [...prev, ...previews]);
//     }
//   }, []);

//   const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDraggingImages(false);
//     const newImages = Array.from(e.dataTransfer.files).filter((file) =>
//       file.type.startsWith("image/")
//     );
//     setImages((prev) => [...prev, ...newImages]);
//     const previews = newImages.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prev) => [...prev, ...previews]);
//   }, []);

//   const handleImageDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDraggingImages(true);
//   }, []);

//   const handleImageDragLeave = useCallback(() => setIsDraggingImages(false), []);

//   const removeImage = useCallback((index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const handleDragStart = useCallback(
//     (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
//       setDraggedIndex(index);
//       e.dataTransfer.setData("text/plain", index.toString());
//     },
//     []
//   );

//   const handleDragOver = useCallback(
//     (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//     },
//     []
//   );

//   const handleDrop = useCallback(
//     (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
//       if (draggedIndex === index) return;

//       const newImages = [...images];
//       const newPreviews = [...imagePreviews];
//       const [draggedImage] = newImages.splice(draggedIndex, 1);
//       const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
//       newImages.splice(index, 0, draggedImage);
//       newPreviews.splice(index, 0, draggedPreview);

//       setImages(newImages);
//       setImagePreviews(newPreviews);
//       setDraggedIndex(null);
//     },
//     [images, imagePreviews]
//   );

//   const handleDragEnd = useCallback(() => {
//     setDraggedIndex(null);
//   }, []);

//   const handle3DModelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, threed_model: e.target.files ? e.target.files[0] : null }));
//   }, []);

//   const handleDrop3DModel = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
//       setFormData((prev) => ({ ...prev, threed_model: file }));
//     } else {
//       toast.error(t("form.errors.invalid3DModel"));
//     }
//   }, [t]);

//   const handleDragOver3DModel = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave3DModel = useCallback(() => setIsDragging(false), []);

//   const formatPrice = useCallback((value: string) => {
//     const num = parseFloat(value.replace(/\D/g, ""));
//     if (isNaN(num)) return "";
//     return num.toLocaleString("uz-UZ") + " so'm";
//   }, []);

//   const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const rawValue = e.target.value.replace(/\D/g, "");
//     setFormData((prev) => ({ ...prev, price: rawValue }));
//   }, []);

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent) => {
//       e.preventDefault();
//       setLoading(true);
//       setError(null);

//       try {
//         if (!formData.name.trim()) throw new Error(t("form.errors.name"));
//         if (!formData.description.trim()) throw new Error(t("form.errors.description"));
//         if (!formData.price || isNaN(parseFloat(formData.price))) throw new Error(t("form.errors.price"));
//         if (!formData.address.trim()) throw new Error(t("form.errors.address"));
//         if (formData.category === null || formData.category === undefined || isNaN(formData.category)) {
//           throw new Error(t("form.errors.category"));
//         }
//         if (images.length === 0 && !isEdit) throw new Error(t("form.errors.images"));

//         await onSubmit(formData, images);
//         onClose();
//       } catch (err: any) {
//         setError(err.message);
//         toast.error(`${t("error")}: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [formData, images, isEdit, onSubmit, onClose, t]
//   );

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
//       >
//         <motion.div className="rounded-lg shadow-xl w-full max-w-4xl p-4 sm:p-6 bg-white text-gray-900">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">
//               {isEdit ? t("form.editTitle") : t("form.addTitle")}
//             </h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <X size={20} />
//             </button>
//           </div>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">{t("form.name")}</label>
//                 <motion.input
//                   ref={refs.name}
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Masalan: Qo’l mehnat bilan ishlangan sopol choynak..."
//                   className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                   required
//                   autoComplete="off"
//                   whileFocus={{ scale: 1.02 }}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">{t("form.address")}</label>
//                 <div className="relative">
//                   <motion.input
//                     ref={refs.address}
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     onFocus={() => setShowAddressOptions(true)}
//                     onBlur={() => setTimeout(() => setShowAddressOptions(false), 200)}
//                     placeholder="Masalan: Toshkent sh., Chilanzar tumani..."
//                     className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                     required
//                     autoComplete="off"
//                     whileFocus={{ scale: 1.02 }}
//                   />
//                   {showAddressOptions && userAddress && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="absolute z-10 mt-1 w-full border rounded-md shadow-lg max-h-40 overflow-y-auto bg-white border-gray-300"
//                     >
//                       <div
//                         onMouseDown={() => handleAddressSelect(userAddress)}
//                         className="p-2 cursor-pointer hover:bg-gray-100 text-gray-900"
//                       >
//                         {userAddress}
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">{t("form.price")}</label>
//                 <motion.input
//                   ref={refs.price}
//                   type="text"
//                   name="price"
//                   value={formData.price ? formatPrice(formData.price) : ""}
//                   onChange={handlePriceChange}
//                   placeholder="525 000 so'm"
//                   className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                   required
//                   autoComplete="off"
//                   whileFocus={{ scale: 1.02 }}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">{t("form.category")}</label>
//                 <motion.select
//                   ref={refs.category}
//                   name="category"
//                   value={formData.category ?? ""}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                   required
//                   whileFocus={{ scale: 1.02 }}
//                 >
//                   <option value="" disabled>
//                     {t("form.categoryPlaceholder")}
//                   </option>
//                   {categories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </motion.select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">{t("form.discount")}</label>
//                 <motion.input
//                   ref={refs.discount}
//                   type="number"
//                   name="discount"
//                   value={formData.discount || ""}
//                   onChange={handleInputChange}
//                   placeholder="0 %"
//                   className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                   step="0.01"
//                   autoComplete="off"
//                   whileFocus={{ scale: 1.02 }}
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium">{t("form.images")}</label>
//                 <motion.div
//                   onDrop={handleImageDrop}
//                   onDragOver={handleImageDragOver}
//                   onDragLeave={handleImageDragLeave}
//                   className={cn(
//                     "mt-1 border-2 border-dashed rounded-md p-4 text-center min-h-[150px] flex items-center justify-center",
//                     isDraggingImages ? "border-prtext-primary bg-primary" : "border-gray-300"
//                   )}
//                   whileHover={{ scale: 1.02 }}
//                 >
//                   {imagePreviews.length > 0 ? (
//                     <div className="flex flex-wrap gap-2 justify-center">
//                       {imagePreviews.map((preview, index) => (
//                         <div
//                           key={index}
//                           draggable
//                           onDragStart={handleDragStart(index)}
//                           onDragOver={handleDragOver(index)}
//                           onDrop={handleDrop(index)}
//                           onDragEnd={handleDragEnd}
//                           className={cn(
//                             "relative w-20 h-20 sm:w-24 sm:h-24",
//                             draggedIndex === index ? "opacity-50" : "opacity-100"
//                           )}
//                         >
//                           <SafeImage
//                             src={preview}
//                             alt={`Preview ${index}`}
//                             width={96}
//                             height={96}
//                             className="rounded object-cover cursor-pointer w-full h-full"
//                             onClick={() => setZoomedImageIndex(index)}
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-prtext-primary text-white rounded-full p-1 text-xs"
//                           >
//                             <X size={12} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-center">
//                       {t("form.imageDropText")} 
//                       <label htmlFor="images" className="text-primary cursor-pointer">
//                         {t("form.imageSelectText")}
//                       </label>
//                     </p>
//                   )}
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleImageChange}
//                     className="hidden"
//                     id="images"
//                     accept="image/*"
//                   />
//                 </motion.div>
//                 <button
//                   type="button"
//                   onClick={() => document.getElementById("images")?.click()}
//                   className="mt-2 bg-primary text-white py-1 px-3 rounded-md hover:bg-primary flex items-center gap-2 mx-auto block"
//                 >
//                   <Plus size={16} />
//                   {t("form.addImageButton")}
//                 </button>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">{t("form.threedModel")}</label>
//                 <motion.div
//                   onDrop={handleDrop3DModel}
//                   onDragOver={handleDragOver3DModel}
//                   onDragLeave={handleDragLeave3DModel}
//                   className={cn(
//                     "mt-1 border-2 border-dashed rounded-md p-4 text-center",
//                     isDragging ? "border-prtext-primary bg-primary" : "border-gray-300"
//                   )}
//                   whileHover={{ scale: 1.02 }}
//                 >
//                   {formData.threed_model ? (
//                     <p className="text-gray-600 break-all">{t("form.fileLabel")}: {formData.threed_model.name}</p>
//                   ) : (
//                     <p className="text-gray-500">
//                       {t("form.threedModelDropText")} 
//                       <label htmlFor="threed_model" className="text-primary cursor-pointer">
//                         {t("form.threedModelSelectText")}
//                       </label>
//                     </p>
//                   )}
//                   <input
//                     type="file"
//                     onChange={handle3DModelChange}
//                     className="hidden"
//                     id="threed_model"
//                     accept=".glb,.gltf"
//                   />
//                 </motion.div>
//               </div>
//             </div>

//             <div className="col-span-1 md:col-span-2 space-y-4">
//               <div className="relative">
//                 <label className="block text-sm font-medium">{t("form.description")}</label>
//                 <motion.textarea
//                   ref={refs.description}
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   placeholder={t("form.descriptionPlaceholder")}
//                   className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
//                   rows={3}
//                   required
//                   autoComplete="off"
//                   whileFocus={{ scale: 1.02 }}
//                 />
//               </div>
//               {error && <p className="text-primary text-sm">{t("error")}: {error}</p>}
//               <div className="flex justify-end gap-2 flex-wrap">
//                 <motion.button
//                   type="button"
//                   onClick={onClose}
//                   className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {t("form.cancel")}
//                 </motion.button>
//                 <motion.button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary disabled:bg-gray-400 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {loading ? t("form.loadingSubmit") : t("form.submit")}
//                 </motion.button>
//               </div>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>

//       {zoomedImageIndex !== null && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
//           onClick={() => setZoomedImageIndex(null)}
//         >
//           <motion.div
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             className="relative w-full max-w-3xl max-h-[80vh]"
//           >
//             <SafeImage
//               src={imagePreviews[zoomedImageIndex]}
//               alt={`Zoomed ${zoomedImageIndex}`}
//               width={800}
//               height={600}
//               className="rounded object-contain w-full h-auto"
//             />
//             <button
//               onClick={() => setZoomedImageIndex(null)}
//               className="absolute top-2 right-2 bg-prtext-primary text-white rounded-full p-2"
//             >
//               <X size={20} />
//             </button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default function ProductsContent() {
//   const t = useTranslations("productcontent");
//   const { user, getToken } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
//       const response = await fetch(`${BASE_URL}/api/categories/`, {
//         method: "GET",
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       if (!response.ok) throw new Error(t("errorCategories") + `: ${response.status}`);
//       const data = await response.json();
//       setCategories(data || []);
//     } catch (err: any) {
//       setError(err.message);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const token = getToken();
//       const response = await fetch(`${BASE_URL}/api/products/my_products/`, {
//         method: "GET",
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//       });
//       if (!response.ok) throw new Error(t("errorProducts") + `: ${response.status}`);
//       const data = await response.json();
//       setProducts(data || []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [getToken, t]);

//   useEffect(() => {
//     fetchProducts();
//   }, [user, getToken, t]);

//   const handleDelete = useCallback(async (productId: number) => {
//     if (window.confirm(t("confirmDelete"))) {
//       try {
//         const token = getToken();
//         const response = await fetch(`${BASE_URL}/api/products/${productId}/`, {
//           method: "DELETE",
//           headers: { Authorization: token ? `Bearer ${token}` : "" },
//         });
//         if (!response.ok) throw new Error(t("errorDelete"));
//         setProducts(products.filter((p) => p.id !== productId));
//         toast.success(t("successDelete"));
//         const totalItemsAfterDelete = products.length - 1;
//         const totalPagesAfterDelete = Math.ceil(totalItemsAfterDelete / ITEMS_PER_PAGE);
//         if (currentPage > totalPagesAfterDelete && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
//       } catch (err: any) {
//         setError(err.message);
//         toast.error(t("errorDelete"));
//       }
//     }
//   }, [products, currentPage, getToken, t]);

//   const handleEdit = useCallback((product: Product) => {
//     setSelectedProduct(product);
//     setShowEditDialog(true);
//   }, []);

//   const handleAdd = useCallback(() => {
//     setSelectedProduct(null);
//     setShowAddDialog(true);
//   }, []);

//   const handleSubmit = useCallback(
//     async (formData: FormData, images: File[]) => {
//       const token = getToken();
//       const data = new FormData();
//       data.append("name", formData.name.trim());
//       data.append("description", formData.description.trim());
//       data.append("price", parseFloat(formData.price).toFixed(2));
//       data.append("address", formData.address.trim());
//       data.append("category", String(formData.category));
//       if (formData.discount) data.append("discount", parseFloat(formData.discount).toFixed(2));
//       if (formData.threed_model) data.append("threed_model", formData.threed_model);
//       images.forEach((image) => data.append("images", image));

//       const url = selectedProduct
//         ? `${BASE_URL}/api/products/${selectedProduct.id}/`
//         : `${BASE_URL}/api/products/`;
//       const method = selectedProduct ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         body: data,
//         headers: {
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`${t("errorServer")}: ${response.status} - ${JSON.stringify(errorData)}`);
//       }

//       const result = await response.json();
//       if (selectedProduct) {
//         setProducts(products.map((p) => (p.id === selectedProduct.id ? result : p)));
//         toast.success(t("successEdit"));
//       } else {
//         setProducts([...products, result]);
//         toast.success(t("successAdd"));
//         const totalItemsAfterAdd = products.length + 1;
//         const totalPagesAfterAdd = Math.ceil(totalItemsAfterAdd / ITEMS_PER_PAGE);
//         setCurrentPage(totalPagesAfterAdd);
//       }
//     },
//     [selectedProduct, products, getToken, t]
//   );

//   const handleClose = useCallback(() => {
//     setShowAddDialog(false);
//     setShowEditDialog(false);
//     setSelectedProduct(null);
//   }, []);

//   const initialFormData = selectedProduct
//     ? {
//         name: selectedProduct.name,
//         description: selectedProduct.description,
//         price: selectedProduct.price,
//         address: selectedProduct.address,
//         category: selectedProduct.category.id,
//         threed_model: null,
//         discount: selectedProduct.discount || "",
//         product_images: selectedProduct.product_images,
//       }
//     : {
//         name: "",
//         description: "",
//         price: "",
//         address: "",
//         category: null,
//         threed_model: null,
//         discount: null,
//         product_images: [],
//       };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   if (loading) return <div className="text-center p-8">{t("loading")}</div>;
//   if (error) return <div className="text-center p-8 text-primary">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <h1 className="text-2xl font-bold">{t("title")}</h1>
//         <div className="flex gap-4 flex-wrap w-full sm:w-auto">
//           <div className="relative flex-1 sm:flex-none">
//             <input
//               type="text"
//               placeholder={t("search")}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-prtext-primary"
//               autoComplete="off"
//             />
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
//           </div>
//           <button
//             onClick={handleAdd}
//             className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary flex items-center gap-2 transition-colors"
//           >
//             <Plus size={16} />
//             {t("addButton")}
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {paginatedProducts.length > 0 ? (
//           paginatedProducts.map((product) => (
//             <div
//               key={product.id}
//               className="border rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
//             >
//               <SafeImage
//                 src={getMediaUrl(product.product_images[0]?.image)}
//                 alt={product.name}
//                 width={100}
//                 height={100}
//                 className="rounded object-cover w-full sm:w-auto"
//               />
//               <div className="flex-1">
//                 <p className="text-sm text-gray-500">{product.category.name}</p>
//                 <h3 className="font-semibold break-words">{product.name}</h3>
//                 <p className="text-gray-600 break-words">{product.description.substring(0, 100)}...</p>
//                 <p className="text-primary font-bold">₮{product.price} so'm</p>
//                 {product.discount && (
//                   <p className="text-gray-500 line-through">₮{product.discount} so'm</p>
//                 )}
//               </div>
//               <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
//                 <button
//                   onClick={() => handleEdit(product)}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   <Edit size={16} />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="text-primary hover:text-primary"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center p-4 text-gray-500">{t("noProducts")}</div>
//         )}
//       </div>

//       {filteredProducts.length > 0 && (
//         <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
//           <button
//             onClick={goToPreviousPage}
//             disabled={currentPage === 1}
//             className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
//           >
//             <ChevronLeft size={20} />
//           </button>

//           <div className="flex gap-1 flex-wrap justify-center">
//             {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => goToPage(page)}
//                 className={cn(
//                   "px-3 py-1 rounded-md transition-colors",
//                   currentPage === page
//                     ? "bg-primary text-white"
//                     : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                 )}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={goToNextPage}
//             disabled={currentPage === totalPages}
//             className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       )}

//       {(showAddDialog || showEditDialog) && (
//         <ProductForm
//           isEdit={showEditDialog}
//           initialData={initialFormData}
//           categories={categories}
//           userAddress={user?.profile?.address}
//           onSubmit={handleSubmit}
//           onClose={handleClose}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, Edit, Trash2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "../../../../context/auth-context";


const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";
const ITEMS_PER_PAGE = 4;

const getMediaUrl = (mediaPath: string | undefined, type: "image" | "3d" = "image") => {
  if (!mediaPath) return PLACEHOLDER_IMAGE;
  // Blob URL bo'lsa, uni to'g'ridan-to'g'ri qaytarish
  if (mediaPath.startsWith("blob:")) return mediaPath;
  // Serverdan kelgan URL bo'lsa
  return mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`;
};

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category: Category;
  product_images: { id: number; image: string }[];
  name: string;
  description: string;
  price: string;
  threed_model: string | null;
  discount: string | null;
  address: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  address: string;
  category: number | null;
  threed_model: File | null;
  discount: string | null;
  product_images?: { id: number; image: string }[];
}

// SafeImage komponenti: next/image o'rniga oddiy <img> ishlatiladi
const SafeImage = ({
  src,
  alt,
  width,
  height,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
}) => {
  const [hasError, setHasError] = useState(false);
  const imageSrc = useMemo(() => getMediaUrl(src), [src]);

  return (
    <img
      src={hasError ? PLACEHOLDER_IMAGE : imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      onError={() => setHasError(true)}
    />
  );
};

const ProductForm = ({
  isEdit = false,
  initialData,
  categories,
  userAddress,
  onSubmit,
  onClose,
}: {
  isEdit?: boolean;
  initialData: FormData;
  categories: Category[];
  userAddress?: string | null;
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
  onClose: () => void;
}) => {
  const t = useTranslations("productcontent");
  const [formData, setFormData] = useState<FormData>(initialData);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData.product_images?.map((img) => getMediaUrl(img.image)) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
    category: useRef<HTMLSelectElement>(null),
    address: useRef<HTMLInputElement>(null),
    discount: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
  };

  useEffect(() => {
    Object.values(refs).forEach((ref) => {
      if (ref.current && document.activeElement === ref.current) {
        ref.current.focus();
      }
    });
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "category" ? (value ? Number(value) : null) : value,
      }));
    },
    []
  );

  const handleAddressSelect = useCallback((address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setShowAddressOptions(false);
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"));
      setImages((prev) => [...prev, ...newImages]);
      setImagePreviews((prev) => [...prev, ...newImages.map((file) => URL.createObjectURL(file))]);
    }
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const newImages = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
    setImages((prev) => [...prev, ...newImages]);
    setImagePreviews((prev) => [...prev, ...newImages.map((file) => URL.createObjectURL(file))]);
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(true);
  }, []);

  const handleImageDragLeave = useCallback(() => setIsDraggingImages(false), []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragStart = useCallback((index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  }, []);

  const handleDragOver = useCallback((index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (draggedIndex === index) return;

      const newImages = [...images];
      const newPreviews = [...imagePreviews];
      const [draggedImage] = newImages.splice(draggedIndex, 1);
      const [draggedPreview] = newPreviews.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      newPreviews.splice(index, 0, draggedPreview);
      setImages(newImages);
      setImagePreviews(newPreviews);
      setDraggedIndex(null);
    },
    [images, imagePreviews]
  );

  const handleDragEnd = useCallback(() => setDraggedIndex(null), []);

  const handle3DModelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setFormData((prev) => ({ ...prev, threed_model: file }));
    } else {
      toast.error(t("form.errors.invalid3DModel"));
    }
  }, [t]);

  const handleDrop3DModel = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
      setFormData((prev) => ({ ...prev, threed_model: file }));
    } else {
      toast.error(t("form.errors.invalid3DModel"));
    }
  }, [t]);

  const handleDragOver3DModel = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave3DModel = useCallback(() => setIsDragging(false), []);

  const formatPrice = useCallback((value: string) => {
    const num = parseFloat(value.replace(/\D/g, ""));
    return isNaN(num) ? "" : `${num.toLocaleString("uz-UZ")} so'm`;
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, price: rawValue }));
  }, []);

  const validateForm = useCallback(
    (data: FormData) => {
      if (!data.name.trim()) return t("form.errors.name");
      if (!data.description.trim()) return t("form.errors.description");
      if (!data.price || isNaN(parseFloat(data.price))) return t("form.errors.price");
      if (!data.address.trim()) return t("form.errors.address");
      if (data.category === null || data.category === undefined) return t("form.errors.category");
      if (images.length === 0 && !isEdit) return t("form.errors.images");
      return null;
    },
    [images, isEdit, t]
  );

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const validationError = validateForm(formData);
      if (validationError) {
        setError(validationError);
        toast.error(`${t("error")}: ${validationError}`);
        setLoading(false);
        return;
      }

      try {
        await onSubmit(formData, images);
        onClose();
      } catch (err: any) {
        setError(err.message);
        toast.error(`${t("error")}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [formData, images, onSubmit, onClose, validateForm, t]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <motion.div className="rounded-lg shadow-xl w-full max-w-4xl p-4 sm:p-6 bg-white text-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{isEdit ? t("form.editTitle") : t("form.addTitle")}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("form.name")}</label>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masalan: Qo‘l mehnat bilan ishlangan sopol choynak..."
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                  ref={refs.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.address")}</label>
                <div className="relative">
                  <motion.input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => setShowAddressOptions(true)}
                    onBlur={() => setTimeout(() => setShowAddressOptions(false), 200)}
                    placeholder="Masalan: Toshkent sh., Chilanzar tumani..."
                    className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                    required
                    autoComplete="off"
                    whileFocus={{ scale: 1.02 }}
                    ref={refs.address}
                  />
                  {showAddressOptions && userAddress && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 mt-1 w-full border rounded-md shadow-lg max-h-40 overflow-y-auto bg-white border-gray-300"
                    >
                      <div
                        onMouseDown={() => handleAddressSelect(userAddress)}
                        className="p-2 cursor-pointer hover:bg-gray-100 text-gray-900"
                      >
                        {userAddress}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.price")}</label>
                <motion.input
                  type="text"
                  name="price"
                  value={formData.price ? formatPrice(formData.price) : ""}
                  onChange={handlePriceChange}
                  placeholder="525 000 so'm"
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                  ref={refs.price}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.category")}</label>
                <motion.select
                  name="category"
                  value={formData.category ?? ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                  required
                  whileFocus={{ scale: 1.02 }}
                  ref={refs.category}
                >
                  <option value="" disabled>
                    {t("form.categoryPlaceholder")}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.discount")}</label>
                <motion.input
                  type="number"
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  placeholder="0 %"
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                  step="0.01"
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                  ref={refs.discount}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("form.images")}</label>
                <motion.div
                  onDrop={handleImageDrop}
                  onDragOver={handleImageDragOver}
                  onDragLeave={handleImageDragLeave}
                  className={cn(
                    "mt-1 border-2 border-dashed rounded-md p-4 text-center min-h-[150px] flex items-center justify-center",
                    isDraggingImages ? "border-red-800 bg-red-50" : "border-gray-300"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={handleDragStart(index)}
                          onDragOver={handleDragOver(index)}
                          onDrop={handleDrop(index)}
                          onDragEnd={handleDragEnd}
                          className={cn("relative", draggedIndex === index ? "opacity-50" : "opacity-100")}
                        >
                          <SafeImage
                            src={preview}
                            alt={`Preview ${index}`}
                            width={80}
                            height={80}
                            className="rounded object-cover cursor-pointer"
                            onClick={() => setZoomedImageIndex(index)}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-800 text-white rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {t("form.imageDropText")}{" "}
                      <label htmlFor="images" className="text-red-800 cursor-pointer">
                        {t("form.imageSelectText")}
                      </label>
                    </p>
                  )}
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="images"
                    accept="image/*"
                  />
                </motion.div>
                <motion.button
                  type="button"
                  onClick={() => document.getElementById("images")?.click()}
                  className="mt-2 bg-red-800 text-white py-1 px-3 rounded-md hover:bg-red-900 flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  {t("form.addImageButton")}
                </motion.button>
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.threedModel")}</label>
                <motion.div
                  onDrop={handleDrop3DModel}
                  onDragOver={handleDragOver3DModel}
                  onDragLeave={handleDragLeave3DModel}
                  className={cn(
                    "mt-1 border-2 border-dashed rounded-md p-4 text-center",
                    isDragging ? "border-red-800 bg-red-50" : "border-gray-300"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {formData.threed_model ? (
                    <p className="text-gray-600">{t("form.fileLabel")}: {formData.threed_model.name}</p>
                  ) : (
                    <p className="text-gray-500">
                      {t("form.threedModelDropText")}{" "}
                      <label htmlFor="threed_model" className="text-red-800 cursor-pointer">
                        {t("form.threedModelSelectText")}
                      </label>
                    </p>
                  )}
                  <input
                    type="file"
                    onChange={handle3DModelChange}
                    className="hidden"
                    id="threed_model"
                    accept=".glb,.gltf"
                  />
                </motion.div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("form.description")}</label>
                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("form.descriptionPlaceholder")}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-800 bg-white text-gray-900 border-gray-300"
                  rows={3}
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                  ref={refs.description}
                />
              </div>
              {error && <p className="text-red-800 text-sm">{t("error")}: {error}</p>}
              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("form.cancel")}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "bg-red-800 text-white py-2 px-4 rounded-md",
                    loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-red-900"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? t("form.loadingSubmit") : t("form.submit")}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {zoomedImageIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setZoomedImageIndex(null)}
        >
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative max-w-3xl max-h-[80vh]">
            <SafeImage
              src={imagePreviews[zoomedImageIndex]}
              alt={`Zoomed ${zoomedImageIndex}`}
              width={800}
              height={600}
              className="rounded object-contain"
            />
            <button
              onClick={() => setZoomedImageIndex(null)}
              className="absolute top-2 right-2 bg-red-800 text-white rounded-full p-2"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ProductsContent() {
  const t = useTranslations("productcontent");
  const { user, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const memoizedGetToken = useCallback(() => getToken(), [getToken]);

  const fetchData = useCallback(
    async (url: string, errorKey: string, setData: (data: any) => void) => {
      try {
        setLoading(true);
        const token = memoizedGetToken();
        if (!token) throw new Error(t("errorAuth"));
        const response = await fetch(`https://qqrnatcraft.uz/api${url}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`${t(errorKey)}: ${response.status}`);
        const data = await response.json();
        setData(data || []);
      } catch (err: any) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [memoizedGetToken, t]
  );

  useEffect(() => {
    fetchData("/categories/", "errorCategories", setCategories);
  }, [fetchData]);

  useEffect(() => {
    fetchData("/products/my_products/", "errorProducts", setProducts);
  }, [fetchData, user]);

  const handleDelete = useCallback(
    async (productId: number) => {
      if (!window.confirm(t("confirmDelete"))) return;

      try {
        const token = memoizedGetToken();
        if (!token) throw new Error(t("errorAuth"));
        const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(t("errorDelete"));
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success(t("successDelete"));
        const totalItemsAfterDelete = products.length - 1;
        const totalPagesAfterDelete = Math.ceil(totalItemsAfterDelete / ITEMS_PER_PAGE);
        if (currentPage > totalPagesAfterDelete && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(t("errorDelete"));
      }
    },
    [products, currentPage, memoizedGetToken, t]
  );

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedProduct(null);
    setShowAddDialog(true);
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData, images: File[]) => {
      const token = memoizedGetToken();
      if (!token) throw new Error(t("errorAuth"));

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", parseFloat(formData.price).toFixed(2));
      data.append("address", formData.address.trim());
      data.append("category", String(formData.category));
      if (formData.discount) data.append("discount", parseFloat(formData.discount).toFixed(2));
      if (formData.threed_model) data.append("threed_model", formData.threed_model);
      images.forEach((image) => data.append("images", image));

      const url = selectedProduct ? `/products/${selectedProduct.id}/` : "/products/";
      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(`https://qqrnatcraft.uz/api${url}`, {
        method,
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${t("errorServer")}: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      if (selectedProduct) {
        setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? result : p)));
        toast.success(t("successEdit"));
      } else {
        setProducts((prev) => [...prev, result]);
        toast.success(t("successAdd"));
        const totalItemsAfterAdd = products.length + 1;
        const totalPagesAfterAdd = Math.ceil(totalItemsAfterAdd / ITEMS_PER_PAGE);
        setCurrentPage(totalPagesAfterAdd);
      }
    },
    [selectedProduct, products, memoizedGetToken, t]
  );

  const handleClose = useCallback(() => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedProduct(null);
  }, []);

  const initialFormData = useMemo(
    () =>
      selectedProduct
        ? {
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            address: selectedProduct.address,
            category: selectedProduct.category.id,
            threed_model: null,
            discount: selectedProduct.discount || "",
            product_images: selectedProduct.product_images,
          }
        : {
            name: "",
            description: "",
            price: "",
            address: user?.profile?.address || "",
            category: null,
            threed_model: null,
            discount: null,
            product_images: [],
          },
    [selectedProduct, user]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredProducts, currentPage]
  );

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block h-8 w-8 border-4 border-t-red-800 border-gray-200 rounded-full"
        />
        <p className="mt-2 text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-800">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-red-800 hover:underline">
          {t("buttons.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-4 flex-wrap w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-800"
              autoComplete="off"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <motion.button
            onClick={handleAdd}
            className="bg-red-800 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-red-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            {t("addButton")}
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SafeImage
                src={getMediaUrl(product.product_images[0]?.image)}
                alt={product.name}
                width={100}
                height={100}
                className="rounded object-cover w-full sm:w-[100px]"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500">{product.category.name}</p>
                <h3 className="font-semibold break-words">{product.name}</h3>
                <p className="text-gray-600 break-words">{product.description.substring(0, 100)}...</p>
                <p className="text-red-800 font-bold">₮{product.price} so'm</p>
                {product.discount && <p className="text-gray-500 line-through">₮{product.discount} so'm</p>}
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                <motion.button
                  onClick={() => handleEdit(product)}
                  className="text-blue-500 hover:text-blue-700"
                  whileHover={{ scale: 1.1 }}
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-800 hover:text-red-900"
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">{t("noProducts")}</div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
          <motion.button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  currentPage === page ? "bg-red-800 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      )}

      {(showAddDialog || showEditDialog) && (
        <ProductForm
          isEdit={showEditDialog}
          initialData={initialFormData}
          categories={categories}
          userAddress={user?.profile?.address}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
