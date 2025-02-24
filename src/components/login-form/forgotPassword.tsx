"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail } from "../../../public/img/auth/Mail";
import { Lock } from "../../../public/img/auth/lock";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

// Import server actions
import { forgotPassword } from "@/services/auth/forgotPassword";
import { resetPassword } from "@/services/auth/resetPassword";

const ForgotPassword = ({ setIsForgotPassword }: { setIsForgotPassword: (value: boolean) => void }) => {
  // Bosqichlar: "email" -> "verify" -> "reset"
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const tauth = useTranslations("auth");

  // Timer: vaqt tugagach, qayta yuborishni faollashtirish
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  // Email validatsiyasi
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Bosqich 1: Emailni yuborish
  const handleEmailSubmit = async () => {
    setLoading(true);
    if (!isValidEmail(email)) {
      toast.error("Iltimos, to‘g‘ri email kiriting!");
      setLoading(false);
      return;
    }
    try {
      // Serverga forgotPassword so'rovini yuboramiz
      const response = await forgotPassword(email);
      // Backenddan kelayotgan kodni generatedCode ga o'rnatamiz
      // Backend javobi formatida { code: "123456", ... } deb kelishi kutiladi
      setGeneratedCode(response.code);
      toast.success("Tasdiqlash kodi yuborildi!");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // Bosqich 2: Kodni kiritish
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...verificationCode];
      if (!newCode[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setVerificationCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasted)) return;
    setVerificationCode(pasted.split(""));
    inputs.current[5]?.focus();
  };

  const handleCodeSubmit = () => {
    const entered = verificationCode.join("").trim();
    const generated = String(generatedCode || "").trim();
    console.log("Entered code:", entered);
    console.log("Generated code:", generated);
    if (entered === generated) {
      setStep("reset");
    } else {
      toast.error("Noto‘g‘ri kod! Qayta urinib ko‘ring.");
    }
  };

  // Bosqich 3: Yangi parolni o'rnatish
  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo‘lishi kerak!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parollar mos kelmadi!");
      return;
    }
    setLoading(true);
    try {
      // Serverga resetPassword so'rovini yuboramiz
      const response = await resetPassword({
        email,
        code: String(generatedCode).trim(),
        newPassword,
      });
      toast.success("Parolingiz muvaffaqiyatli yangilandi!");
      // Yangi parol muvaffaqiyatli o'rnatilgandan keyin login sahifasiga yo'naltirish yoki jarayonni tugatish
      // Misol: window.location.href = "/login";
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const isCodeValid = verificationCode.join("").length === 6;
  const isPasswordValid = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleKeyDownGlobal = (e: React.KeyboardEvent<HTMLInputElement>, currentStep: string) => {
    if (e.key === "Enter") {
      if (currentStep === "email") {
        handleEmailSubmit();
      } else if (currentStep === "verify") {
        handleCodeSubmit();
      } else if (currentStep === "reset") {
        handlePasswordReset();
      }
    }
  };

  // Qayta yuborish
  const handleResend = () => {
    setVerificationCode(new Array(6).fill(""));
    setTimeLeft(30);
    setIsResendDisabled(true);
    inputs.current[0]?.focus();
    toast.success("Yangi kod yuborildi");
    // Agar backendga qayta yuborish so'rovi kerak bo'lsa, uni shu yerga qo'shing
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      {step === "email" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Parolni tiklash</h1>
          <p className="text-center text-muted-foreground">
            Parolni tiklash uchun ro'yhatdan o'tgan email pochtangizni kiriting!
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Mail />
            </div>
            <Input
              type="email"
              placeholder="Email pochta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "email")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
          </div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handleEmailSubmit}
            disabled={!isValidEmail(email) || loading}
          >
            {loading ? "Yuborilmoqda..." : "Email yuborish"}
          </Button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Tasdiqlash</h1>
          <p className="text-center text-muted-foreground">
            {email} ga yuborilgan tasdiqlash kodini kiriting!
          </p>
          <div className="grid grid-cols-6 gap-2">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null) => { inputs.current[index] = el; }}

                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-10 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
                aria-label={`Kod ${index + 1}-raqami`}
              />
            ))}
          </div>
          <div className="text-center text-xl font-medium">
            00:{String(timeLeft).padStart(2, "0")}
          </div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handleCodeSubmit}
            disabled={!isCodeValid || loading}
          >
            {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
          </Button>
          <button
            className="w-full text-center mt-2 text-[#C72525] text-xs"
            disabled={isResendDisabled}
            onClick={handleResend}
          >
            Kodni qayta yuborish
          </button>
        </div>
      )}

      {step === "reset" && (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Yangi parol</h1>
          <p className="text-center text-muted-foreground">
            Yangi parolingizni kiriting va tasdiqlang
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Yangi parol"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "reset")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Parolni tasdiqlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDownGlobal(e, "reset")}
              className="rounded-[16px] p-4 w-full pl-10 h-[54px] bg-[#f6f6f6]"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button
            className="w-full rounded-[16px] h-[52px] flex justify-center items-center hover:primary-bg"
            onClick={handlePasswordReset}
            disabled={!isPasswordValid || loading}
          >
            {loading ? "Yuborilmoqda..." : "Parolni yangilash"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
