"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "../../../public/img/auth/lock";
import { OpenEye } from "../../../public/img/auth/openEye";
import { Mail } from "../../../public/img/auth/Mail";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { login as loginAction } from "@/services/auth/login";

export default function LoginForm({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) {
  const t = useTranslations("auth.login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginAction(loginData);
      if (result.access && result.refresh) {
        window.location.href = "/";
      } else {
        toast.error(t("error.invalid"));
      }
      toast.success(t("successMessage"));
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Mail />
            </div>
            <Input
              id="login"
              name="email"
              type="text"
              value={loginData.email}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="rounded-xl p-4 w-full pl-12 h-12 bg-[#f6f6f6]"
              required
              placeholder={t("fields.email.placeholder")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Lock />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="rounded-xl p-4 w-full pl-12 h-12 bg-[#f6f6f6]"
              placeholder={t("fields.password.placeholder")}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <OpenEye />}
              <span className="sr-only">{t(showPassword ? "buttons.hidePassword" : "buttons.showPassword")}</span>
            </Button>
          </div>
          <div className="text-right">
            <Button
              variant="link"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-primary p-0 h-auto"
            >
              {t("buttons.forgotPassword")}
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full rounded-xl h-12 flex justify-center items-center hover:bg-primary">
          {t("buttons.submit")}
        </Button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <Button className="rounded-xl flex justify-center items-center h-12 w-full bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-base bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
              {t("buttons.loginWithYatt")}
            </p>
          </Button>
          <Button className="rounded-xl flex justify-center items-center h-12 w-full bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-base bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
              {t("buttons.loginWithStir")}
            </p>
          </Button>
        </div>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("registerPrompt")}</span>{" "}
          <Link href="/register" className="text-primary">
            {t("buttons.register")}
          </Link>
        </div>
      </form>
    </div>
  );
}