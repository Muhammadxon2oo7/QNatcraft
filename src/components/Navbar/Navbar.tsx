"use client";

import Link from "next/link";
import { ShoppingBag, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const t = useTranslations("header");
  const router = useRouter();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId) as HTMLElement | null;
    const header = document.querySelector("header") as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 156;
    const extraOffset = 20;

    if (target) {
      window.scrollTo({
        top: target.offsetTop - (headerHeight + extraOffset),
        behavior: "smooth",
      });
    } else {
      router.push(`/#${targetId.replace("#", "")}`);
    }
  };

  return (
    <nav className="primary-bg w-full flex h-[56px] items-center">
      <div className="container md:justify-start text-white font-medium gap-4 md:gap-6 lg:gap-[47px] h-full w-full flex items-center justify-center">
        <Link href="/#aboutus" className="nav-link" onClick={(e) => handleSmoothScroll(e, "#aboutus")}>
          {t("first")}
        </Link>
        <span className="separator">|</span>

        <Link href="/#madaniymeros" className="nav-link" onClick={(e) => handleSmoothScroll(e, "#madaniymeros")}>
          {t("second")}
        </Link>
        <span className="separator">|</span>

        <Link href="/#Hunarmandchilikturlari" className="nav-link" onClick={(e) => handleSmoothScroll(e, "#Hunarmandchilikturlari")}>
          {t("third")}
        </Link>
        <span className="separator">|</span>

        <Link href="/Crafters" className="nav-link">{t("fourth")}</Link>
        <span className="separator">|</span>

        <Link href="/workshops" className="nav-link">{t("fifth")}</Link>
        <span className="separator">|</span>

        <Link href="/store" className="flex items-center space-x-1 nav-link">
          <ShoppingBag size={18} /> <span>{t("sixth")}</span>
        </Link>

        {/* ✅ Install App button faqat available bo'lganda chiqadi */}
        {canInstall && (
          <>
            <span className="separator">|</span>
            <button
              onClick={handleInstall}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-sm transition"
            >
              <Download size={16} />
              Install App
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
