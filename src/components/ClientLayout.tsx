"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: any;
  userName?: string;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const queryClient = new QueryClient();

  useEffect(() => {
    // React Query mutatsiyalarini offline saqlash va worker bilan sync qilish uchun
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.log("❌ Service Worker registration failed", err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="client-layout">{children}</div>

      {/* React Query devtools faqat developmentda ochiladi */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ClientLayout;
