// "use client"
// import Link from "next/link";
// import { ShoppingBag } from "lucide-react"; // Shadcn ikonasi
// import { useTranslations } from "next-intl";

// export default function Navbar() {
//   const t=useTranslations("header")
//   return (
//     <nav className="primary-bg w-full flex h-[56px] items-center media">
//      <div className="container  md:justify-start text-white font-medium gap-4 md:gap-6 lg:gap-[47px] h-full w-full flex  items-center justify-center">
//   <Link href="#aboutus">{t("first")}</Link>
//   <span className="hidden md:inline text-white text-opacity-20">|</span>
//   <Link href="#madaniymeros">{t("second")}</Link>
//   <span className="hidden md:inline text-white text-opacity-20">|</span>
//   <Link href="#Hunarmandchilikturlari">{t("third")}</Link>
//   <span className="hidden md:inline text-white text-opacity-20">|</span>
//   <Link href="#Hunarmandlar">{t("fourth")}</Link>
//   <span className="hidden md:inline text-white text-opacity-20">|</span>
//   <Link href="/">{t("fifth")}</Link>
//   <span className="hidden md:inline text-white text-opacity-20">|</span>
//   <Link href="/" className="flex items-center space-x-1">
//     <ShoppingBag size={18} /> <span>{t("sixth")}</span>
//   </Link>
// </div>

//     </nav>
//   );
// }

"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // Shadcn ikonasi
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("header");

  return (
    <nav className="primary-bg w-full flex h-[56px] items-center">
      <div className="container md:justify-start text-white font-medium gap-4 md:gap-6 lg:gap-[47px] h-full w-full flex items-center justify-center">
        <Link href="#aboutus" className="text-sm md:text-base lg:text-lg">{t("first")}</Link>
        <span className="hidden md:inline text-white text-opacity-20">|</span>
        <Link href="#madaniymeros" className="text-sm md:text-base lg:text-lg">{t("second")}</Link>
        <span className="hidden md:inline text-white text-opacity-20">|</span>
        <Link href="#Hunarmandchilikturlari" className="text-sm md:text-base lg:text-lg">{t("third")}</Link>
        <span className="hidden md:inline text-white text-opacity-20">|</span>
        <Link href="#Hunarmandlar" className="text-sm md:text-base lg:text-lg">{t("fourth")}</Link>
        <span className="hidden md:inline text-white text-opacity-20">|</span>
        <Link href="/" className="text-sm md:text-base lg:text-lg">{t("fifth")}</Link>
        <span className="hidden md:inline text-white text-opacity-20">|</span>
        <Link href="/" className="flex items-center space-x-1 text-sm md:text-base lg:text-lg">
          <ShoppingBag size={18} /> <span>{t("sixth")}</span>
        </Link>
      </div>
    </nav>
  );
}
