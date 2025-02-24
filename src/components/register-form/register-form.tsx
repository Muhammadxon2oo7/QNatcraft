"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "../../../public/img/auth/user";
import { Lock } from "../../../public/img/auth/lock";
import { OpenEye } from "../../../public/img/auth/openEye";
import { EyeOff } from "lucide-react";
import { Mail } from "../../../public/img/auth/Mail";
import { useTranslations } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { toast } from "sonner";

// Import server action
import { register as registerAction, RegisterType } from "@/services/auth/register";

export default function RegisterForm({ onSubmit }: { onSubmit: () => void }) {
  const tauth = useTranslations("auth");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setFormData({
        username: parsedUserData.username || "",
        email: "",
        password: parsedUserData.password || "",
        confirmPassword: "",
      });
    }
  }, []);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "username" && !value) {
      error = tauth("register.errors.input.name.second");
    }
    if (name === "email") {
      if (!value) {
        error = tauth("register.errors.input.email.first");
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = tauth("register.errors.input.email.second");
      }
    }
    if (name === "password") {
      if (!value) {
        error = tauth("register.errors.input.password.first");
      } else if (value.length < 5) {
        error = tauth("register.errors.input.password.second");
      }
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        error = tauth("register.errors.input.confirmPassword.first");
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((field) => field !== "")
    ) {
      console.log("Form submitted successfully!");
      try {
        // Tayyorlayotgan maʼlumotlar: backend interfeysida first_name kerak
        const registerData: RegisterType = {
          first_name: formData.username,
          email: formData.email,
          password: formData.password,
        };
        // Serverga soʻrov yuborish:
        const result = await registerAction(registerData);
        // toast(
        //   <span className="flex items-center gap-2">
        //     {<Mail />} {tauth("register.verificationEntry")}
        //   </span>
        // );
        localStorage.setItem("userData", JSON.stringify(registerData));
        onSubmit();
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      console.log("Please fix the errors");
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => error === "") &&
    Object.values(formData).every((field) => field !== "");

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <p className="font-bold text-[20px] leading-[120%] text-center text-[#242b3a] w-full items-center mb-[5px]">
        {tauth("register.title")}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 mb-[10px]">
        {/* Username */}
        <div className="space-y-1">
          <Label htmlFor="username" className="font-normal text-xs leading-5 text-gray-500">
            {tauth("register.name")}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User />
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="rounded-[16px] p-4 pl-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none"
              placeholder={tauth("register.name")}
            />
          </div>
          {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className="font-normal text-xs leading-5 text-gray-500">
            {tauth("register.email")}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="rounded-[16px] p-4 pl-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none"
              placeholder={tauth("register.email")}
              autoFocus
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password" className="font-normal text-xs leading-5 text-gray-500">
            {tauth("register.password")}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className="rounded-[16px] p-4 pl-10 pr-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none"
              placeholder={tauth("register.password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 flex items-center px-3 hover:bg-transparent top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground/70" />
              ) : (
                <OpenEye />
              )}
            </Button>
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="font-normal text-xs leading-5 text-gray-500">
            {tauth("register.confirmPassword")}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="rounded-[16px] p-4 pl-10 pr-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none"
              placeholder={tauth("register.confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 flex items-center px-3 hover:bg-transparent top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground/70" />
              ) : (
                <OpenEye />
              )}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
        </div>

        <div className="space-y-1">
          <Button
            type="submit"
            className="w-full primary-bg rounded-[16px] py-[14px] px-[20px] h-[52px] flex justify-center items-center gap-[8px] text-white"
            size="lg"
            disabled={!isFormValid}
          >
            {tauth("register.button")}
          </Button>
        </div>
      </form>
      <p className="font-normal text-[18px] leading-[111%] text-center text-[#858991]">
        {tauth("register.loginRecommidation.first")}{" "}
        <Link
          href={"/login"}
          className="font-semibold underline bg-gradient-to-br from-red-800 to-red-900 bg-clip-text text-transparent"
        >
          {tauth("register.loginRecommidation.second")}
        </Link>
      </p>

    </div>
  );
}
