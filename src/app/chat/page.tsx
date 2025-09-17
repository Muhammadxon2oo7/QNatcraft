"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/auth-context";
import { toast } from "sonner";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import FullscreenImageViewer from "./FullscreenImageViewer";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Chat, Message } from "./types";
import { BASE_URL } from "@/utils/constants";

const ChatPage: React.FC = () => {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<{ images: string[]; index: number } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = user ? Number(user.user_id) : undefined;

  const sortChats = useCallback((chatsList: Chat[]) => {
    return chatsList.sort((a, b) => {
      const aLastTime = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].created_at).getTime() : 0;
      const bLastTime = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].created_at).getTime() : 0;
      return bLastTime - aLastTime;
    });
  }, []);

  const loadChats = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/chat/chats/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load chats");
      const data = await response.json();

      const newChats: Chat[] = data.map((chat: any) => {
        const isSellerCurrentUser = chat.seller.id === currentUserId;
        const contactUser = isSellerCurrentUser ? chat.buyer : chat.seller;

        return {
          id: chat.id,
          contact: {
            id: contactUser.id,
            name: contactUser.first_name,
            avatar: contactUser.profile.profile_image,
            status: "online",
          },
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isCurrentUser: msg.sender.id === currentUserId,
            is_edited: !!msg.is_edited,
            highlight: false,
          })),
          unreadCount: 0, // Badge olib tashlandi
        };
      });

      setChats(sortChats(newChats));
      const activeChatId = localStorage.getItem("activeChatId");
      if (activeChatId && data.some((chat: any) => chat.id === parseInt(activeChatId))) {
        setSelectedChatId(parseInt(activeChatId));
      }
    } catch (error) {
      toast.error("Chatlarni yuklashda xatolik yuz berdi.");
      console.error("Error loading chats:", error);
    }
  }, [user, currentUserId, getToken, sortChats]);

  const handleWebSocketMessage = useCallback(
    (data: any) => {
      if (data.type === "chat_message") {
        const { action, message, message_id } = data;
        setChats((prev) => {
          const updatedChats = prev.map((chat) => {
            if (chat.id !== message?.chat_id && action !== "delete" && chat?.id !== selectedChatId) return chat;

            let updatedMessages = [...chat.messages];

            switch (action) {
              case "new":
              case "reply":
                const newMessage: Message = {
                  ...message,
                  time: new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  isCurrentUser: message.sender.id === currentUserId,
                  is_edited: !!message.is_edited,
                  images: message.images || [],
                  content: message.content || null,
                  reactions: message.reactions || [],
                  reply_to: message.reply_to || null,
                  is_read: selectedChatId === chat.id,
                  highlight: true,
                };
                updatedMessages = [...updatedMessages, newMessage];
                break;
              case "edit":
                updatedMessages = updatedMessages.map((msg) =>
                  msg.id === message.id
                    ? {
                        ...msg,
                        content: message.content || null,
                        images: message.images || [],
                        time: new Date(message.updated_at || message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        is_edited: true,
                        reactions: message.reactions || [],
                        reply_to: message.reply_to || null,
                      }
                    : msg
                );
                break;
              case "delete":
                updatedMessages = updatedMessages.filter((msg) => msg.id !== message_id);
                break;
              case "reaction_add":
              case "reaction_remove":
                updatedMessages = updatedMessages.map((msg) =>
                  msg.id === message.id ? { ...msg, reactions: message.reactions || [] } : msg
                );
                break;
            }

            return {
              ...chat,
              messages: updatedMessages,
              unreadCount: 0, // Badge olib tashlandi
            };
          });
          return sortChats(updatedChats);
        });
      }
    },
    [selectedChatId, currentUserId, sortChats]
  );

  const handleWebSocketError = useCallback(() => {
    toast.error("Chat ulanishida xatolik. Tizimga qayta kiring.");
    setSelectedChatId(null);
    loadChats();
  }, [loadChats]);

  const wsConnection = useWebSocket({
    chatId: selectedChatId || 0,
    token: user?.token || null,
    onMessage: handleWebSocketMessage,
    onError: handleWebSocketError,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (selectedChatId) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                unreadCount: 0,
                messages: chat.messages.map((msg) => ({
                  ...msg,
                  is_read: true,
                })),
              }
            : chat
        )
      );
      localStorage.setItem("activeChatId", selectedChatId.toString());
    }
  }, [selectedChatId]);

  const handleBackToList = () => {
    setSelectedChatId(null);
    setReplyingTo(null);
    setEditingMessage(null);
    setSearchQuery("");
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="flex w-full max-w-[90rem] h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex-col md:flex-row transition-all duration-300">
        {(!isMobile || !selectedChatId) && (
          <ChatList chats={chats} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
        )}
        {(!isMobile || selectedChatId) && selectedChat && currentUserId !== undefined ? (
          <div className="flex-1 flex flex-col">
            <ChatHeader
              contact={selectedChat.contact}
              onBack={isMobile ? handleBackToList : undefined}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <MessageList
              messages={selectedChat.messages}
              currentUserId={currentUserId}
              wsConnection={wsConnection}
              messagesEndRef={messagesEndRef}
              setFullscreenImage={setFullscreenImage}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              searchQuery={searchQuery}
            />
            <MessageInput
              chatId={selectedChatId!}
              wsConnection={wsConnection}
              getToken={getToken}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
            />
          </div>
        ) : (
          !isMobile && (
            <div className="flex-1 flex items-center justify-center text-gray-600 font-medium text-lg">
              Chatni tanlang yoki foydalanuvchi tizimga kirmagan
            </div>
          )
        )}
      </div>
      {fullscreenImage && (
        <FullscreenImageViewer
          images={fullscreenImage.images}
          index={fullscreenImage.index}
          onClose={() => setFullscreenImage(null)}
          onPrev={() =>
            setFullscreenImage({
              ...fullscreenImage,
              index: fullscreenImage.index - 1,
            })
          }
          onNext={() =>
            setFullscreenImage({
              ...fullscreenImage,
              index: fullscreenImage.index + 1,
            })
          }
        />
      )}
    </div>
  );
};

export default ChatPage;