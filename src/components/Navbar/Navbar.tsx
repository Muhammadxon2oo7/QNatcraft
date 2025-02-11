"use client"
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // Shadcn ikonasi

export default function Navbar() {
  return (
    <nav className="primary-bg flex h-[56px] items-center ">
      <div className="container h-[100%] flex items-center   text-white font-medium">
        <Link href="#aboutus" className="mr-[47px]" >Biz haqimizda</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#madaniymeros" className="mx-[47px]">Madaniy me'ros</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#Hunarmandchilikturlari" className="mx-[47px]">Hunarmandchilik turlari</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#Hunarmandlar" className="mx-[47px]">Hunarmandlar</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="/" className="mx-[47px]">Ko'rgazmalar 360</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="/" className="flex items-center space-x-1 ml-[47px]">
          <ShoppingBag size={18} /> <span>Do'kon</span>
        </Link>
      </div>
    </nav>
  );
}
