"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  MessageSquare,
  X,
  Smile,
  Search,
  Image as ImageIcon,
  Mic,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import TypingIndicator from "@/components/chat/TypingIndicator";
import MessageBubble from "@/components/chat/MessageBubble";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useAuth } from "../../../context/auth-context";

// Interfeyslar
interface Sender {
  id: number;
  email: string;
  first_name: string;
  profile: { profile_image: string };
}

interface Message {
  id: number;
  sender: Sender;
  content?: string;
  images?: { id: number; image: string }[];
  voice?: string;
  time: string;
  isCurrentUser: boolean;
  is_read: boolean;
  reactions?: { id: number; user: Sender; reaction: string }[];
  reply_to?: { id: number; sender: Sender; content: string };
  updated_at?: string;
  created_at: string;
  isEdited?: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface Chat {
  id: number;
  contact: Contact;
  messages: Message[];
}

// API xizmati
const apiService = {
  fetchChats: async (token: string | null): Promise<Chat[]> => {
    const response = await fetch("https://qqrnatcraft.uz/chat/chats/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Chatlarni yuklashda xato");
    return response.json();
  },

  fetchMessages: async (chatId: number, token: string | null): Promise<Message[]> => {
    const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Xabarlarni yuklashda xato");
    return response.json();
  },

  sendMessage: async (chatId: number, formData: FormData, token: string | null, isEdit = false, messageId?: number) => {
    const url = isEdit
      ? `https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/edit/`
      : `https://qqrnatcraft.uz/chat/chats/${chatId}/send-message/`;
    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    return response.json();
  },

  deleteMessage: async (chatId: number, messageId: number, token: string | null) => {
    const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Xabarni o'chirishda xato");
  },

  addReaction: async (chatId: number, messageId: number, reaction: string, token: string | null) => {
    const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/react/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction }),
    });
    if (!response.ok) throw new Error("Reaktsiya qo'shishda xato");
  },
};

