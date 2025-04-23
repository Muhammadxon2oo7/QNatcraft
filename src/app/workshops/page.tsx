// app/workshops/page.tsx
import { HomeIcon } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import CraftCardList from "@/components/workshop/CraftCardList";

interface Craft {
  id: number;
  name: string;
  description: string;
  img: string;
  address: string;
  average_rating: number;
}

async function getWorkshops() {
  try {
    const response = await fetch("https://qqrnatcraft.uz/workshop/workshops/", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return {
      crafts: data,
      total: data.length,
    };
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return { crafts: [], total: 0 };
  }
}

export default async function Workshops() {
  const { crafts, total } = await getWorkshops();
  const limit = 9;
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
        Biz bilan san’at olamiga virtual sayohat qiling!
      </h1>

      {/* Craft Kartalari */}
      <Suspense fallback={<div className="text-center">Yuklanmoqda...</div>}>
        {crafts.length > 0 ? (
          <CraftCardList crafts={crafts} />
        ) : (
          <div className="text-center text-gray-500 py-12">
            Hech qanday workshop topilmadi.
          </div>
        )}
      </Suspense>
    </main>
  );
}