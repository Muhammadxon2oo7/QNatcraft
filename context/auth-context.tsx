"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import fetchWrapper from "@/services/fetchwrapper";
import { useRouter } from "next/navigation";

const BACKEND_URL = "https://qqrnatcraft.uz";

interface Profession {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ProfileData {
  id: number | string;
  user_email: string;
  user_first_name: string;
  phone_number?: string | null;
  address?: string | null;
  profile_image?: string | null;
  experience?: number | null;
  mentees?: number | null;
  profession?: Profession | null;
  bio?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  award?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: number | string;
}

interface UserData {
  user_first_name: ReactNode;
  email: string;
  message?: string;
  profile: ProfileData;
  user_id: number | string;
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
      setUser(response);
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