
"use server";

export const verifyCode = async (email: string, code: string) => {
  try {
    const res = await fetch(`${process.env.BACKEND_BASE_URL}/accounts/password-reset-verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      throw new Error("Noto‘g‘ri tasdiqlash kodi!");
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || "Tasdiqlash jarayonida xatolik yuz berdi");
  }
};
