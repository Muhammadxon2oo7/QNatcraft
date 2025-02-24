
"use server";

import fetchWrapper from "../fetchwrapper"; 

export const getUserInfo = async () => {
  try {
   
    const userData = await fetchWrapper("/accounts/user-profile/", {
      method: "GET",
    });
    return userData;
  } catch (error: any) {
    console.error("Foydalanuvchi maʼlumotlarini olishda xatolik:", error.message);
    throw new Error("Foydalanuvchi maʼlumotlarini olishda xatolik yuz berdi");
  }
};
