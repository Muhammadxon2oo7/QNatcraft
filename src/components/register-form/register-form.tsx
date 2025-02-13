"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User } from "../../../public/img/auth/user"
import { Phone } from "../../../public/img/auth/phone"
import { Lock } from "../../../public/img/auth/lock"
import { OpenEye } from "../../../public/img/auth/openEye"
import { EyeOff } from "lucide-react"
import { Registericon } from "../../../public/img/auth/register-icon"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="username" className="font-normal text-xs leading-5 text-gray-500">Ism sharifingiz (Login)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <User/>
            </div>
            <Input id="username" type="text" className="rounded-[16px] p-4 pl-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none" placeholder="Text" />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="font-normal text-xs leading-5 text-gray-500">Telefon raqam</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Phone />
            </div>
            <Input id="phone" type="tel" className=" rounded-[16px] p-4 pl-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none" placeholder="90 000 00 00" defaultValue="+998" />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="font-normal text-xs leading-5 text-gray-500">Parol oylab toping</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock />
            </div>
            <Input id="password" type={showPassword ? "text" : "password"} className="rounded-[16px] p-4 pl-10 pr-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none " placeholder="Text" />
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
                <OpenEye  />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="font-normal text-xs leading-5 text-gray-500">Parolni takrorlang</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Lock  />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="rounded-[16px] p-4 pl-10 pr-10 w-full h-[44px] bg-[#f6f6f6] outline-none border-none"
              placeholder="Text"
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
                <OpenEye   />
              )}
            </Button>
          </div>
        </div>

        <Button className="w-full primary-bg rounded-[16px] py-[14px] px-[20px]  h-[52px]  flex justify-center items-center gap-[8px] text-white" size="lg">
          Ro'yhatdan o'tish <Registericon/>
        </Button>

        <div className="text-center text-sm">
          Sizda akkaut bormi?{" "}
          <a href="#" className="text-[#702727] hover:underline">
            Kirish 
          </a>
        </div>
      </form>
    </div>
  )
}
