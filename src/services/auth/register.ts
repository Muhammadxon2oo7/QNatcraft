"use server";

export interface RegisterType {
  first_name: string;
  email: string;
  password: string;
}

export const register = async (registerData: RegisterType) => {
  const res = await fetch("https://qqrnatcraft.uz/accounts/register/", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(registerData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }
  const data = await res.json();
  return data;
};
