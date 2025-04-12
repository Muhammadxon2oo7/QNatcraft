"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Edit, Trash2, Plus, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "../../../../context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";


const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

const getMediaUrl = (mediaPath: string | undefined, type: "image") => {
  if (!mediaPath) return PLACEHOLDER_IMAGE;
  return mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`;
};

const SafeImage = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isValidUrl(imageSrc) || hasError) {
    return (
      <img
        src={PLACEHOLDER_IMAGE}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
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
  userAddress?: string;
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
  onClose: () => void;
}) => {
  const  t  = useTranslations ("productcontent");
  const [formData, setFormData] = useState<FormData>(initialData);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData.product_images?.map((img) => getMediaUrl(img.image, "image")) || []
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const discountInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (nameInputRef.current && document.activeElement === nameInputRef.current) {
      nameInputRef.current.focus();
    }
    if (priceInputRef.current && document.activeElement === priceInputRef.current) {
      priceInputRef.current.focus();
    }
    if (categorySelectRef.current && document.activeElement === categorySelectRef.current) {
      categorySelectRef.current.focus();
    }
    if (addressInputRef.current && document.activeElement === addressInputRef.current) {
      addressInputRef.current.focus();
    }
    if (discountInputRef.current && document.activeElement === discountInputRef.current) {
      discountInputRef.current.focus();
    }
    if (descriptionInputRef.current && document.activeElement === descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
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

  const handleAddressSelect = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setShowAddressOptions(false);
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
      const previews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImages(false);
    const newImages = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages((prev) => [...prev, ...newImages]);
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
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

  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      setDraggedIndex(index);
      e.dataTransfer.setData("text/plain", index.toString());
    },
    []
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    },
    []
  );

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

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const handle3DModelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, threed_model: e.target.files ? e.target.files[0] : null }));
  }, []);

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
    if (isNaN(num)) return "";
    return num.toLocaleString("uz-UZ") + " so'm";
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, price: rawValue }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        if (!formData.name.trim()) throw new Error(t("form.errors.name"));
        if (!formData.description.trim()) throw new Error(t("form.errors.description"));
        if (!formData.price || isNaN(parseFloat(formData.price))) throw new Error(t("form.errors.price"));
        if (!formData.address.trim()) throw new Error(t("form.errors.address"));
        if (formData.category === null || formData.category === undefined || isNaN(formData.category)) {
          throw new Error(t("form.errors.category"));
        }
        if (images.length === 0 && !isEdit) throw new Error(t("form.errors.images"));

        await onSubmit(formData, images);
        onClose();
      } catch (err: any) {
        setError(err.message);
        toast.error(`${t("error")}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [formData, images, isEdit, onSubmit, onClose, t]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <motion.div className="rounded-lg shadow-xl w-full max-w-4xl p-6 bg-white text-gray-900">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEdit ? t("form.editTitle") : t("form.addTitle")}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t("form.name")}</label>
                <motion.input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masalan: Qo’l mehnat bilan ishlangan sopol choynak..."
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.address")}</label>
                <div className="relative">
                  <motion.input
                    ref={addressInputRef}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onFocus={() => setShowAddressOptions(true)}
                    onBlur={() => setTimeout(() => setShowAddressOptions(false), 200)}
                    placeholder="Masalan: Toshkent sh., Chilanzar tumani..."
                    className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                    required
                    autoComplete="off"
                    whileFocus={{ scale: 1.02 }}
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
                  ref={priceInputRef}
                  type="text"
                  name="price"
                  value={formData.price ? formatPrice(formData.price) : ""}
                  onChange={handlePriceChange}
                  placeholder="525 000 so'm"
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.category")}</label>
                <motion.select
                  ref={categorySelectRef}
                  name="category"
                  value={formData.category ?? ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                  required
                  whileFocus={{ scale: 1.02 }}
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
                  ref={discountInputRef}
                  type="number"
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  placeholder="0 %"
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                  step="0.01"
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
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
                    isDraggingImages ? "border-prtext-primary bg-primary" : "border-gray-300"
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
                          className={cn(
                            "relative",
                            draggedIndex === index ? "opacity-50" : "opacity-100"
                          )}
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
                            className="absolute top-0 right-0 bg-prtext-primary text-white rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      {t("form.imageDropText")}{" "}
                      <label htmlFor="images" className="text-primary cursor-pointer">
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
                <button
                  type="button"
                  onClick={() => document.getElementById("images")?.click()}
                  className="mt-2 bg-primary text-white py-1 px-3 rounded-md hover:bg-primary flex items-center gap-2"
                >
                  <Plus size={16} />
                  {t("form.addImageButton")}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium">{t("form.threedModel")}</label>
                <motion.div
                  onDrop={handleDrop3DModel}
                  onDragOver={handleDragOver3DModel}
                  onDragLeave={handleDragLeave3DModel}
                  className={cn(
                    "mt-1 border-2 border-dashed rounded-md p-4 text-center",
                    isDragging ? "border-prtext-primary bg-primary" : "border-gray-300"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {formData.threed_model ? (
                    <p className="text-gray-600">{t("form.fileLabel")}: {formData.threed_model.name}</p>
                  ) : (
                    <p className="text-gray-500">
                      {t("form.threedModelDropText")}{" "}
                      <label htmlFor="threed_model" className="text-primary cursor-pointer">
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
              <div className="relative">
                <label className="block text-sm font-medium">{t("form.description")}</label>
                <motion.textarea
                  ref={descriptionInputRef}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("form.descriptionPlaceholder")}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-prtext-primary bg-white text-gray-900 border-gray-300"
                  rows={3}
                  required
                  autoComplete="off"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              {error && <p className="text-primary text-sm">{t("error")}: {error}</p>}
              <div className="flex justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t("form.cancel")}
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary disabled:bg-gray-400 transition-colors"
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
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-3xl max-h-[80vh]"
          >
            <SafeImage
              src={imagePreviews[zoomedImageIndex]}
              alt={`Zoomed ${zoomedImageIndex}`}
              width={800}
              height={600}
              className="rounded object-contain"
            />
            <button
              onClick={() => setZoomedImageIndex(null)}
              className="absolute top-2 right-2 bg-prtext-primary text-white rounded-full p-2"
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
  const  t  = useTranslations("productcontent");
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
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch("https://qqrnatcraft.uz/api/categories/", {
          method: "GET",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error(t("errorCategories") + `: ${response.status}`);
        const data = await response.json();
        setCategories(data || []);
      } catch (err: any) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [getToken, t]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch("https://qqrnatcraft.uz/api/products/my_products/", {
          method: "GET",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error(t("errorProducts") + `: ${response.status}`);
        const data = await response.json();
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, getToken, t]);

  const handleDelete = useCallback(async (productId: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        const token = getToken();
        const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/`, {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error(t("errorDelete"));
        setProducts(products.filter((p) => p.id !== productId));
        toast.success(t("successDelete"));
        const totalItemsAfterDelete = products.length - 1;
        const totalPagesAfterDelete = Math.ceil(totalItemsAfterDelete / itemsPerPage);
        if (currentPage > totalPagesAfterDelete && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(t("errorDelete"));
      }
    }
  }, [products, currentPage, getToken, t]);

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
      const token = getToken();
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", parseFloat(formData.price).toFixed(2));
      data.append("address", formData.address.trim());
      data.append("category", String(formData.category));
      if (formData.discount) data.append("discount", parseFloat(formData.discount).toFixed(2));
      if (formData.threed_model) data.append("threed_model", formData.threed_model);
      images.forEach((image) => data.append("images", image));

      const url = selectedProduct
        ? `https://qqrnatcraft.uz/api/products/${selectedProduct.id}/`
        : "https://qqrnatcraft.uz/api/products/";
      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: data,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${t("errorServer")}: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      if (selectedProduct) {
        setProducts(products.map((p) => (p.id === selectedProduct.id ? result : p)));
        toast.success(t("successEdit"));
      } else {
        setProducts([...products, result]);
        toast.success(t("successAdd"));
        const totalItemsAfterAdd = products.length + 1;
        const totalPagesAfterAdd = Math.ceil(totalItemsAfterAdd / itemsPerPage);
        setCurrentPage(totalPagesAfterAdd);
      }
    },
    [selectedProduct, products, getToken, t]
  );

  const handleClose = useCallback(() => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedProduct(null);
  }, []);

  const initialFormData = selectedProduct
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
        address: "",
        category: null,
        threed_model: null,
        discount: null,
        product_images: [],
      };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return <div className="text-center p-8">{t("loading")}</div>;
  if (error) return <div className="text-center p-8 text-primary">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-prtext-primary"
              autoComplete="off"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <button
            onClick={handleAdd}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            {t("addButton")}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <SafeImage
                src={getMediaUrl(product.product_images[0]?.image, "image")}
                alt={product.name}
                width={100}
                height={100}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500">{product.category.name}</p>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description.substring(0, 100)}...</p>
                <p className="text-primary font-bold">₮{product.price} so'm</p>
                {product.discount && (
                  <p className="text-gray-500 line-through">₮{product.discount} so'm</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-primary hover:text-primary"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">{t("noProducts")}</div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "px-3 py-1 rounded-md transition-colors",
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
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