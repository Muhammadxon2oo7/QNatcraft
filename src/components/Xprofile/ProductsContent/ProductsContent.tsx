"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "../../../../context/auth-context";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category: Category;
  product_images: { image: string }[];
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
}

export default function ProductsContent() {
  const { user, getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    address: "",
    category: null,
    threed_model: null,
    discount: null,
  });
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch("https://qqrnatcraft.uz/api/categories/", {
          method: "GET",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
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
  }, [getToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch("https://qqrnatcraft.uz/api/products/my_products/", {
          method: "GET",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, getToken]);

  const handleDelete = async (productId: number) => {
    if (window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) {
      try {
        const token = getToken();
        const response = await fetch(`https://qqrnatcraft.uz/api/products/${productId}/`, {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (!response.ok) throw new Error("Mahsulotni o'chirishda xatolik");
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Mahsulot o'chirildi");
      } catch (err: any) {
        setError(err.message);
        toast.error("O'chirishda xatolik");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      address: product.address,
      category: product.category.id,
      threed_model: null,
      discount: product.discount || "",
    });
    setImages([]);
    setShowEditDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: parseInt(e.target.value) || null }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handle3DModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, threed_model: e.target.files ? e.target.files[0] : null }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setFormData((prev) => ({ ...prev, threed_model: file }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Validatsiya
      if (!formData.name.trim()) throw new Error("Nomi maydoni bo'sh bo'lmasligi kerak!");
      if (!formData.description.trim()) throw new Error("Tavsif maydoni bo'sh bo'lmasligi kerak!");
      if (!formData.price || isNaN(parseFloat(formData.price))) throw new Error("Narx to'g'ri kiritilishi kerak!");
      if (!formData.address.trim()) throw new Error("Manzil maydoni bo'sh bo'lmasligi kerak!");
      if (formData.category === null || formData.category === undefined || isNaN(formData.category)) {
        throw new Error("Kategoriya tanlanmagan yoki noto'g'ri!");
      }
  
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
  
      console.log("Yuborilayotgan FormData:");
      for (const pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  
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
        const errorData = await response.json(); // Faqat JSON o‘qiladi
        console.error("Server javobi:", errorData);
        throw new Error(`Server xatosi: ${response.status} - ${JSON.stringify(errorData)}`);
      }
  
      const result = await response.json();
      if (selectedProduct) {
        setProducts(products.map((p) => (p.id === selectedProduct.id ? result : p)));
        setShowEditDialog(false);
        toast.success("Mahsulot yangilandi");
      } else {
        setProducts([...products, result]);
        setShowAddDialog(false);
        toast.success("Mahsulot qo'shildi");
      }
      resetForm();
    } catch (err: any) {
      setError(err.message);
      toast.error(`Xatolik: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      address: "",
      category: null,
      threed_model: null,
      discount: null,
    });
    setImages([]);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center p-8">Yuklanmoqda...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Mening mahsulotlarim</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Mahsulot qo'shish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex items-start gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Image
  src={
    product.product_images[0]?.image.startsWith("http")
      ? product.product_images[0]?.image
      : `https://qqrnatcraft.uz${product.product_images[0]?.image}`
  }
  alt={product.name}
  width={100}
  height={100}
  className="rounded object-cover"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.jpg"; // Agar rasm yuklanmasa, placeholder ko‘rsatish
  }}
/>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{product.category.name}</p>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description.substring(0, 100)}...</p>
              <p className="text-red-600 font-bold">₮{product.price} so'm</p>
              {product.discount && (
                <p className="text-gray-500 line-through">₮{product.discount} so'm</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="text-blue-500 hover:text-blue-700">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Mahsulot qo'shish</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomi *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Narxi (so'm) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manzil *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategoriya *</label>
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chegirma (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">3D Model</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "mt-1 border-2 border-dashed rounded-md p-4 text-center",
                    isDragging ? "border-red-500 bg-red-50" : "border-gray-300"
                  )}
                >
                  {formData.threed_model ? (
                    <p>Fayl: {formData.threed_model.name}</p>
                  ) : (
                    <p>
                      Faylni bu yerga tashlang yoki{" "}
                      <label htmlFor="threed_model" className="text-red-500 cursor-pointer">
                        tanlang
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
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rasmlar</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-gray-700"
                  accept="image/*"
                />
                {images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <span key={index} className="text-sm text-gray-600">
                        {image.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">Xatolik: {error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Yuklanmoqda..." : "Saqlash"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Mahsulotni tahrirlash</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nomi *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tavsif *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Narxi (so'm) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manzil *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategoriya *</label>
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chegirma (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">3D Model</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    "mt-1 border-2 border-dashed rounded-md p-4 text-center",
                    isDragging ? "border-red-500 bg-red-50" : "border-gray-300"
                  )}
                >
                  {formData.threed_model ? (
                    <p>Fayl: {formData.threed_model.name}</p>
                  ) : (
                    <p>
                      Faylni bu yerga tashlang yoki{" "}
                      <label htmlFor="threed_model_edit" className="text-red-500 cursor-pointer">
                        tanlang
                      </label>
                    </p>
                  )}
                  <input
                    type="file"
                    onChange={handle3DModelChange}
                    className="hidden"
                    id="threed_model_edit"
                    accept=".glb,.gltf"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rasmlar</label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-gray-700"
                  accept="image/*"
                />
                {images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <span key={index} className="text-sm text-gray-600">
                        {image.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">Xatolik: {error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Yuklanmoqda..." : "Saqlash"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditDialog(false);
                    resetForm();
                  }}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}