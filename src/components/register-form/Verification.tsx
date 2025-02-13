// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Check, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner"
// import type React from "react";
// import { useTranslations } from "next-intl";
// import { Mail } from "../../../public/img/auth/Mail";
// import Celebrate from "../../../public/img/auth/celebrate";
// import { Resend } from "../../../public/img/auth/resend";
// export function Verification() {
// const tauth = useTranslations("auth");

//   const [code, setCode] = useState(["", "", "", "", "", ""]);
//   const [timeLeft, setTimeLeft] = useState(34);
//   const [error, setError] = useState(false);
//   const [canResend, setCanResend] = useState(false);
//   const inputs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [timeLeft]);

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d?$/.test(value)) return;
//     const newCode = [...code];
//     newCode[index] = value;
//     setCode(newCode);
//     setError(false);

//     if (value && index < 5) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace") {
//       const newCode = [...code];

//       if (!newCode[index] && index > 0) {
//         inputs.current[index - 1]?.focus();
//       } else {
//         newCode[index] = "";
//         setCode(newCode);
//       }
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").slice(0, 6);
//     if (!/^\d{6}$/.test(pasted)) return;

//     setCode(pasted.split(""));
//     inputs.current[5]?.focus();
//   };

//   const handleVerify = () => {
//     const enteredCode = code.join("");
//     const correctCode = "123456"; 

//     if (enteredCode === correctCode) {
//         toast(<span className="flex items-center gap-2">{<Celebrate />} {tauth("register.codeIsright")}</span>);
//     } else {
//       setError(true);
//     }
//   };

//   const handleResend = () => {
//     setCode(["", "", "", "", "", ""]);
//     setTimeLeft(34);
//     setCanResend(false);
//     setError(false);
//     inputs.current[0]?.focus();
//     toast(<span className="flex items-center gap-2">{<Resend />} {tauth("register.codeResended")}</span>);

//   };

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-6">
//       <div className="text-center space-y-2">
//         <h1 className="text-2xl font-semibold">Tasdiqlash</h1>
//         <p className="text-muted-foreground">
//           Tasdiqlash uchun <span className="text-foreground">muhammadxon@gmail.com</span>ga
//           <br />
//           yuborilgan sms kodni kiriting!
//         </p>
//       </div>

//       <div className="flex justify-center gap-2">
//         {code.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputs.current[index] = el)}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             className={`w-12 h-12 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none ${
//               error ? "border-red-500" : ""
//             }`}
//             value={digit}
//             onChange={(e) => handleChange(index, e.target.value)}
//             onKeyDown={(e) => handleKeyDown(index, e)}
//             onPaste={handlePaste}
//             aria-label={`Kod ${index + 1}-raqami`}
//           />
//         ))}
//       </div>

//       {error && <p className="text-center text-red-500 font-medium">❌ Noto‘g‘ri kod! Qayta urinib ko‘ring.</p>}

//       <div className="text-center text-xl font-medium">
//         {canResend ? (
//           <Button onClick={handleResend} className="bg-[#6B1818] hover:bg-[#561313] text-white">
//             Qayta yuborish
//             <RefreshCw className="ml-2 h-5 w-5" />
//           </Button>
//         ) : (
//           `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
//         )}
//       </div>

//       <Button
//         onClick={handleVerify}
//         className="w-full h-12 text-lg bg-[#6B1818] hover:bg-[#561313] text-white"
//         disabled={code.some((digit) => !digit)}
//       >
//         Tasdiqlash
//         <Check className="ml-2 h-5 w-5" />
//       </Button>

//       <div className="text-center">
//         <a href="#" className="text-[#6B1818] hover:underline">
//           Emailni almashtirish
//         </a>
//       </div>
//     </div>
//   );
// }

"use client";


import { useState, useEffect, useRef } from "react";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type React from "react";
import { useTranslations } from "next-intl";
import { Mail } from "../../../public/img/auth/Mail";
import Celebrate from "../../../public/img/auth/celebrate";
import { Resend } from "../../../public/img/auth/resend";
import { useRouter } from "next/navigation";

interface VerificationProps {
  setIsFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Verification({ setIsFormSubmitted }: VerificationProps) {
  const tauth = useTranslations("auth");
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(34);
  const [error, setError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [previousURL, setPreviousURL] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // localStorage'dan email ma'lumotini olish
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setEmail(parsedData.email); // Agar email bo'lmasa, default qiymatni yozamiz
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(false);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newCode = [...code];

      if (!newCode[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pasted)) return;

    setCode(pasted.split(""));
    inputs.current[5]?.focus();
  };
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

  const handleVerify = () => {
    const enteredCode = code.join("");
    const correctCode = "123456";

    if (enteredCode === correctCode) {
        localStorage.removeItem("userData");
      toast(<span className="flex items-center gap-2">{<Celebrate />} {tauth("register.codeIsright")}</span>);
      handleBack()
    } else {
      setError(true);
    }
  };

  const handleResend = () => {
    setCode(["", "", "", "", "", ""]);
    setTimeLeft(34);
    setCanResend(false);
    setError(false);
    inputs.current[0]?.focus();
    toast(<span className="flex items-center gap-2">{<Resend />} {tauth("register.codeResended")}</span>);
  };

  const handleChangeEmail = () => {
    setIsFormSubmitted(false);
  };


  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Tasdiqlash</h1>
        <p className="text-muted-foreground">
          Tasdiqlash uchun <span className="text-foreground">{email}</span> ga
          <br />
          yuborilgan sms kodni kiriting!
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={`w-12 h-12 text-center border rounded-xl bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none ${
              error ? "border-red-500" : ""
            }`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            aria-label={`Kod ${index + 1}-raqami`}
          />
        ))}
      </div>

      {error && <p className="text-center text-red-500 font-medium">❌ Noto‘g‘ri kod! Qayta urinib ko‘ring.</p>}

      <div className="text-center text-xl font-medium">
        {canResend ? (
          <Button onClick={handleResend} className="bg-[#6B1818] hover:bg-[#561313] text-white">
            Qayta yuborish
            <RefreshCw className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
        )}
      </div>

      <Button
        onClick={handleVerify}
        className="w-full h-12 text-lg bg-[#6B1818] hover:bg-[#561313] text-white"
        disabled={code.some((digit) => !digit)}
      >
        Tasdiqlash
        <Check className="ml-2 h-5 w-5" />
      </Button>

      <div className="text-center">
        <a onClick={handleChangeEmail} href="#" className="text-[#6B1818] hover:underline">
          Emailni almashtirish
        </a>
      </div>
    </div>
  );
}
