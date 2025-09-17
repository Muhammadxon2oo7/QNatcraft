// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Logo from "../../../public/img/header/Logo.png";
// import { Button } from "../ui/button";
// import { Search } from "../../../public/img/header/Search";
// import { ChatIcon } from "../../../public/img/header/ChatIcon";
// import { CartIcon } from "../../../public/img/header/CartIcon";
// import { HamburgerIcon } from "../../../public/img/header/HamburgerIcon";
// import { X } from "lucide-react";
// import { useTranslations } from "next-intl";
// import { useMediaQuery } from "@/hooks/useMediaQuery";
// import Link from "next/link";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "../ui/sheet";
// import { LogIn, ShoppingBag, MessageCircle, Heart, LogOut } from "lucide-react";
// import AnimatedSearchTransform from "../SearchComponent/animated-search-transform";
// import Navbar from "../Navbar/Navbar";
// import LocaleSwitcher from "./LocaleSwitcher";
// import LocaleSwitcherMobile from "./LocaleSwitcherMobile";
// import { useAuth } from "../../../context/auth-context";
// import { toast } from "sonner";
// import { ClientHeader } from "./clientHeader";

// interface UserData {
//   id: number;
//   user_email: string;
//   user_first_name: string;
//   profession: string | null;
//   bio: string | null;
// }

// export const Header = () => {
//   const t = useTranslations("header");
//   const [open, setOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const { user, loading, logout } = useAuth();

//   const showCartToast = () => {
//     toast(t("cart_message") || "Savatcha funksiyasi tez orada ishga tushadi!", {
//       style: {
//         background: "#f6f6f6",
//         color: "#820C0F",
//         borderRadius: "8px",
//       },
//       duration: 3000,
//     });
//   };

//   const handleMenuToggle = (isOpen: boolean) => {
//     console.log(`Menu toggle: ${isOpen ? "Opening" : "Closing"}`);
//     setOpen(isOpen);
//   };

//   const renderAuthButton = () => {
//     if (loading) {
//       return <Button disabled className="w-[160px] h-[40px] rounded-[16px] bg-gray-200 text-gray-500">{t("loading")}</Button>;
//     }

//     if (user) {
//       return (
//         <div className="flex items-center gap-2">
//           <Button
//             className="w-[160px] h-[40px] rounded-[16px] bg-[#fadee0] flex items-center gap-2"
//             aria-label={`${user.profile.user_first_name} profiliga o'tish`}
//           >
//             <Image
//               src={
//                 user?.profile?.profile_image
//                   ? `https://qqrnatcraft.uz${user.profile.profile_image}`
//                   : "/img/user.png"
//               }
//               alt={`${user.profile.user_first_name} profil rasmi`}
//               height={24}
//               width={24}
//               className="w-[24px] h-[24px] rounded-full object-cover"
//             />
//             <Link href="/profile" className="font-medium text-[18px] text-[#820C0F]">
//               {user.profile.user_first_name}
//             </Link>
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-[40px] h-[40px] rounded-[16px] hover:bg-red-100"
//             onClick={() => {
//               console.log("Logout button clicked");
//               logout();
//             }}
//             aria-label="Chiqish"
//           >
//             <LogOut className="h-5 w-5 text-red-500" />
//           </Button>
//         </div>
//       );
//     }

//     return (
//       <Button
//         className="w-[160px] h-[40px] rounded-[16px] bg-primary text-white"
//         asChild
//         aria-label="Kirish sahifasiga o'tish"
//       >
//         <Link href="/login">{t("login")}</Link>
//       </Button>
//     );
//   };

//   const renderMobileAuthButton = () => {
//     if (loading) return <Button disabled className="w-full h-[40px] rounded-[16px] bg-gray-200 text-gray-500">{t("loading")}</Button>;

//     if (user) {
//       return (
//         <div className="flex flex-col gap-2">
//           <Button className="w-full h-[40px] rounded-[16px] text-white" asChild aria-label={`${user?.profile?.user_first_name} profiliga o'tish`}>
//             <Link href="/profile">{user?.profile?.user_first_name}</Link>
//           </Button>
//           <Button
//             className="w-full h-[40px] rounded-[16px] bg-red-500 text-white"
//             onClick={() => {
//               console.log("Mobile logout button clicked");
//               logout();
//             }}
//             aria-label="Chiqish"
//           >
//             {t("logout")}
//           </Button>
//         </div>
//       );
//     }

//     return (
//       <Button className="w-full h-[40px] rounded-[16px] text-white" asChild aria-label="Kirish sahifasiga o'tish">
//         <Link href="/login">{t("login")}</Link>
//       </Button>
//     );
//   };

//   if (isMobile) {
//     return (