// Asosiy komponent
const ChatPage: React.FC = () => {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{ images: string[]; index: number } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentUserId = user?.user_id;
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  // Ma'lumotlarni formatlash
  const formatChatData = useCallback(
    (data: any[], currentUserId: number | string): Chat[] =>
      data.map((chat) => ({
        id: chat.id,
        contact: {
          id: chat.seller.id === currentUserId ? chat.buyer.id : chat.seller.id,
          name: `${chat.seller.id === currentUserId ? chat.buyer.first_name : chat.seller.first_name}`,
          avatar:
            chat.seller.id === currentUserId
              ? chat.buyer.profile.profile_image
              : chat.seller.profile.profile_image,
          status: "online",
        },
        messages: chat.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          images: msg.images,
          voice: msg.voice,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isCurrentUser: msg.sender.id === currentUserId,
          is_read: msg.is_read,
          reactions: msg.reactions,
          reply_to: msg.reply_to
            ? { id: msg.reply_to, sender: msg.reply_to?.sender || {}, content: msg.reply_to?.content || "" }
            : undefined,
          updated_at: msg.updated_at,
          created_at: msg.created_at,
          isEdited: msg.updated_at !== msg.created_at,
        })),
      })),
    []
  );

  const formatMessagesData = useCallback(
    (data: any[], currentUserId: number | string): Message[] =>
      data.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        images: msg.images,
        voice: msg.voice,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: msg.sender.id === currentUserId,
        is_read: msg.is_read,
        reactions: msg.reactions,
        reply_to: msg.reply_to
          ? { id: msg.reply_to, sender: msg.reply_to?.sender || {}, content: msg.reply_to?.content || "" }
          : undefined,
        updated_at: msg.updated_at,
        created_at: msg.created_at,
        isEdited: msg.updated_at !== msg.created_at,
      })),
    []
  );

  // Ma'lumotlarni yuklash
  const loadChats = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const data = await apiService.fetchChats(token);
      setChats(formatChatData(data, currentUserId!));
    } catch (error) {
      console.error("Chatlarni yuklashda xato:", error);
    }
  }, [user, getToken, formatChatData, currentUserId]);

  const loadMessages = useCallback(
    async (chatId: number) => {
      try {
        const token = await getToken();
        const data = await apiService.fetchMessages(chatId, token);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId ? { ...chat, messages: formatMessagesData(data, currentUserId!) } : chat
          )
        );
        scrollToBottom();
      } catch (error) {
        console.error("Xabarlarni yuklashda xato:", error);
      }
    },
    [getToken, formatMessagesData, currentUserId]
  );

  // Xabar yuborish
  const handleSendMessage = useCallback(async () => {
    if (!selectedChatId || (!inputValue.trim() && !selectedImages.length)) return;

    let formattedText = inputValue;
    if (activeFormat && inputValue) {
      formattedText = `<${activeFormat}>${inputValue}</${activeFormat}>`;
    }

    const token = await getToken();
    const formData = new FormData();
    if (formattedText) formData.append("content", formattedText);
    if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
    selectedImages.forEach((img) => formData.append("images", img));

    try {
      await apiService.sendMessage(selectedChatId, formData, token, !!editingMessage, editingMessage?.id);
      setInputValue("");
      setSelectedImages([]);
      setReplyingTo(null);
      setEditingMessage(null);
      setActiveFormat(null);
      loadMessages(selectedChatId);
    } catch (error) {
      console.error("Xabar yuborishda xato:", error);
    }
  }, [selectedChatId, inputValue, selectedImages, replyingTo, editingMessage, activeFormat, getToken, loadMessages]);

  // Ovozli xabar
  const sendAudioMessage = useCallback(
    async (audioBlob: Blob) => {
      if (!selectedChatId) return;
      const token = await getToken();
      const formData = new FormData();
      formData.append("voice", audioBlob, "audio.webm");

      try {
        await apiService.sendMessage(selectedChatId, formData, token);
        loadMessages(selectedChatId);
      } catch (error) {
        console.error("Ovozli xabar yuborishda xato:", error);
      }
    },
    [selectedChatId, getToken, loadMessages]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        sendAudioMessage(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Ovoz yozishda xato:", error);
      alert("Ovozli xabar yozib olishda xatolik yuz berdi!");
    }
  }, [sendAudioMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // Boshqa funksiyalar
  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!selectedChatId) return;
      try {
        const token = await getToken();
        await apiService.deleteMessage(selectedChatId, messageId, token);
        loadMessages(selectedChatId);
      } catch (error) {
        console.error("Xabarni o'chirishda xato:", error);
      }
    },
    [selectedChatId, getToken, loadMessages]
  );

  const addReaction = useCallback(
    async (messageId: number, reaction: string) => {
      if (!selectedChatId) return;
      try {
        const token = await getToken();
        await apiService.addReaction(selectedChatId, messageId, reaction, token);
        loadMessages(selectedChatId);
      } catch (error) {
        console.error("Reaktsiya qo'shishda xato:", error);
      }
    },
    [selectedChatId, getToken, loadMessages]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToMessage = useCallback((messageId: number) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight");
      setTimeout(() => messageElement.classList.remove("highlight"), 2000);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => file);
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setInputValue(message.content || "");
    setSelectedImages([]);
    inputRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(selectedImages);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setSelectedImages(reorderedImages);
  };

  const handlePrevImage = () => {
    if (fullscreenImage && fullscreenImage.index > 0) {
      setFullscreenImage({ images: fullscreenImage.images, index: fullscreenImage.index - 1 });
    }
  };

  const handleNextImage = () => {
    if (fullscreenImage && fullscreenImage.index < fullscreenImage.images.length - 1) {
      setFullscreenImage({ images: fullscreenImage.images, index: fullscreenImage.index + 1 });
    }
  };

  // Effectlar
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
      const typingInterval = setInterval(() => {
        setIsTyping(Math.random() > 0.7);
      }, 5000);
      return () => clearInterval(typingInterval);
    }
  }, [selectedChatId, loadMessages]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };
    chatContainerRef.current?.addEventListener("scroll", handleScroll);
    return () => chatContainerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMessages = selectedChat?.messages.filter((msg) =>
    msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(chats);
  

  const BASE_URL = "https://qqrnatcraft.uz";
  const PLACEHOLDER_IMAGE = "/placeholder.jpg";
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="flex flex-col w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg sm:text-xl font-semibold">Xabarlar</h2>
          </div>
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                  selectedChatId === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedChatId(chat.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image
                  src={chat.contact.avatar || "/chat/profile.png"}
                  alt={chat.contact.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm sm:text-base">{chat.contact.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {chat.messages[chat.messages.length - 1]?.content || "Xabar yo'q"}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {selectedChat ? (
            <>
              <div className="p-4 border-b bg-white flex items-center justify-between flex-wrap">
                <div className="flex items-center">
                  <Image
                    src={selectedChat.contact.avatar || "/chat/profile.png"}
                    alt={selectedChat.contact.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{selectedChat.contact.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {selectedChat.contact.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Xabarni qidirish..."
                    className="border rounded-lg px-2 py-1 text-xs sm:text-sm w-full sm:w-auto"
                  />
                  <Button variant="ghost" size="sm">
                    <Search size={20} />
                  </Button>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {isTyping && <TypingIndicator />}
                <AnimatePresence>
                  {(searchQuery ? filteredMessages : selectedChat.messages)?.map((message) => (
                    <div id={`message-${message.id}`} key={message.id}>
                      <MessageBubble
                        message={message}
                        onReply={setReplyingTo}
                        onEdit={handleEditMessage}
                        onDelete={deleteMessage}
                        onReact={addReaction}
                        onScrollToMessage={scrollToMessage}
                        onImageClick={setFullscreenImage}
                        currentUser={currentUserId!}
                      />
                    </div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
                    <p className="text-xs sm:text-sm">
                      Replying to {replyingTo.sender.first_name}: {replyingTo.content}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                      <X size={16} />
                    </Button>
                  </div>
                )}
                {selectedImages.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          className="mb-2 flex flex-wrap gap-2"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {selectedImages.map((img, idx) => (
                           <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
                           {(provided) => (
                             <div
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               style={provided.draggableProps.style as React.CSSProperties}
                               className="relative"
                             >
                               <img
                                 src={URL.createObjectURL(img)}
                                 alt={`Preview ${idx}`}
                                 className="max-w-[100px] rounded-lg"
                               />
                               <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => removeImage(idx)}
                                 className="absolute top-0 right-0 p-1"
                               >
                                 <X size={12} />
                               </Button>
                             </div>
                           )}
                         </Draggable>
                         
                          
                          ))}
                          {provided.placeholder}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
               
                <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
                  <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={20} />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button variant="ghost" size="sm" onClick={isRecording ? stopRecording : startRecording}>
                    <Mic size={20} className={isRecording ? "text-red-500" : ""} />
                  </Button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Xabar yozing yoki rasmni bu yerga torting..."
                    className="flex-1 bg-transparent outline-none px-3 text-xs sm:text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={handleSendMessage}>
                    <Send size={20} />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 right-4 z-10">
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                    </div>
                  )}
                </div>
                {showScrollButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-4 rounded-full p-2"
                  >
                    <ChevronDown size={20} />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-sm sm:text-base">Chatni tanlang</p>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Image Modal */}
        {fullscreenImage && fullscreenImage.images && fullscreenImage.index >= 0 && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative">
      <img
        src={getImageUrl(fullscreenImage.images[fullscreenImage.index])}
        alt="Fullscreen"
        className="max-w-full max-h-[90vh] rounded-lg"
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setFullscreenImage(null)}
        className="absolute top-2 right-2 text-white"
      >
        <X size={24} />
      </Button>
      {fullscreenImage.index > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevImage}
          className="absolute top-1/2 left-2 text-white"
        >
          <ChevronLeft size={24} />
        </Button>
      )}
      {fullscreenImage.index < fullscreenImage.images.length - 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextImage}
          className="absolute top-1/2 right-2 text-white"
        >
          <ChevronRight size={24} />
        </Button>
      )}
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ChatPage;