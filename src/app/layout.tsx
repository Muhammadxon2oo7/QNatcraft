import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { HeaderWithPadding } from "@/components/HeaderWithPadding/HeaderWithPadding";
import ClientLayout from "@/components/ClientLayout";
import { AuthProvider } from "../../context/auth-context";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "SmartQnatCraft",
  description: "SmartQnatCraft",
  manifest: "/manifest.json", // ✅ BU YERGA QO'SHILADI
  themeColor: "#000000", // ✅ Brauzer rangini belgilaydi (mobil Chrome bar)
};


type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <meta name="algolia-site-verification"  content="6E50DF5984B38F60" />


         {/* iOS support uchun meta teglar */}
              <link rel="apple-touch-icon" href="/icons/icon-192.png" />
              <meta name="apple-mobile-web-app-capable" content="yes" />
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
    
      
      <body style={{ fontFamily: "'Raleway', sans-serif" }} >
        <AuthProvider>
        <ClientLayout >
        <NextIntlClientProvider messages={messages}>
          <HeaderWithPadding>{children}</HeaderWithPadding>
          <Toaster position="top-center" />
        </NextIntlClientProvider>
        </ClientLayout>
        </AuthProvider>
     
      </body>
      
    </html>
  );
}
