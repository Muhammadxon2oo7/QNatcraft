"use client"

import {  EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "../../../public/img/auth/user"
import { Lock } from "../../../public/img/auth/lock"
import { OpenEye } from "../../../public/img/auth/openEye"
import { Registericon } from "../../../public/img/auth/register-icon"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Tizimga kirish</h1>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login" className="font-normal text-xs leading-[120%] text-[#858991]">Login</Label>
          <div className="relative">
          
          <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
          <User />
          </div>
            
            <Input id="login" type="text" className=" rounded-[16px] p-4 w-[420px] pl-9 h-[54px] bg-[#f6f6f6]" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="font-normal text-xs leading-[120%] text-[#858991]">Parol</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
            <Lock />
            </div>
            <Input id="password" type={showPassword ? "text" : "password"} className="rounded-[16px] p-4 w-[420px] pl-9 h-[54px] bg-[#f6f6f6]" required />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <div className="h-4 w-4 text-muted-foreground">
                    <OpenEye  />
                </div>
                
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
          <div className="text-right">
            <Button variant="link" className="text-sm text-primary p-0 h-auto">
              Parolni unutdingizmi?
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full rounded-[16px] h-[52px] flex justify-center items-center ">
          Kirish <Registericon/>
        </Button>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Yoki</span>
          </div>
        </div>
        <div className="w-full flex  justify-between gap-[16px]">
          <Button  className="rounded-[16px] flex justify-center items-center h-[52px] w-[202px] bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-[18px] leading-[133%] bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
            YaTT orqali kirish
            </p>
          </Button>
          
          <Button  className="rounded-[16px] flex justify-center items-center h-[52px] w-[202px] bg-[#fee] hover:bg-[#fee]">
            <p className="font-medium text-[18px] leading-[133%] bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
            STIR orqali kirish
            </p>
          </Button>
        </div>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Tizimda hali yangimisiz?</span>{" "}
          <Button variant="link" className="p-0 h-auto">
            Ro'yhatdan o'tish
          </Button>
        </div>
      </form>
    </div>
  )
}

