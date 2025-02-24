"use server";

export const resetPassword = async (data: { email: string; new_password: string }) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/password-reset-confirm/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      new_password: data.new_password,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Parolni tiklashda xato yuz berdi");
  }

  return await res.json();
};
