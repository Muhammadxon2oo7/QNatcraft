"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../context/auth-context";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Faqat quyidagi sahifalar himoyalangan
  const isProtectedRoute = ["/Xprofile", "/profile"].includes(pathname);

  useEffect(() => {
    console.log("ProtectedRoute:", { loading, user, pathname, isProtectedRoute });

    if (loading) return;

    if (isProtectedRoute && !user) {
      console.log("Redirecting to /login from ProtectedRoute");
      router.push("/login");
    }
    if (user == null) {
        console.log("Redirecting to /login from ProtectedRoute");
        router.push("/login");
      }
  }, [loading, user, isProtectedRoute, router, pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (isProtectedRoute && !user) {
    return null; // Redirect useEffect’da amalga oshirilgan
  }

  return <>{children}</>;
};

export default ProtectedRoute;