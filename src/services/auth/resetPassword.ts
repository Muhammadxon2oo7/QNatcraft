"use server";

export const resetPassword = async (data: { email: string; code: string; newPassword: string }) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/password-reset/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Parolni tiklashda xato yuz berdi");
  }

  return await res.json();
};
