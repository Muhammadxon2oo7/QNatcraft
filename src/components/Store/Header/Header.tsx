// import React from 'react'

// export const Header = () => {
//   return (
//     <div className='w-fullborder border-[#e7e7e9] rounded-[24px] p-[8px] mx-auto h-[68px] shadow-[0_6px_24px_0_rgba(209,209,209,0.15)] '>
//         salo
//     </div>
//   )
// }
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Heart, Truck, Phone } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center border border-[#e7e7e9] rounded-[24px] px-4 py-2 w-[1360px] h-[68px] shadow-md bg-white">
      <div className="flex flex-wrap w-[594px] h-[52px] p-[4px] rounded-[16px] gap-[16px] bg-[#f6f6f6] items-center justify-between ">
    {/* Qidirish maydoni */}
    <div className="flex flex-grow">
        <Input
          placeholder="Qidirish..."
          className="w-full  text-gray-600  shadow-none  border-none focus:outline-none"
        />
      </div>

      {/* Qidirish tugmasi */}
      <Button variant="default" className="rounded-[12px] w-[44px] h-[44px] flex justify-center items-center">
        <Search size={20} />
      </Button>
      </div>
        
      {/* Variantlar */}
      <div className="flex gap-[8px] ml-4">
        <Button variant="default" className="flex items-center gap-2 bg-[#f8f8f8] rounded-[16px] text-[#242b3a]  justify-center  h-[52px]">
          <ShoppingBag size={18} className="text-[#5E0F0F]" />
          Savatcha
        </Button>

        <Button variant="default" className="flex items-center gap-2 bg-[#f8f8f8] rounded-[16px] text-[#242b3a]  justify-center  h-[52px]">
          <Heart size={18} className="text-[#5E0F0F]" />
          Sevimlilar
        </Button>

        <Button variant="default" className="flex items-center gap-2 bg-[#f8f8f8] rounded-[16px] text-[#242b3a]  justify-center  h-[52px]">
          <Phone size={18} className="text-[#5E0F0F]" />
          +998 90 000 00 00
        </Button>

        <Button variant="default" className="flex items-center gap-2 bg-[#f8f8f8] rounded-[16px] text-[#242b3a]  justify-center  h-[52px]">
          <Truck size={18} className="text-[#5E0F0F]" />
          Yetkazib berish
        </Button>
      </div>
    </div>
  );
}
