"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/img/header/Logo.png";
import { Button } from "../ui/button";
import { Search } from "../../../public/img/header/Search";
import { ChatIcon } from "../../../public/img/header/ChatIcon";
import { CartIcon } from "../../../public/img/header/CartIcon";
import { HamburgerIcon } from "../../../public/img/header/HamburgerIcon";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu, LogIn, ShoppingBag, MessageCircle, Heart, LogOut } from "lucide-react";
import AnimatedSearchTransform from "../SearchComponent/animated-search-transform";
import Navbar from "../Navbar/Navbar";
import LocaleSwitcher from "./LocaleSwitcher";
import LocaleSwitcherMobile from "./LocaleSwitcherMobile";
import { useAuth } from "../../../context/auth-context";
import { toast } from "sonner";

interface UserData {
  id: number;
  user_email: string;
  user_first_name: string;
  profession: string | null;
  bio: string | null;
}

export const Header = () => {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, loading, logout } = useAuth();

  const showCartToast = () => {
    toast(t("cart_message") || "Savatcha funksiyasi tez orada ishga tushadi!", {
      style: {
        background: "#f6f6f6",
        color: "#820C0F",
       
        borderRadius: "8px",
      },
      duration: 3000,
    });
  };

  const renderAuthButton = () => {
    if (loading) {
      return <span className="text-gray-500">{t("loading")}</span>;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
          <Button
            className="responsive-btn w-[clamp(140px, 10vw, 180px)] rounded-[16px] bg-[#fadee0]"
          >
            <Image
              src={
                user?.profile?.profile_image
                  ? `https://qqrnatcraft.uz${user.profile.profile_image}`
                  : "/img/user.png"
              }
              alt={user.profile.user_first_name || "User"}
              height={100}
              width={100}
              className="w-[24px] h-[24px] rounded-full"
            />
            <Link href="/Xprofile" className="responsive-text font-medium text-[18px] text-[#820C0F]">
              {user.profile.user_first_name}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-100"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="responsive-btn bg-primary w-[clamp(140px, 10vw, 180px)] rounded-[16px]"
        asChild
      >
        <Link href="/login" className="responsive-text text-white">
          {t("login")}
        </Link>
      </Button>
    );
  };

  const renderMobileAuthButton = () => {
    if (loading) return null;

    if (user) {
      return (
        <div className="flex flex-col gap-2">
          <Button className="w-full text-white" asChild>
            <Link href="/profile">{user.user_first_name}</Link>
          </Button>
          <Button className="w-full bg-red-500 text-white" onClick={logout}>
            {t("logout")}
          </Button>
        </div>
      );
    }

    return (
      <Button className="w-full text-white" asChild>
        <Link href="/login">{t("login")}</Link>
      </Button>
    );
  };

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="w-full flex h-16 items-center justify-between px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <HamburgerIcon />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md p-0">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="text-left text-2xl">{t("menu")}</SheetTitle>
                </SheetHeader>
                <nav className="flex-1">
                  <div className="flex flex-col divide-y">
                    {[
                      { href: "#aboutus", label: t("first") },
                      { href: "#madaniymeros", label: t("second") },
                      { href: "#Hunarmandchilikturlari", label: t("third") },
                      { href: "#", label: t("fourth") },
                      { href: "/korgazmalar", label: t("fifth") },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-4 py-3 flex items-center justify-between hover:bg-muted"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        <span className="text-muted-foreground">›</span>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 p-4 border-t">
                    <button
                      onClick={showCartToast}
                      className="flex items-center gap-3 text-[#242b3a] cursor-not-allowed"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {t("sixth")}
                    </button>
                    <a href="/chat" className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5" />
                      <span>{t("chat") || "Chat"}</span>
                    </a>
                    <Link href="#" className="flex items-center gap-3">
                      <Heart className="h-5 w-5" />
                      {t("favorites") || "Sevimlilar"}
                    </Link>
                    <Link href="#" className="flex items-center gap-3">
                      <Search />
                      {t("search") || "Qidirish"}
                    </Link>
                  </div>
                  <div className="mt-auto p-4 border-t">
                    <LocaleSwitcherMobile />
                    {renderMobileAuthButton()}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="relative w-[140px] h-[40px]">
              <Link href="/">
                <Image src={Logo} alt="logo" fill className="object-contain" />
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            {user ? (
              <Link href="/profile">
                <span className="text-sm font-medium">{user.user_first_name}</span>
              </Link>
            ) : (
              <Link href="/login">
                <LogIn className="h-6 w-6" />
                <span className="sr-only">{t("login")}</span>
              </Link>
            )}
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white min-h-[120px] md:h-[156px] w-full shadow-md z-50">
      <div className="flex flex-wrap max-w-[1380px] mx-auto px-[10px] justify-between items-center">
        <div className="relative w-[140px] md:w-[120px] h-[50px] md:h-[45px]">
          <Link href="/">
            <Image src={Logo} alt="logo" fill className="object-contain" />
          </Link>
        </div>
        <div className="flex gap-[16px] py-[28px] flex-wrap flex-grow justify-end items-center">
          <AnimatedSearchTransform />
          <Link href="/chat">
            <Button className="responsive-btn bg-[#f6f6f6] hover:bg-primary flex gap-[8px] text-[#242b3a] hover:text-white">
              <ChatIcon />
            
            </Button>
          </Link>
          <Button className="responsive-btn bg-[#f6f6f6] hover:bg-[#f6f6f6] relative" onClick={showCartToast}>

<CartIcon />
</Button>
          <LocaleSwitcher />
          {renderAuthButton()}
        </div>
      </div>
      <div className="w-full primary-bg h-[56px]">
        <div className="max-w-[1380px] px-[10px] mx-auto">
          <Navbar />
        </div>
      </div>
    </header>
  );
};