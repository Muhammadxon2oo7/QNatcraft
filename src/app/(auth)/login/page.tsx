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
    <div className="register">
      <div className="inner-container rounded-3xl w-full max-w-[580px] bg-white/90 backdrop-blur-md p-6 md:p-8 shadow-lg my-[20px]">
        <div className="flex justify-between items-center h-12 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={handleBack}
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <LocaleSwitcher />
        </div>
        <div className="flex justify-center mb-8">
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