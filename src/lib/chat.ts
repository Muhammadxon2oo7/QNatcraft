// chat.ts
export interface Chat {
    id: number;
    product: { id: number; name: string };
    seller: { id: number; email: string; first_name: string; profile: { profile_image?: string } };
    buyer: { id: number; email: string; first_name: string; profile: { profile_image?: string } };
    created_at: string;
    updated_at: string;
    messages: Message[];
  }
  
  export interface Message {
    id: number;
    chat: number;
    sender: { id: number; email: string; first_name: string };
    content?: string;
    images: { id: number; image: string }[];
    voice?: string;
    reply_to?: number;
    reactions: { id: number; user: { id: number }; reaction: string; created_at: string }[];
    created_at: string;
    updated_at: string;
    is_read: boolean;
  }
  
  const CHAT_API_BASE_URL = "https://qqrnatcraft.uz/chat/chats/";
  
  const getHeaders = (token: string) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });
  
  export const getChats = async (token: string): Promise<Chat[]> => {
    const response = await fetch(CHAT_API_BASE_URL, {
      method: "GET",
      headers: getHeaders(token),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chatlarni olishda xatolik:", errorText);
      throw new Error("Chatlarni olishda xatolik");
    }
  
    return response.json();
  };
  
  export const createChat = async (productId: number, token: string): Promise<Chat> => {
    const response = await fetch(CHAT_API_BASE_URL, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ product: productId }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server javobi:", errorText);
      throw new Error("Chat yaratishda xatolik");
    }
  
    const data = await response.json();
    console.log("Muvaffaqiyatli javob:", data);
    return data;
  };