// auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import fetchWrapper from "@/services/fetchwrapper";
import { useRouter } from "next/navigation";

const BACKEND_URL = "https://qqrnatcraft.uz";

interface UserData {
  mentees: string;
  phone_number: string;
  address: string;
  profile_image: string;
  id: number;
  user_first_name: string;
  user_email: string;
  phone?: string;
  location?: string;
  experience?: string;
  followers?: string;
  achievements?: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return decodeURIComponent(cookieValue);
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    const token = getCookie("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetchWrapper<UserData>("/accounts/profile/me/", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response); // response[0] emas, to'g'ridan-to'g'ri obyekt
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await fetchWrapper(`${BACKEND_URL}/accounts/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${getCookie("accessToken") || ""}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      const deleteCookie = (name: string, path: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict;`;
      };
      deleteCookie("accessToken", "/");
      deleteCookie("refreshToken", "/");
      deleteCookie("accessToken", "/accounts");
      deleteCookie("refreshToken", "/accounts");

      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};