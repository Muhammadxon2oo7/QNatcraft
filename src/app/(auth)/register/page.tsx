"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import LocaleSwitcher from "@/components/Header/LocaleSwitcher";
import { AuthLogo } from "../../../../public/img/auth/AuthLogo";
import RegisterForm from "@/components/register-form/register-form";
import { Verification } from "@/components/register-form/Verification";
import { useTranslations } from "next-intl";

const Register = () => {
  const tauth = useTranslations("auth");
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleBack = () => {
    router.push("/login");
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
        {!isFormSubmitted ? (
          <RegisterForm onSubmit={() => setIsFormSubmitted(true)} />
        ) : (
          <Verification setIsFormSubmitted={setIsFormSubmitted} />
        )}
      </div>
    </div>
  );
};

export default Register;