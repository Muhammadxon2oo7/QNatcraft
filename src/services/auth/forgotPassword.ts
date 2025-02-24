"use server";

export const forgotPassword = async (email: string) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/password-reset-request/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.email);
  }

  return await res.json();
};
