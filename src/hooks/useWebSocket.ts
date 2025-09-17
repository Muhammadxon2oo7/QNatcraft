import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/constants";

interface WebSocketHookProps {
  chatId: number;
  token: string | null;
  onMessage: (data: any) => void;
  onError?: (error: any) => void;
}

export const useWebSocket = ({ chatId, token, onMessage, onError }: WebSocketHookProps) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;

  const connect = useCallback(() => {
    if (!token || !chatId || reconnectAttempts.current >= maxReconnectAttempts) return;

    const websocket = new WebSocket(`${BASE_URL.replace("https", "wss")}/ws/chat/${chatId}/?token=${token}`);

    websocket.onopen = () => {
      console.log(`✅ WebSocket connected for chat ${chatId}`);
      reconnectAttempts.current = 0;
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WebSocket error:", data.error);
        toast.error(data.error);
        if (data.error.includes("token") || data.error.includes("autentifikatsiya")) {
          onError?.(data.error);
        }
        return;
      }
      onMessage(data);
    };

    websocket.onclose = (event) => {
      console.warn(`⚠️ WebSocket closed for chat ${chatId}, code: ${event.code}`);
      if (event.code === 4001 || event.code === 4003) {
        toast.error("Chatga kirish huquqingiz yo‘q.");
        onError?.(event);
        return;
      }
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.current += 1;
          console.log(`Reconnecting attempt ${reconnectAttempts.current} for chat ${chatId}`);
          connect();
        }, reconnectInterval);
      } else {
        toast.error("Chatga ulanishda xatolik. Iltimos, keyinroq urinib ko‘ring.");
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      onError?.(error);
    };

    setWs(websocket);
  }, [chatId, token, onMessage, onError]);

  useEffect(() => {
    if (chatId) {
      connect();
      return () => {
        ws?.close();
        setWs(null);
      };
    }
  }, [chatId, connect]);

  return ws;
};