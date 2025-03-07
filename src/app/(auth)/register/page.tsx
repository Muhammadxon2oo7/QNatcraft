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
    <div className=" py-4 px-4 md:px-0 flex items-center justify-center md:justify-end bg-gray-50 register absolute inset-0  h-auto">
      <div className="rounded-3xl w-full max-w-[580px] bg-white/90 backdrop-blur-md p-4 md:p-6 shadow-lg m-[5px]">
        <div className="flex justify-between items-center h-12 mb-4">
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
        <div className="flex justify-center mb-6">
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