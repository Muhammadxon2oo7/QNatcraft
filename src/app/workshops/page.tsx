"use client"
// app/workshops/page.tsx
import { HomeIcon } from "lucide-react";
import { motion } from "framer-motion";
import CraftCard from "@/components/workshop/CraftCard";
import { Suspense } from "react";
import Link from "next/link";
import { fetchCrafts } from "@/lib/api";

// Craft interfeysi
interface Craft {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
}

// API’dan ma’lumotlarni olish (server tarafida)
async function getCrafts(page: number = 1, limit: number = 9, search: string = "", category: string = "") {
  try {
    const response = await fetchCrafts({ page, limit, search, category });
    return response;
  } catch (error) {
    console.error("Error fetching crafts:", error);
    return { crafts: [], total: 0 };
  }
}

export default async function Workshops({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const limit = 9;

  const { crafts, total } = await getCrafts(page, limit, search, category);
  const totalPages = Math.ceil(total / limit);

  return (
    <main className="container mx-auto px-4 py-[16px] min-h-screen">
      {/* Header */}
      <header className="flex items-center border-b pb-[16px] mb-[15px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center">
            <HomeIcon className="text-white" size={14} aria-hidden="true" />
          </div>
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Bosh sahifa
            </Link>{" "}
            / <span>Korgazmalar 360°</span>
          </nav>
        </div>
      </header>

      {/* Sarlavha */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Biz bilan san’at olamini virtual sayohat qiling!
      </h1>

      {/* Craft Kartalari */}
      <Suspense fallback={<div className="text-center">Yuklanmoqda...</div>}>
        {crafts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            layout
          >
            {crafts.map((craft) => (
              <CraftCard key={craft.id} craft={craft} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Hech qanday craft topilmadi.
          </div>
        )}
      </Suspense>
    </main>
  );
}