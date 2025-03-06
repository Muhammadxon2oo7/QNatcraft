"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ClientLayoutProps {
  children: React.ReactNode;
  user?: any; // Agar user bo'lsa, uning turini aniqlash mumkin
  userName?: string;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="client-layout">
        {children}
      </div>
    </QueryClientProvider>
  );
};

export default ClientLayout;
