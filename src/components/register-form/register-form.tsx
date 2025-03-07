"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { register as registerAction, RegisterType } from "@/services/auth/register";
import { OpenEye } from "../../../public/img/auth/openEye";

export default function RegisterForm({ onSubmit }: { onSubmit: () => void }) {
  const tauth = useTranslations("auth");
  const [loading, setLoading] = useState(false);
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
      setFormData((prev) => ({
        ...prev,
        username: parsedUserData.username || "",
        email: parsedUserData.email || "",
      }));
    }
  }, []);

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = tauth("register.errors.input.name.second");
        break;
      case "email":
        if (!value) error = tauth("register.errors.input.email.first");
        else if (!/\S+@\S+\.\S+/.test(value))
          error = tauth("register.errors.input.email.second");
        break;
      case "password":
        if (!value) error = tauth("register.errors.input.password.first");
        else if (value.length < 5)
          error = tauth("register.errors.input.password.second");
        break;
      case "confirmPassword":
        if (value !== formData.password)
          error = tauth("register.errors.input.confirmPassword.first");
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof typeof formData, value);
  };

  const isFormValid = useMemo(
    () =>
      Object.values(errors).every((error) => !error) &&
      Object.values(formData).every((field) => field),
    [errors, formData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error(tauth("register.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterType = {
        first_name: formData.username,
        email: formData.email,
        password: formData.password,
      };
      await registerAction(registerData);
      toast.success(tauth("register.verificationEntry"), { icon: <Mail /> });
      localStorage.setItem("userData", JSON.stringify(registerData));
      onSubmit();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
    localStorage.removeItem("userData");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 ">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        {tauth("register.title")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1">
          <Label htmlFor="username" className="text-sm text-gray-500">
            {tauth("register.name")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="pl-10 bg-gray-100 rounded-xl h-11"
              placeholder={tauth("register.name")}
              disabled={loading}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm text-gray-500">
            {tauth("register.email")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-gray-100 rounded-xl h-11"
              placeholder={tauth("register.email")}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm text-gray-500">
            {tauth("register.password")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-gray-100 rounded-xl h-11"
              placeholder={tauth("register.password")}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <OpenEye />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-sm text-gray-500">
            {tauth("register.confirmPassword")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-gray-100 rounded-xl h-11"
              placeholder={tauth("register.confirmPassword")}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <OpenEye />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            type="submit"
            className="w-full h-12 bg-red-800 hover:bg-red-900 text-white rounded-xl"
            disabled={!isFormValid || loading}
          >
            {loading ? "Yuborilmoqda..." : tauth("register.button")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={handleReset}
            disabled={loading}
          >
            Tozalash
          </Button>
        </div>
      </form>
      <p className="text-center text-gray-600 mt-4">
        {tauth("register.loginRecommidation.first")}{" "}
        <Link href="/login" className="text-red-800 underline">
          {tauth("register.loginRecommidation.second")}
        </Link>
      </p>
    </div>
  );
}