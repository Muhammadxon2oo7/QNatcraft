"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "../../../public/img/auth/lock";
import { OpenEye } from "../../../public/img/auth/openEye";
import { Mail } from "../../../public/img/auth/Mail";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { login as loginAction } from "@/services/auth/login";

export default function LoginForm({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) {
  const tauth = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginAction(loginData);
      if (result.access && result.refresh) {
        window.location.href = "/";
      } else {
        toast.error("Invalid login");
      }
      toast.success(tauth("login.successMessage") || "Tizimga kirish muvaffaqiyatli!");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Enter tugmasini bosganda submit qilish uchun funksiya
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any); // Formani submit qilish
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto p-6 space-y-8 ">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Tizimga kirish</h1>
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
              onKeyDown={handleKeyDown} // Enter tugmasi uchun handler qo'shildi
              className="rounded-xl p-4 w-full pl-12 h-12 bg-[#f6f6f6]"
              required
              placeholder="Email"
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
              onKeyDown={handleKeyDown} // Enter tugmasi uchun handler qo'shildi
              className="rounded-xl p-4 w-full pl-12 h-12 bg-[#f6f6f6]"
              placeholder="parol"
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
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          <div className="text-right">
            <Button
              variant="link"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-primary p-0 h-auto"
            >
              Parolni unutdingizmi?
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full rounded-xl h-12 flex justify-center items-center hover:bg-primary">
          Kirish
        </Button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Yoki</span>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <Button className="rounded-xl flex justify-center items-center h-12 w-full bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-base bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
              YaTT orqali kirish
            </p>
          </Button>
          <Button className="rounded-xl flex justify-center items-center h-12 w-full bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-base bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
              STIR orqali kirish
            </p>
          </Button>
        </div>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Tizimda hali yangimisiz?</span>{" "}
          <Link href={"/register"} className="text-primary">
            Ro'yhatdan o'tish
          </Link>
        </div>
      </form>
    </div>
  );
}