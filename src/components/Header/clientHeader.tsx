"use client";
import { usePathname } from "next/navigation";
import React from "react";

export const ClientHeader = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const disableHeaderPages = ["/login", "/register"];

  if (disableHeaderPages.includes(path)) {
    return null; // Agar path "/login" yoki "/register" bo'lsa, hech narsa qaytarmaydi
  }

  return <>{children}</>; 
};
