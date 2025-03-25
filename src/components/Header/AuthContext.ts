import axios from "axios";

const BACKEND_URL = "https://qqrnatcraft.uz";

// Cookie-dan token olish funksiyasi
const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return decodeURIComponent(cookieValue);
  }
  return null;
};

export const fetchProfileData = async () => {
  try {
    const accessToken = getCookie("accessToken"); // Cookie-dan tokenni olish
    console.log(accessToken);
    
    if (!accessToken) throw new Error("Access token not found");

    const response = await axios.get(`${BACKEND_URL}/accounts/profile/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
};