//   <ClientHeader>
//     <header className="sticky top-0 z-[100] w-full border-b bg-white">
//       <div className="flex h-16 items-center justify-between px-4 max-w-[1380px] mx-auto">
//         <Sheet open={open} onOpenChange={handleMenuToggle}>
//           <SheetTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden w-[40px] h-[40px] rounded-[16px] z-[1000] relative"
//               aria-label="Menyuni ochish yoki yopish"
//               onClick={() => {
//                 console.log(`Hamburger or X button clicked, current open state: ${open}`);
//                 setOpen(!open);
//               }}
//             >
//               {open ? <X className="h-6 w-6" /> : <HamburgerIcon />}
//               <span className="sr-only">Toggle menu</span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent
//             side="left"
//             className="w-full max-w-none p-0 top-[64px] overflow-y-auto z-[999] no-close-button" 
            
//           >
//             <div className="flex flex-col min-h-[calc(100vh-64px)]">
//               <nav className="flex-grow">
//                 <div className="flex flex-col divide-y">
//                   {[
//                     { href: "#aboutus", label: t("first") },
//                     { href: "#madaniymeros", label: t("second") },
//                     { href: "#Hunarmandchilikturlari", label: t("third") },
//                     { href: "#", label: t("fourth") },
//                     { href: "/korgazmalar", label: t("fifth") },
//                   ].map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className="px-4 py-3 flex items-center justify-between hover:bg-muted"
//                       onClick={() => {
//                         console.log(`Menu item clicked: ${item.label}`);
//                         setOpen(false);
//                       }}
//                       aria-label={`${item.label} sahifasiga o'tish`}
//                     >
//                       {item.label}
//                       <span className="text-muted-foreground">›</span>
//                     </Link>
//                   ))}
//                 </div>
//                 <div className="flex flex-col gap-2 p-4 border-t">
//                   <button
//                     onClick={() => {
//                       console.log("Cart button clicked");
//                       showCartToast();
//                     }}
//                     className="flex items-center gap-3 text-[#242b3a] cursor-not-allowed"
//                     aria-label="Savatcha"
//                   >
//                     <ShoppingBag className="h-5 w-5" />
//                     {t("sixth")}
//                   </button>
//                   <Link
//                     href="/chat"
//                     className="flex items-center gap-3"
//                     aria-label="Chat sahifasiga o'tish"
//                     onClick={() => console.log("Chat link clicked")}
//                   >
//                     <MessageCircle className="h-5 w-5" />
//                     <span>{t("chat") || "Chat"}</span>
//                   </Link>
//                   <Link
//                     href="#"
//                     className="flex items-center gap-3"
//                     aria-label="Sevimlilar sahifasiga o'tish"
//                     onClick={() => console.log("Favorites link clicked")}
//                   >
//                     <Heart className="h-5 w-5" />
//                     {t("favorites") || "Sevimlilar"}
//                   </Link>
//                   <Link
//                     href="#"
//                     className="flex items-center gap-3"
//                     aria-label="Qidirish sahifasiga o'tish"
//                     onClick={() => console.log("Search link clicked")}
//                   >
//                     <Search />
//                     {t("search") || "Qidirish"}
//                   </Link>
//                 </div>
//               </nav>
//               <div className="mt-auto p-4 border-t">
//                 <LocaleSwitcherMobile />
//                 {renderMobileAuthButton()}
//               </div>
//             </div>
//           </SheetContent>
//         </Sheet>
//         <div className="flex items-center gap-2">
//           <div className="relative w-[140px] h-[40px]">
//             <Link href="/">
//               <Image src={Logo} alt="QQRNATCRAFT logo" fill className="object-contain" />
//             </Link>
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="md:hidden w-[40px] h-[40px] rounded-[16px]"
//           onClick={() => console.log("Profile/Login button clicked")}
//         >
//           {user ? (
//             <Link href="/profile" aria-label={`${user?.profile?.user_first_name} profiliga o'tish`}>
//               <span className="text-sm font-medium">{user?.profile?.user_first_name}</span>
//             </Link>
//           ) : (
//             <Link href="/login" aria-label="Kirish sahifasiga o'tish">
//               <LogIn className="h-6 w-6" />
//               <span className="sr-only">{t("login")}</span>
//             </Link>
//           )}
//         </Button>
//       </div>
//     </header>
//   </ClientHeader>

//     );
//   }

