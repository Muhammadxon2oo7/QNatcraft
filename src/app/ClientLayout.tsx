"use client";

import { useEffect, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientLayout({ children }: Props) {
  useEffect(() => {
    // 🌐 Service Worker ro'yxatdan o'tkazish
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker registered!"))
        .catch((err) => console.error("❌ Service Worker registration failed:", err));
    }
  }, []);

  return <>{children}</>;
}
