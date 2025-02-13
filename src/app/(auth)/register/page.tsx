"use client";
import LocaleSwitcher from "@/components/Header/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLogo } from "../../../../public/img/auth/AuthLogo";
import RegisterForm from "@/components/register-form/register-form";




const Register = () => {
  const router = useRouter();
  const [previousURL, setPreviousURL] = useState<string | null>(null);

  useEffect(() => {
    // Brauzerdagi oldingi sahifa URL'ini olish
    setPreviousURL(document.referrer);
  }, []);

  const handleBack = () => {
    if (previousURL) {
      router.back(); // Oldingi sahifaga qaytarish
    } else {
      router.push("/"); // Agar yo'q bo‘lsa, bosh sahifaga qaytarish
    }
  };


  return (
    <div className="register py-[20px] pr-[120px] flex flex-wrap pl-[72px] justify-between items-end">
      <div className="w-[96px] h-[26px] bg-[#C5C5C5] fill-opacity-80 rounded-[40px]"></div>
      <div className="rounded-[24px] w-[580px] h-full backdrop-blur-[124px] bg-white p-[16px]">
        <div className="flex justify-between h-[52px] overflow-hidden mb-[16px]">
          <Button variant="outline" size="icon" className="h-[42px] w-[52px]" onClick={handleBack}>
            <ChevronLeft />
          </Button>
          <LocaleSwitcher />
        </div>
        <div className="w-full flex justify-center flex-wrap gap-[16px] ">
          <AuthLogo/>
          <p className="font-bold text-[20px] leading-[120%] text-center text-[#242b3a] w-full items-center">
          Ro’yhatdan o’tish
          </p>
        </div>
        <RegisterForm/>
      </div>
    </div>
  );
};

export default Register;
