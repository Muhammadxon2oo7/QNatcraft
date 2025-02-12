"use client"
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // Shadcn ikonasi
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t=useTranslations("header")
  return (
    <nav className="primary-bg flex h-[56px] items-center ">
      <div className="container h-[100%] flex items-center   text-white font-medium">
        <Link href="#aboutus" className="mr-[47px]" >{t("first")}</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#madaniymeros" className="mx-[47px]">{t("second")}</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#Hunarmandchilikturlari" className="mx-[47px]">{t("third")}</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="#Hunarmandlar" className="mx-[47px]">{t("fourth")}</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="/" className="mx-[47px]">{t("fifth")}</Link>
        <span className="text-white text-opacity-20">|</span>
        <Link href="/" className="flex items-center space-x-1 ml-[47px] ">
          <ShoppingBag size={18} /> <span>{t("sixth")}</span>
        </Link>
      </div>
    </nav>
  );
}
