"use server";

export interface ConfirmEmailType {
  confirmation_code: string;
  email: string;
}

export const confirmEmail = async ({ confirmation_code, email }: ConfirmEmailType) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/confirm-email/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ confirmation_code, email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Emailni tasdiqlashda xato yuz berdi");
  }

  const data = await res.json();
  return data;
};
