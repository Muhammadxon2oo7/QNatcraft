"use client";

import { useEffect, useState, ReactNode } from "react";
import { Header } from "@/components/Header/Header";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function HeaderWithPadding({ children }: { children: ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
      <main style={{ paddingTop: isDesktop ? `${headerHeight + 50}px` : 0 }}>
        {children}
      </main>
    </>
  );
}