//   return (
//     <ClientHeader>
//       <header className="fixed top-0 left-0 right-0 bg-white h-[156px] w-full shadow-md z-[100]">
//         <div className="flex max-w-[1380px] mx-auto px-[10px] justify-between items-center h-[100px]">
//           <div className="relative w-[120px] h-[45px]">
//             <Link href="/">
//               <Image src={Logo} alt="QQRNATCRAFT logo" fill className="object-contain" />
//             </Link>
//           </div>
//           <div className="flex gap-[16px] items-center">
//             <AnimatedSearchTransform />
//             <Link
//               href="/chat"
//               aria-label="Chat sahifasiga o'tish"
//               onClick={() => console.log("Desktop chat button clicked")}
//             >
//               <Button className="w-[40px] h-[40px] rounded-[16px] bg-[#f6f6f6] hover:bg-primary flex gap-[8px] text-[#242b3a] hover:text-white">
//                 <ChatIcon />
//               </Button>
//             </Link>
//             <Button
//               className="w-[40px] h-[40px] rounded-[16px] bg-[#f6f6f6] hover:bg-[#f6f6f6] relative"
//               onClick={() => {
//                 console.log("Desktop cart button clicked");
//                 showCartToast();
//               }}
//               aria-label="Savatcha"
//             >
//               <CartIcon />
//             </Button>
//             <LocaleSwitcher />
//             {renderAuthButton()}
//           </div>
//         </div>
//         <div className="w-full primary-bg h-[56px]">
//           <div className="max-w-[1380px] px-[10px] mx-auto">
//             <Navbar />
//           </div>
//         </div>
//       </header>
//     </ClientHeader>
//   );
// };\


"use client";

