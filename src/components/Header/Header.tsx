"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import  Logo  from "../../../public/img/header/Logo.png";
import { Button } from "../ui/button";
import { Search } from "../../../public/img/header/Search";
import { ChatIcon } from "../../../public/img/header/ChatIcon";
import { HeartICon } from "../../../public/img/header/HeartICon";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Login } from "../../../public/img/header/Login";
import AnimatedSearchTransform from "../SearchComponent/animated-search-transform";
import Navbar from "../Navbar/Navbar";
import LocaleSwitcher from "./LocaleSwitcher";
import { ClientHeader } from "./clientHeader";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, LogIn, ShoppingBag, MessageCircle, Heart} from "lucide-react"
import { HamburgerIcon } from "../../../public/img/header/HamburgerIcon";
import { useTranslations } from "next-intl";
import LocaleSwitcherMobile from "./LocaleSwitcherMobile";

export const Header = () => {
  const t = useTranslations("header");

  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    if (typeof window !== "undefined") {
      handleResize(); // Sahifa yuklanganda ham ishlashi uchun
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  
  return (
    <ClientHeader>
      {!isMobile && <header className="block fixed inset-0 bg-white min-h-[120px] md:h-[156px] w-full shadow-md ">
        <div className="flex flex-wrap max-w-[1380px] mx-auto px-[10px] justify-between items-center z-100">
          {/* Logo */}
          <div className="relative w-[140px] md:w-[120px] sm:w-[100px] h-[50px] md:h-[45px] sm:h-[40px]">
  <Link href={'/'}>
    <Image 
      src={Logo} 
      alt="logo" 
      fill 
      className="object-contain" 
    />
  </Link>
</div>


          {/* Right Section */}
          <div className="flex gap-[12px] md:gap-[16px] py-[20px] md:py-[28px] flex-wrap flex-grow justify-end items-center">
            <AnimatedSearchTransform />

            <Button className="responsive-btn bg-[#f6f6f6]  hover:bg-primary flex gap-[8px] text-[#242b3a] hover:text-white ">
              <ChatIcon />
              <p className="responsive-text ">Chat</p>
            </Button>

            <Button className="responsive-btn bg-[#f6f6f6] hover:bg-primary" >
              <HeartICon />
            </Button>

            <LocaleSwitcher />

            <div>
              <Button className="responsive-btn bg-[#fcdbdb] w-[clamp(140px, 10vw, 180px)] rounded-[16px]">
                <Link
                  href={"/register"}
                  className="responsive-text bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent"
                >
                  Kirish
                </Link>
                <Login />
              </Button>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <div className="w-full primary-bg h-[56px]">
          <div className="max-w-[1380px] px-[10px] mx-auto">
            <Navbar />
          </div>
        </div>
      </header>}
      {isMobile && <header className=" sticky top-0 z-50 w-full border-b bg-white  ">
      <div className="w-full  flex h-16 items-center justify-between  ">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <HamburgerIcon/>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md p-0">
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="text-left text-2xl">Menyu</SheetTitle>
              </SheetHeader>
              <nav className="flex-1">
                <div className="flex flex-col divide-y">
                  <Link href="#aboutus" className="px-4 py-3 flex items-center justify-between hover:bg-muted">
                  {t("first")}
                    <span className="text-muted-foreground">›</span>
                  </Link>
                  <Link href="#madaniymeros" className="px-4 py-3 flex items-center justify-between hover:bg-muted">
                  {t("second")}
                    <span className="text-muted-foreground">›</span>
                  </Link>
                  <Link href="#Hunarmandchilikturlari" className="px-4 py-3 flex items-center justify-between hover:bg-muted">
                  {t("third")}
                    <span className="text-muted-foreground">›</span>
                  </Link>
                  <Link href="#" className="px-4 py-3 flex items-center justify-between hover:bg-muted">
                  {t("fourth")}
                    <span className="text-muted-foreground">›</span>
                  </Link>
                  <Link href="#" className="px-4 py-3 flex items-center justify-between hover:bg-muted">
                  {t("fifth")}
                    <span className="text-muted-foreground">›</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-2 p-4 border-t">
                  <Link href="#" className="flex items-center gap-3 ">
                    <ShoppingBag className="h-5 w-5" />
                    {t("sixth")}
                  </Link>
                  <Link href="#" className="flex items-center gap-3 ">
                    <MessageCircle className="h-5 w-5" />
                    Chat
                  </Link>
                  <Link href="#" className="flex items-center gap-3 ">
                    <Heart className="h-5 w-5" />
                    Sevimlilar
                  </Link>
                  <Link href="#" className="flex items-center gap-3 ">
                    <Search />
                    Qidirish
                  </Link>
                </div>
                <div className="mt-auto p-4 border-t">
                  {/* <div className="flex justify-center gap-4 mb-4">
                    <Button variant="outline" size="sm" className="w-20">
                      
                      En
                    </Button>
                    <Button variant="outline" size="sm" className="w-20 border-[#8B4513] text-[#8B4513]">
                      
                      Uz
                    </Button>
                    <Button variant="outline" size="sm" className="w-20 border-[#8B4513] text-[#8B4513]">
                      
                      Qr
                    </Button>
                    <Button variant="outline" size="sm" className="w-20">
                      
                      Ru
                    </Button>
                  </div> */}
                  <LocaleSwitcherMobile/>
                  <Button className="w-full  text-white" >
                    <Link href={'/login'}>Kirish</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
        <div className="relative w-[140px] h-[40px] md:h-[30px] ">
  <Link href={'/'}>
    <Image 
      src={Logo} 
      alt="logo" 
      fill 
      className="object-contain" 
    />
  </Link>
</div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <LogIn className="h-6 w-6" />
          <span className="sr-only">Login</span>
        </Button>
      </div>
    </header>}
    </ClientHeader>
  );
};
