"use server";

import { cookies } from "next/headers";

interface LoginDataR {
  access: string;
  refresh: string;
}

export const login = async (loginData: { email: string; password: string }) => {
  // Eski cookie’larni tozalash (agar mavjud bo‘lsa)
  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  const res = await fetch("https://qqrnatcraft.uz/accounts/login/", {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    method: "POST",
    body: JSON.stringify(loginData),
    cache: "no-store", // Keshni o‘chirish
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login xatoligi: Noto‘g‘ri email yoki parol");
  }

  const data: LoginDataR = await res.json();
  console.log("Login javobi:", data); // Debugging uchun

  // Cookie’larni yangi tokenlar bilan sozlash
  cookies().set("accessToken", data.access, {
    path: "/", // Butun sayt uchun mavjud bo‘lishi
    httpOnly: true, // Xavfsizlik uchun
    secure: process.env.NODE_ENV === "production", // HTTPS’da ishlaydi (production’da)
    sameSite: "strict", // CSRF himoyasi
  });
  cookies().set("refreshToken", data.refresh, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  console.log("Cookie’lar sozlandi:", { accessToken: data.access, refreshToken: data.refresh });

  return data;
};

















// document.getElementById('login-form').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     fetch('https://qqrnatcraft.uz/accounts/login/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: email, password: password })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.access && data.refresh) {  // access va refresh token tekshirilmoqda
//             localStorage.setItem('token', data.access);  // Access tokenni saqlash
//             localStorage.setItem('refresh_token', data.refresh);  // Refresh tokenni saqlash
//             window.location.href = 'logout.html';  // Logout sahifasiga yo'naltirish
//         } else {
//             alert('Invalid login');
//         }
//     })
//     .catch(error => alert('Error:', error));
// });