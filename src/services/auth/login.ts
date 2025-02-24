"use server";

import { cookies } from "next/headers";

interface LoginDataR {
  access: string;
  refresh: string;
}

export const login = async (loginData: { email: string; password: string }) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/login/", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    const err = await res.json(); 
    throw new Error(err.message);
  }

  const data: LoginDataR = await res.json();
  cookies().set('accessToken', data.access);
  cookies().set('refreshToken', data.refresh);

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