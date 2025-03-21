"use client";

import LocaleSwitcher from "@/components/Header/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthLogo } from "../../../../public/img/auth/AuthLogo";
import LoginForm from "@/components/login-form/login-form";
import ForgotPassword from "@/components/login-form/forgotPassword";
import { useTranslations } from "next-intl";

const Login = () => {
  const tauth = useTranslations("auth");
  const router = useRouter();
  const [previousURL, setPreviousURL] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  useEffect(() => {
    setPreviousURL(document.referrer);
  }, []);

  const handleBack = () => {
    if (previousURL) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="register py-[10px] md:pr-[120px] flex flex-wrap md:pl-[72px] justify-center md:justify-end items-center md:items-end max-h-[100vh] absolute top-0 left-0 right-0 bottom-0">
      <div className="rounded-[24px] md:w-[580px] h-full backdrop-blur-[124px] bg-white p-[16px] w-[90%]">
        <div className="flex justify-between h-[52px] overflow-hidden mb-[16px]">
          <Button variant="outline" size="icon" className="h-[42px] w-[52px]" onClick={handleBack}>
            <ChevronLeft />
          </Button>
          <LocaleSwitcher />
        </div>
        <div className="w-full flex justify-center flex-wrap gap-[16px] ">
          <AuthLogo />
        </div>
        {isForgotPassword ? (
          <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
        ) : (
          <LoginForm setIsForgotPassword={setIsForgotPassword} />
        )}
      </div>
    </div>
  );
};

export default Login;
