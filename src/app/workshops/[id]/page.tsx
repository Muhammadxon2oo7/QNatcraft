"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Panorama from "@/components/Panorama/Panorama";
import { workshops } from "../data"; // <-- data.ts dan import qilamiz

const WorkshopDetailPage = () => {
  const { id } = useParams();
  const workshop = workshops.find((w) => w.id === Number(id)); // ID bo‘yicha ma’lumot topish

  if (!workshop) {
    return <p className="text-center text-red-500 text-lg">Usta topilmadi!</p>;
  }

  return (
  <section className="">
  <div className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold">{workshop.title}</h1>

      <div className="mt-6 flex justify-center">
        <div className="relative w-full max-w-4xl h-96">
          <Image
            src={workshop.image}
            alt={workshop.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white font-bold">360° virtual sayohat qilish uchun bosing</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">HAQIDA</h2>
        <p className="mt-4 text-gray-700">{workshop.description}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Virtual sayohat</h2>
        <div className="mt-4 w-full max-w-4xl h-96 shadow-lg rounded-lg overflow-hidden">
          <Panorama image={workshop.panorama} />
        </div>
      </div>
    </div>
  </section>
  );
};

export default WorkshopDetailPage;
