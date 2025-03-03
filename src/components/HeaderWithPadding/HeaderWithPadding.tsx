"use client";

import { useEffect, useState, ReactNode } from "react";
import { Header } from "@/components/Header/Header";

export function HeaderWithPadding({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header) setHeaderHeight(header.clientHeight);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <>
      <Header />
      <main style={{ paddingTop: `${headerHeight}px` }}>{children}</main>
    </>
  );
}