import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/img/header/Logo.png";
import { Button } from "../ui/button";
import { Search } from "../../../public/img/header/Search";
import { ChatIcon } from "../../../public/img/header/ChatIcon";
import { CartIcon } from "../../../public/img/header/CartIcon";
import { HamburgerIcon } from "../../../public/img/header/HamburgerIcon";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { LogIn, ShoppingBag, MessageCircle, Heart, LogOut } from "lucide-react";
import AnimatedSearchTransform from "../SearchComponent/animated-search-transform";
import Navbar from "../Navbar/Navbar";
import LocaleSwitcher from "./LocaleSwitcher";
import LocaleSwitcherMobile from "./LocaleSwitcherMobile";
import { useAuth } from "../../../context/auth-context";
import { toast } from "sonner";
import { ClientHeader } from "./clientHeader";

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

  const handleMenuToggle = (isOpen: boolean) => {
    console.log(`Menu toggle: ${isOpen ? "Opening" : "Closing"}`);
    setOpen(isOpen);
  };

  const renderAuthButton = () => {
    if (loading) {
      return <Button disabled className="w-[160px] h-[40px] rounded-[16px] bg-gray-200 text-gray-500">{t("loading")}</Button>;
    }

    if (user) {
      const profileLink = user.profile.is_verified ? "/Xprofile" : "/profile";
      return (
        <div className="flex items-center gap-2">
          <Button
            className=" h-[40px] rounded-[16px] bg-[#fadee0] flex items-center gap-2"
            aria-label={`${user.profile.user_first_name} profiliga o'tish`}
          >
            <Image
              src={
                user?.profile?.profile_image
                  ? `https://qqrnatcraft.uz${user.profile.profile_image}`
                  : "/img/user.png"
              }
              alt={`${user.profile.user_first_name} profil rasmi`}
              height={24}
              width={24}
              className="w-[24px] h-[24px] rounded-full object-cover"
            />
            <Link href={profileLink} className="font-medium text-[18px] text-[#820C0F]">
              {user.profile.user_first_name}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-[40px] h-[40px] rounded-[16px] hover:bg-red-100"
            onClick={() => {
              console.log("Logout button clicked");
              logout();
            }}
            aria-label="Chiqish"
          >
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      );
    }

    return (
      <Button
        className="w-[160px] h-[40px] rounded-[16px] bg-primary text-white"
        asChild
        aria-label="Kirish sahifasiga o'tish"
      >
        <Link href="/login">{t("login")}</Link>
      </Button>
    );
  };

  const renderMobileAuthButton = () => {
    if (loading) return <Button disabled className="w-full h-[40px] rounded-[16px] bg-gray-200 text-gray-500">{t("loading")}</Button>;

    if (user) {
      const profileLink = user.profile.is_verified ? "/Xprofile" : "/profile";
      return (
        <div className="flex flex-col gap-2">
          <Button className="w-full h-[40px] rounded-[16px] text-white" asChild aria-label={`${user?.profile?.user_first_name} profiliga o'tish`}>
            <Link href={profileLink}>{user?.profile?.user_first_name}</Link>
          </Button>
          <Button
            className="w-full h-[40px] rounded-[16px] bg-red-500 text-white"
            onClick={() => {
              console.log("Mobile logout button clicked");
              logout();
            }}
            aria-label="Chiqish"
          >
            {t("logout")}
          </Button>
        </div>
      );
    }

    return (
      <Button className="w-full h-[40px] rounded-[16px] text-white" asChild aria-label="Kirish sahifasiga o'tish">
        <Link href="/login">{t("login")}</Link>
      </Button>
    );
  };

  if (isMobile) {
    return (
      <ClientHeader>
        <header className="sticky top-0 z-[100] w-full border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4 max-w-[1380px] mx-auto">
            <Sheet open={open} onOpenChange={handleMenuToggle}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden w-[40px] h-[40px] rounded-[16px] z-[1000] relative"
                  aria-label="Menyuni ochish yoki yopish"
                  onClick={() => {
                    console.log(`Hamburger or X button clicked, current open state: ${open}`);
                    setOpen(!open);
                  }}
                >
                  {open ? <X className="h-6 w-6" /> : <HamburgerIcon />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-none p-0 top-[64px] overflow-y-auto z-[999] no-close-button"
              >
                <div className="flex flex-col min-h-[calc(100vh-64px)]">
                  <nav className="flex-grow">
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
                          onClick={() => {
                            console.log(`Menu item clicked: ${item.label}`);
                            setOpen(false);
                          }}
                          aria-label={`${item.label} sahifasiga o'tish`}
                        >
                          {item.label}
                          <span className="text-muted-foreground">›</span>
                        </Link>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 p-4 border-t">
                      <button
                        onClick={() => {
                          console.log("Cart button clicked");
                          showCartToast();
                        }}
                        className="flex items-center gap-3 text-[#242b3a] cursor-not-allowed"
                        aria-label="Savatcha"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        {t("sixth")}
                      </button>
                      <Link
                        href="/chat"
                        className="flex items-center gap-3"
                        aria-label="Chat sahifasiga o'tish"
                        onClick={() => console.log("Chat link clicked")}
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{t("chat") || "Chat"}</span>
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center gap-3"
                        aria-label="Sevimlilar sahifasiga o'tish"
                        onClick={() => console.log("Favorites link clicked")}
                      >
                        <Heart className="h-5 w-5" />
                        {t("favorites") || "Sevimlilar"}
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center gap-3"
                        aria-label="Qidirish sahifasiga o'tish"
                        onClick={() => console.log("Search link clicked")}
                      >
                        <Search />
                        {t("search") || "Qidirish"}
                      </Link>
                    </div>
                  </nav>
                  <div className="mt-auto p-4 border-t">
                    <LocaleSwitcherMobile />
                    {renderMobileAuthButton()}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="relative w-[140px] h-[40px]">
                <Link href="/">
                  <Image src={Logo} alt="QQRNATCRAFT logo" fill className="object-contain" />
                </Link>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-[40px] h-[40px] rounded-[16px]"
              onClick={() => console.log("Profile/Login button clicked")}
            >
              {user ? (
                <Link href={user.profile.is_verified ? "/Xprofile" : "/profile"} aria-label={`${user?.profile?.user_first_name} profiliga o'tish`}>
                  <span className="text-sm font-medium">{user?.profile?.user_first_name}</span>
                </Link>
              ) : (
                <Link href="/login" aria-label="Kirish sahifasiga o'tish">
                  <LogIn className="h-6 w-6" />
                  <span className="sr-only">{t("login")}</span>
                </Link>
              )}
            </Button>
          </div>
        </header>
      </ClientHeader>
    );
  }

  return (
    <ClientHeader>
      <header className="fixed top-0 left-0 right-0 bg-white h-[156px] w-full shadow-md z-[100]">
        <div className="flex max-w-[1380px] mx-auto px-[10px] justify-between items-center h-[100px]">
          <div className="relative w-[120px] h-[45px]">
            <Link href="/">
              <Image src={Logo} alt="QQRNATCRAFT logo" fill className="object-contain" />
            </Link>
          </div>
          <div className="flex gap-[16px] items-center">
            {/* <AnimatedSearchTransform /> */}
            <Link
              href="/chat"
              aria-label="Chat sahifasiga o'tish"
              onClick={() => console.log("Desktop chat button clicked")}
            >
              <Button className="w-[40px] h-[40px] rounded-[16px] bg-[#f6f6f6] hover:bg-primary flex gap-[8px] text-[#242b3a] hover:text-white">
                <ChatIcon />
              </Button>
            </Link>
            <Button
              className="w-[40px] h-[40px] rounded-[16px] bg-[#f6f6f6] hover:bg-[#f6f6f6] relative"
              onClick={() => {
                console.log("Desktop cart button clicked");
                showCartToast();
              }}
              aria-label="Savatcha"
            >
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
    </ClientHeader>
  );
};