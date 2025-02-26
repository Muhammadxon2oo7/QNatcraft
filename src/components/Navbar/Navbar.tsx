"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; 
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("header");

  return (
    <nav className="primary-bg w-full flex h-[56px] items-center">
      <div className="container md:justify-start text-white font-medium gap-4 md:gap-6 lg:gap-[47px] h-full w-full flex items-center justify-center">
        <Link href="/#aboutus" className="nav-link">{t("first")}</Link>
        <span className="separator">|</span>

        <Link href="/#madaniymeros" className="nav-link">{t("second")}</Link>
        <span className="separator">|</span>

        <Link href="/#Hunarmandchilikturlari" className="nav-link">{t("third")}</Link>
        <span className="separator">|</span>

        <Link href="/#Hunarmandlar" className="nav-link">{t("fourth")}</Link>
        <span className="separator">|</span>

        <Link href="/workshops" className="nav-link">{t("fifth")}</Link>
        <span className="separator">|</span>

        <Link href="/store" className="flex items-center space-x-1 nav-link">
          <ShoppingBag size={18} /> <span>{t("sixth")}</span>
        </Link>
      </div>
    </nav>
  );
}
