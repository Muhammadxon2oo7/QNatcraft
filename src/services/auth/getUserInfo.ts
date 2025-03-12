
// "use server";

// import fetchWrapper from "../fetchwrapper"; 

// export const getUserInfo = async () => {
//   try {
   
//     const userData = await fetchWrapper("/accounts/user-profile/", {
//       method: "GET",
//     });
//     return userData;
//   } catch (error: any) {
//     console.error("Foydalanuvchi maʼlumotlarini olishda xatolik:", error.message);
//     throw new Error("Foydalanuvchi maʼlumotlarini olishda xatolik yuz berdi");
//   }
// };


// services/auth/getUserInfo.ts
// services/auth/getUserInfo.ts
"use server";

import fetchWrapper from "../fetchwrapper";

interface UserData {
  id: number;
  user_email: string;
  user_first_name: string;
  profession: string | null;
  bio: string | null;
}

export async function getUserInfoAction(): Promise<UserData | null> {
  try {
    const data = await fetchWrapper<UserData[]>("accounts/profiles/", {
      method: "GET",
      credentials: "include",
    });

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Foydalanuvchi maʼlumotlarini olishda xatolik:", error);
    return null;
  }
}