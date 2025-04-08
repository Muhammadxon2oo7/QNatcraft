// app/workshops/[id]/page.tsx
import { HomeIcon, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Key, Suspense } from "react";
import VirtualTourCard from "@/components/Virtual/VirtualTourCard";

// Yangi Craft interfeysi
interface Craft {
  id: number;
  name: string;
  description: string;
  img: string;
  address: string;
  average_rating: number;
  images_360: { id: number; image_360: string }[]; // images_360 strukturasini yangilash
}

async function getCraft(id: string) {
  try {
    const response = await fetch(`https://qqrnatcraft.uz/workshop/workshops/${id}/`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching craft:", error);
    return null;
  }
}

export default async function CraftDetail({ params }: { params: { id: string } }) {
  const craft = await getCraft(params.id);

  if (!craft) return <div className="text-center py-12">Workshop topilmadi</div>;

  const dummyRating = craft.average_rating || 4.5;
  const dummyReviews = 100;
  const dummyCraftsmen = ["Usta 1", "Usta 2"];
  const dummyCategory = "San'at";
  const virtualTours = craft.images_360?.length > 0 ? craft.images_360 : [];

  return (
    <main className="max-w-[1380px] px-[10px] mx-auto py-[16px] min-h-screen">
      <header className="flex items-center border-b pb-[16px] mb-[15px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-800 rounded-full flex items-center justify-center">
            <HomeIcon className="text-white" size={14} aria-hidden="true" />
          </div>
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Bosh sahifa
            </Link>{" "}
            /{" "}
            <Link href="/workshops" className="hover:underline">
              Korgazmalar 360°
            </Link>{" "}
            / <span className="text-black">{craft.name}</span>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="relative w-full aspect-video mx-auto mb-8 rounded-lg overflow-hidden">
          <Image
            src={craft.img}
            alt={craft.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 100%) 100vw, 100%"
            placeholder="blur"
            blurDataURL="/placeholder.svg"
          />
          <Link href="/xprofile">
            <button className="absolute top-4 right-4 flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
              <span>Profilga o'tish</span>
            </button>
          </Link>
        </div>

        <div className="w-full mx-auto pb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-1 bg-red-100 text-red-800 font-medium text-sm rounded-full">
              • {dummyCategory}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-6">
            {craft.name} haqida batafsil ma'lumotlar
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(dummyRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {dummyRating} ({dummyReviews} ta baho)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{craft.address}</span>
          </div>

          <div className="prose max-w-none mb-8 text-gray-700">
            <p>{craft.description}</p>
          </div>

          {/* Virtual ko'rgazmalar */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Virtual ko'rgazmalar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {virtualTours.map((tour: { id: Key | null | undefined; image_360: string; }) => (
                <VirtualTourCard key={tour.id} tour={tour.image_360} />
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="flex items-center gap-2 px-5 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
              <span>Koproq ko'rish</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}