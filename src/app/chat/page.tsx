// "use client";

// import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Send, MessageSquare, X, Smile, Search, Image as ImageIcon, Mic, Plus, ChevronDown, ChevronLeft, ChevronRight, RefreshCw,
// } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// import MessageBubble from "@/components/chat/MessageBubble";
// import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
// import { useAuth } from "../../../context/auth-context";

// interface Sender {
//   id: number;
//   email: string;
//   first_name: string;
//   profile: { profile_image: string };
// }

// interface Message {
//   id: number;
//   sender: Sender;
//   content?: string;
//   images?: { id: number; image: string }[];
//   voice?: string;
//   time: string;
//   isCurrentUser: boolean;
//   is_read: boolean;
//   reactions?: { id: number; user: Sender; reaction: string }[];
//   reply_to?: { id: number; sender: Sender; content: string };
//   updated_at?: string;
//   created_at: string;
//   isEdited?: boolean;
// }

// interface Contact {
//   id: number;
//   name: string;
//   avatar: string;
//   status: string;
// }

// interface Chat {
//   id: number;
//   contact: Contact;
//   messages: Message[];
// }

// const apiService = {
//   fetchChats: async (token: string | null): Promise<Chat[]> => {
//     const response = await fetch("https://qqrnatcraft.uz/chat/chats/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!response.ok) throw new Error("Chatlarni yuklashda xato");
//     return response.json();
//   },

//   fetchMessages: async (chatId: number, token: string | null): Promise<Message[]> => {
//     const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!response.ok) throw new Error("Xabarlarni yuklashda xato");
//     return response.json();
//   },

//   sendMessage: async (chatId: number, formData: FormData, token: string | null, isEdit = false, messageId?: number) => {
//     const url = isEdit
//       ? `https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/edit/`
//       : `https://qqrnatcraft.uz/chat/chats/${chatId}/send-message/`;
//     const response = await fetch(url, {
//       method: isEdit ? "PUT" : "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });
//     if (!response.ok) throw new Error("Xabar yuborishda xato");
//     return response.json();
//   },

//   deleteMessage: async (chatId: number, messageId: number, token: string | null) => {
//     const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/delete/`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!response.ok) throw new Error("Xabarni o'chirishda xato");
//   },

//   addReaction: async (chatId: number, messageId: number, reaction: string, token: string | null) => {
//     const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/react/`, {
//       method: "POST",
//       headers: { 
//         Authorization: `Bearer ${token}`, 
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({ reaction }),
//     });
//     if (!response.ok) throw new Error("Reaktsiya qo'shishda xato");
//     return response.json();
//   },

//   removeReaction: async (chatId: number, messageId: number, token: string | null) => {
//     const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${chatId}/messages/${messageId}/react/remove/`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!response.ok) throw new Error("Reaktsiya o'chirishda xato");
//   },
// };

// // Yordamchi funksiyalar
// const formatTime = (date: string) =>
//   new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const getImageUrl = (imagePath: string, baseUrl: string, placeholder: string) =>
//   imagePath ? (imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`) : placeholder;

// const getFormattedDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);

//   if (date.toDateString() === today.toDateString()) return "Bugun";
//   if (date.toDateString() === yesterday.toDateString()) return "Kecha";

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}.${month}.${year}`;
// };

// const groupMessagesByDate = (messages: Message[]) => {
//   const grouped: { [key: string]: Message[] } = {};
//   messages.forEach((msg) => {
//     const dateKey = getFormattedDate(msg.created_at);
//     if (!grouped[dateKey]) grouped[dateKey] = [];
//     grouped[dateKey].push(msg);
//   });
//   return grouped;
// };

// // Asosiy komponent
// const ChatPage: React.FC = () => {
//   const { user, getToken } = useAuth();
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [editingMessage, setEditingMessage] = useState<Message | null>(null);
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [activeFormat, setActiveFormat] = useState<string | null>(null);
//   const [fullscreenImage, setFullscreenImage] = useState<{ images: string[]; index: number } | null>(null);
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [refreshSuccess, setRefreshSuccess] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   const currentUserId = user?.user_id;
//   const selectedChat = useMemo(() => chats.find((chat) => chat.id === selectedChatId) || null, [chats, selectedChatId]);
//   const BASE_URL = "https://qqrnatcraft.uz";
//   const PLACEHOLDER_IMAGE = "/placeholder.jpg";

//   // Ma'lumotlarni formatlash
//   const formatChatData = useCallback((data: any[], userId: number): Chat[] =>
//     data.map((chat) => {
//       const isSellerCurrentUser = chat.seller.id === userId;
//       const contactUser = isSellerCurrentUser ? chat.buyer : chat.seller;
//       return {
//         id: chat.id,
//         contact: {
//           id: contactUser.id,
//           name: contactUser.first_name,
//           avatar: contactUser.profile.profile_image,
//           status: "online",
//         },
//         messages: chat.messages.map((msg: any) => ({
//           ...msg,
//           time: formatTime(msg.created_at),
//           isCurrentUser: msg.sender.id === userId,
//           isEdited: !!msg.is_edited,
//         })),
//       };
//     }), []);

//   const formatMessagesData = useCallback((data: any[], userId: number): Message[] =>
//     data.map((msg) => ({
//       ...msg,
//       time: formatTime(msg.created_at),
//       isCurrentUser: msg.sender.id === userId,
//       isEdited: !!msg.is_edited,
//     })), []);

//   // Ma'lumotlarni yuklash
//   const loadChats = useCallback(async () => {
//     if (!user) return;
//     try {
//       const token = await getToken();
//       const data = await apiService.fetchChats(token);
//       setChats(formatChatData(data, currentUserId!));
//     } catch (error) {
//       console.error("Chatlarni yuklashda xato:", error);
//     }
//   }, [user, getToken, formatChatData, currentUserId]);

//   const loadMessages = useCallback(async (chatId: number) => {
//     try {
//       const token = await getToken();
//       const data = await apiService.fetchMessages(chatId, token);
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === chatId ? { ...chat, messages: formatMessagesData(data, currentUserId!) } : chat
//         )
//       );
//     } catch (error) {
//       console.error("Xabarlarni yuklashda xato:", error);
//     }
//   }, [getToken, formatMessagesData, currentUserId]);

//   // Chat oxiriga scroll qilish (oldinga ko'chirildi)
//   const scrollToBottom = useCallback(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     } else {
//       console.error("messagesEndRef mavjud emas");
//     }
//   }, []);

//   // Yangi xabarlarni qo'lda yangilash funksiyasi
//   const refreshMessages = useCallback(async () => {
//     if (!selectedChatId) return;
//     setIsRefreshing(true);
//     try {
//       await loadMessages(selectedChatId);
//       setRefreshSuccess(true);
//       setTimeout(() => setRefreshSuccess(false), 2000);
//       requestAnimationFrame(() => scrollToBottom());
//     } catch (error) {
//       console.error("Xabarlarni yangilashda xato:", error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, [selectedChatId, loadMessages, scrollToBottom]);

//   // Xabar yuborish va tahrirlash
//   const handleSendMessage = useCallback(async () => {
//     if (!selectedChatId || (!inputValue.trim() && !selectedImages.length)) return;

//     const token = await getToken();
//     const formData = new FormData();
//     const formattedText = activeFormat && inputValue ? `<${activeFormat}>${inputValue}</${activeFormat}>` : inputValue;
//     if (formattedText) formData.append("content", formattedText);
//     if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
//     selectedImages.forEach((img) => formData.append("images", img));

//     let tempId: number | null = null;
//     let tempMessage: Message | null = null;

//     if (editingMessage) {
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? {
//                 ...chat,
//                 messages: chat.messages.map((msg) =>
//                   msg.id === editingMessage.id
//                     ? {
//                         ...msg,
//                         content: formattedText,
//                         images: selectedImages.length ? selectedImages.map((img, idx) => ({ id: idx, image: URL.createObjectURL(img) })) : msg.images,
//                         isEdited: true,
//                         updated_at: new Date().toISOString(),
//                         time: formatTime(new Date().toISOString()),
//                       }
//                     : msg
//                 ),
//               }
//             : chat
//         )
//       );
//     } else {
//       tempId = Date.now();
//       tempMessage = {
//         id: tempId,
//         sender: {
//           id: currentUserId!,
//           email: user?.email || "",
//           first_name: user?.first_name || "User",
//           profile: { profile_image: user?.profile?.profile_image || "" },
//         },
//         content: formattedText,
//         images: selectedImages.map((img, idx) => ({ id: idx, image: URL.createObjectURL(img) })),
//         time: formatTime(new Date().toISOString()),
//         isCurrentUser: true,
//         is_read: false,
//         reactions: [],
//         created_at: new Date().toISOString(),
//         ...(replyingTo ? { reply_to: replyingTo } : {}),
//       };

//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? { ...chat, messages: [...chat.messages, tempMessage!] }
//             : chat
//         )
//       );
//       requestAnimationFrame(() => scrollToBottom());
//     }

//     setInputValue("");
//     setSelectedImages([]);
//     setReplyingTo(null);
//     setEditingMessage(null);
//     setActiveFormat(null);

//     try {
//       const serverMessage = await apiService.sendMessage(selectedChatId, formData, token, !!editingMessage, editingMessage?.id);

//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? {
//                 ...chat,
//                 messages: chat.messages.map((msg) =>
//                   editingMessage && msg.id === editingMessage.id
//                     ? {
//                         ...serverMessage,
//                         time: formatTime(serverMessage.updated_at || serverMessage.created_at),
//                         isCurrentUser: true,
//                         isEdited: true,
//                       }
//                     : tempMessage && msg.id === tempId
//                     ? {
//                         ...serverMessage,
//                         time: formatTime(serverMessage.created_at),
//                         isCurrentUser: true,
//                         isEdited: !!serverMessage.is_edited,
//                       }
//                     : msg
//                 ),
//               }
//             : chat
//         )
//       );

//       if (!editingMessage) {
//         requestAnimationFrame(() => scrollToBottom());
//       }
//     } catch (error) {
//       console.error("Xabar yuborishda xato:", error);
//       await loadMessages(selectedChatId);
//       if (!editingMessage) scrollToBottom();
//     }
//   }, [selectedChatId, inputValue, selectedImages, replyingTo, editingMessage, activeFormat, getToken, currentUserId, user, loadMessages, scrollToBottom]);

//   // Ovozli xabar
//   const sendAudioMessage = useCallback(async (audioBlob: Blob) => {
//     if (!selectedChatId) return;
//     const token = await getToken();
//     const formData = new FormData();
//     formData.append("voice", audioBlob, "audio.webm");

//     const tempId = Date.now();
//     const tempMessage: Message = {
//       id: tempId,
//       sender: {
//         id: currentUserId!,
//         email: user?.email || "",
//         first_name: user?.first_name || "User",
//         profile: { profile_image: user?.profile?.profile_image || "" },
//       },
//       voice: URL.createObjectURL(audioBlob),
//       time: formatTime(new Date().toISOString()),
//       isCurrentUser: true,
//       is_read: false,
//       reactions: [],
//       created_at: new Date().toISOString(),
//     };

//     setChats((prev) =>
//       prev.map((chat) =>
//         chat.id === selectedChatId
//           ? { ...chat, messages: [...chat.messages, tempMessage] }
//           : chat
//       )
//     );

//     requestAnimationFrame(() => scrollToBottom());

//     try {
//       const serverMessage = await apiService.sendMessage(selectedChatId, formData, token);
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? {
//                 ...chat,
//                 messages: chat.messages.map((msg) =>
//                   msg.id === tempId
//                     ? {
//                         ...serverMessage,
//                         time: formatTime(serverMessage.created_at),
//                         isCurrentUser: true,
//                         isEdited: !!serverMessage.is_edited,
//                       }
//                     : msg
//                 ),
//               }
//             : chat
//         )
//       );
//     } catch (error) {
//       console.error("Ovozli xabar yuborishda xato:", error);
//       await loadMessages(selectedChatId);
//       scrollToBottom();
//     }
//   }, [selectedChatId, getToken, currentUserId, user, loadMessages, scrollToBottom]);

//   const startRecording = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const chunks: Blob[] = [];
//       recorder.ondataavailable = (e) => chunks.push(e.data);
//       recorder.onstop = () => {
//         sendAudioMessage(new Blob(chunks, { type: "audio/webm" }));
//         stream.getTracks().forEach((track) => track.stop());
//       };
//       recorder.start();
//       mediaRecorderRef.current = recorder;
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Ovoz yozishda xato:", error);
//       alert("Ovozli xabar yozib olishda xatolik!");
//     }
//   }, [sendAudioMessage]);

//   const stopRecording = useCallback(() => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   }, []);

//   // Boshqa funksiyalar
//   const deleteMessage = useCallback(async (messageId: number) => {
//     if (!selectedChatId) return;
//     const token = await getToken();
//     await apiService.deleteMessage(selectedChatId, messageId, token);
//     loadMessages(selectedChatId);
//   }, [selectedChatId, getToken, loadMessages]);

//   const addReaction = useCallback(async (messageId: number, reaction: string) => {
//     if (!selectedChatId) return;
//     const token = await getToken();
//     try {
//       await apiService.addReaction(selectedChatId, messageId, reaction, token);
//       loadMessages(selectedChatId);
//     } catch (error) {
//       console.error("Reaktsiya qo'shishda xato:", error);
//     }
//   }, [selectedChatId, getToken, loadMessages]);

//   const removeReaction = useCallback(async (messageId: number) => {
//     if (!selectedChatId) return;
//     const token = await getToken();
//     try {
//       await apiService.removeReaction(selectedChatId, messageId, token);
//       loadMessages(selectedChatId);
//     } catch (error) {
//       console.error("Reaktsiya o'chirishda xato:", error);
//     }
//   }, [selectedChatId, getToken, loadMessages]);

//   const scrollToMessage = useCallback((messageId: number) => {
//     const messageElement = document.getElementById(`message-${messageId}`);
//     if (messageElement) {
//       messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
//       messageElement.classList.add("highlight");
//       setTimeout(() => messageElement.classList.remove("highlight"), 2000);
//     }
//   }, []);

//   const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
//     setSelectedImages((prev) => [...prev, ...files]);
//   }, []);

//   const handleEditMessage = useCallback((message: Message) => {
//     setEditingMessage(message);
//     setInputValue(message.content || "");
//     setSelectedImages([]);
//     inputRef.current?.focus();
//   }, []);

//   const handleEmojiSelect = useCallback((emoji: { native: string }) => {
//     setInputValue((prev) => prev + emoji.native);
//     setShowEmojiPicker(false);
//     inputRef.current?.focus();
//   }, []);

//   const removeImage = useCallback((index: number) => {
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const onDragEnd = useCallback((result: DropResult) => {
//     if (!result.destination) return;
//     const reorderedImages = Array.from(selectedImages);
//     const [movedImage] = reorderedImages.splice(result.source.index, 1);
//     reorderedImages.splice(result.destination.index, 0, movedImage);
//     setSelectedImages(reorderedImages);
//   }, [selectedImages]);

//   const handlePrevImage = useCallback(() => {
//     if (fullscreenImage && fullscreenImage.index > 0) {
//       setFullscreenImage({ images: fullscreenImage.images, index: fullscreenImage.index - 1 });
//     }
//   }, [fullscreenImage]);

//   const handleNextImage = useCallback(() => {
//     if (fullscreenImage && fullscreenImage.index < fullscreenImage.images.length - 1) {
//       setFullscreenImage({ images: fullscreenImage.images, index: fullscreenImage.index + 1 });
//     }
//   }, [fullscreenImage]);

//   // Effectlar
//   useEffect(() => {
//     loadChats();
//   }, [loadChats]);

//   useEffect(() => {
//     if (selectedChatId) {
//       loadMessages(selectedChatId);
//       const interval = setInterval(() => setIsTyping(Math.random() > 0.7), 5000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedChatId, loadMessages]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (chatContainerRef.current) {
//         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//         setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
//       }
//     };
//     const container = chatContainerRef.current;
//     container?.addEventListener("scroll", handleScroll);
//     return () => container?.removeEventListener("scroll", handleScroll);
//   }, []);

//   const filteredMessages = useMemo(() =>
//     selectedChat?.messages.filter((msg) =>
//       msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
//     ) || [], [selectedChat, searchQuery]);

//   const groupedMessages = useMemo(() => groupMessagesByDate(filteredMessages), [filteredMessages]);

//   // UI
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
//       <div className="flex flex-col w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden md:flex-row">
//         {/* Sidebar */}
//         <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto">
//           <div className="p-4 border-b">
//             <h2 className="text-lg sm:text-xl font-semibold">Xabarlar</h2>
//           </div>
//           <AnimatePresence>
//             {chats.map((chat) => (
//               <motion.div
//                 key={chat.id}
//                 className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${selectedChatId === chat.id ? "bg-gray-100" : ""}`}
//                 onClick={() => setSelectedChatId(chat.id)}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 <Image
//                   src={getImageUrl(chat.contact.avatar, BASE_URL, PLACEHOLDER_IMAGE)}
//                   alt={chat.contact.name}
//                   width={40}
//                   height={40}
//                   className="rounded-full mr-3"
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-medium text-sm sm:text-base">{chat.contact.name}</h3>
//                   <p className="text-xs sm:text-sm text-gray-600 truncate">
//                     {chat.messages[chat.messages.length - 1]?.content || "Xabar yo'q"}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col relative">
//           {selectedChat ? (
//             <>
//               <div className="p-4 border-b bg-white flex items-center justify-between flex-wrap">
//                 <div className="flex items-center">
//                   <Image
//                     src={getImageUrl(selectedChat.contact.avatar, BASE_URL, PLACEHOLDER_IMAGE)}
//                     alt={selectedChat.contact.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full mr-3"
//                   />
//                   <div>
//                     <h3 className="font-semibold text-sm sm:text-base">{selectedChat.contact.name}</h3>
//                     <p className="text-xs sm:text-sm text-gray-500">{selectedChat.contact.status === "online" ? "Online" : "Offline"}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 mt-2 sm:mt-0">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Xabarni qidirish..."
//                     className="border rounded-lg px-2 py-1 text-xs sm:text-sm w-full sm:w-auto"
//                   />
//                   <Button variant="ghost" size="sm"><Search size={20} /></Button>
//                   <motion.div
//                     animate={isRefreshing ? { rotate: 360 } : {}}
//                     transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
//                   >
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={refreshMessages}
//                       disabled={isRefreshing}
//                       className="flex items-center gap-1"
//                     >
//                       <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
//                       <span className="text-xs sm:text-sm">Yangilash</span>
//                     </Button>
//                   </motion.div>
//                 </div>
//               </div>

//               {refreshSuccess && (
//                 <motion.div
//                   className="bg-green-500 text-white p-2 text-center text-xs sm:text-sm"
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                 >
//                   Xabarlar muvaffaqiyatli yangilandi!
//                 </motion.div>
//               )}

//               <div
//                 ref={chatContainerRef}
//                 className="flex-1 overflow-y-auto p-4 bg-gray-50"
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={handleDrop}
//               >
//                 <AnimatePresence>
//                   {Object.entries(groupedMessages).map(([date, messages]) => (
//                     <div key={date}>
//                       <div className="text-center my-2">
//                         <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
//                           {date}
//                         </span>
//                       </div>
//                       {messages.map((message) => (
//                         <div id={`message-${message.id}`} key={message.id}>
//                           <MessageBubble
//                             message={message}
//                             onReply={setReplyingTo}
//                             onEdit={handleEditMessage}
//                             onDelete={deleteMessage}
//                             onReact={addReaction}
//                             onRemoveReaction={removeReaction}
//                             onScrollToMessage={scrollToMessage}
//                             onImageClick={setFullscreenImage}
//                             currentUser={currentUserId!}
//                             messages={filteredMessages}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </AnimatePresence>
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="p-4 border-t bg-white">
//                 {replyingTo && (
//                   <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
//                     <p className="text-xs sm:text-sm">Replying to {replyingTo.sender.first_name}: {replyingTo.content}</p>
//                     <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}><X size={16} /></Button>
//                   </div>
//                 )}
//                 {selectedImages.length > 0 && (
//                   <DragDropContext onDragEnd={onDragEnd}>
//                     <Droppable droppableId="images" direction="horizontal">
//                       {(provided) => (
//                         <div className="mb-2 flex flex-wrap gap-2" {...provided.droppableProps} ref={provided.innerRef}>
//                           {selectedImages.map((img, idx) => (
//                             <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
//                               {(provided) => (
//                                 <div
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   className="relative"
//                                 >
//                                   <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="max-w-[100px] rounded-lg" />
//                                   <Button variant="ghost" size="sm" onClick={() => removeImage(idx)} className="absolute top-0 right-0 p-1">
//                                     <X size={12} />
//                                   </Button>
//                                 </div>
//                               )}
//                             </Draggable>
//                           ))}
//                           {provided.placeholder}
//                           <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Plus size={16} /></Button>
//                         </div>
//                       )}
//                     </Droppable>
//                   </DragDropContext>
//                 )}

//                 <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
//                   <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile size={20} /></Button>
//                   <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}><ImageIcon size={20} /></Button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                   <Button variant="ghost" size="sm" onClick={isRecording ? stopRecording : startRecording}>
//                     <Mic size={20} className={isRecording ? "text-red-500" : ""} />
//                   </Button>
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Xabar yozing yoki rasmni bu yerga torting..."
//                     className="flex-1 bg-transparent outline-none px-3 text-xs sm:text-sm"
//                   />
//                   <Button variant="ghost" size="sm" onClick={handleSendMessage}><Send size={20} /></Button>
//                   {showEmojiPicker && (
//                     <div className="absolute bottom-16 right-4 z-10">
//                       <Picker data={data} onEmojiSelect={handleEmojiSelect} />
//                     </div>
//                   )}
//                 </div>
//                 {showScrollButton && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={scrollToBottom}
//                     className="absolute bottom-20 right-4 rounded-full p-2"
//                   >
//                     <ChevronDown size={20} />
//                   </Button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
//                 <p className="text-gray-600 text-sm sm:text-base">Chatni tanlang</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Fullscreen Image Modal */}
//         {fullscreenImage && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//             <div className="relative">
//               <img
//                 src={getImageUrl(fullscreenImage.images[fullscreenImage.index], BASE_URL, PLACEHOLDER_IMAGE)}
//                 alt="Fullscreen"
//                 className="max-w-full max-h-[90vh] rounded-lg"
//                 onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
//               />
//               <Button variant="ghost" size="sm" onClick={() => setFullscreenImage(null)} className="absolute top-2 right-2 text-white">
//                 <X size={24} />
//               </Button>
//               {fullscreenImage.index > 0 && (
//                 <Button variant="ghost" size="sm" onClick={handlePrevImage} className="absolute top-1/2 left-2 text-white">
//                   <ChevronLeft size={24} />
//                 </Button>
//               )}
//               {fullscreenImage.index < fullscreenImage.images.length - 1 && (
//                 <Button variant="ghost" size="sm" onClick={handleNextImage} className="absolute top-1/2 right-2 text-white">
//                   <ChevronRight size={24} />
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import MessageBubble from "@/components/chat/MessageBubble";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../../../context/auth-context";
import { DropResult } from "react-beautiful-dnd";

export interface Sender {
  id: number;
  email: string;
  first_name: string;
  profile: { profile_image: string };
}

export interface Message {
  id: number;
  sender: Sender;
  content?: string;
  images?: { id: number; image: string }[];
  voice?: string;
  time: string;
  isCurrentUser: boolean;
  is_read: boolean;
  reactions?: { id: number; user: Sender; reaction: string }[];
  reply_to?: { id: number; sender: Sender; content: string } | null;
  updated_at?: string;
  created_at: string;
  is_edited?: boolean;
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

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const getImageUrl = (imagePath: string, baseUrl: string, placeholder: string) =>
  imagePath ? (imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`) : placeholder;

const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Bugun";
  if (date.toDateString() === yesterday.toDateString()) return "Kecha";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const groupMessagesByDate = (messages: Message[]) => {
  const grouped: { [key: string]: Message[] } = {};
  messages.forEach((msg) => {
    const dateKey = getFormattedDate(msg.created_at);
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(msg);
  });
  return grouped;
};

const ChatPage: React.FC = () => {
  const { user, getToken } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fullscreenImage, setFullscreenImage] = useState<{ images: string[]; index: number } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentUserId = user?.user_id;
  const selectedChat = useMemo(() => chats.find((chat) => chat.id === selectedChatId) || null, [chats, selectedChatId]);
  const BASE_URL = "https://qqrnatcraft.uz";
  const PLACEHOLDER_IMAGE = "/placeholder.jpg";

  // WebSocket ulanishi
  const connectWebSocket = useCallback(
    async (chatId: number) => {
      const token = await getToken();
      if (!token) {
        console.error("Token topilmadi");
        return;
      }
  
      const websocket = new WebSocket(`wss://qqrnatcraft.uz/ws/chat/${chatId}/?token=${token}`);
  
      websocket.onopen = () => {
        console.log(`WebSocket ulandi: chat/${chatId}`);
      };
  
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`WebSocket xabari: chat/${chatId}, data=`, data); // Debugging uchun
        if (data.error) {
          console.error("WebSocket xatosi:", data.error);
          return;
        }
      
        if (data.type === "chat_message") {
          const { action, message, message_id } = data;
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: (() => {
                      switch (action) {
                        case "new":
                          return [
                            ...chat.messages,
                            {
                              ...message, // Barcha maydonlarni qo‘shish uchun
                              time: formatTime(message.created_at),
                              isCurrentUser: message.sender.id === currentUserId,
                              is_edited: !!message.is_edited,
                              images: message.images || [], // Rasimlar qo‘shildi
                              content: message.content || null, // Matn qo‘shildi
                              reactions: message.reactions || [], // Reaksiyalar qo‘shildi
                              reply_to: message.reply_to || null, // Javob qo‘shildi
                              is_read: message.is_read || false, // O‘qilganlik statusi qo‘shildi
                            },
                          ];
                        case "edit":
                          return chat.messages.map((msg) =>
                            msg.id === message.id
                              ? {
                                  ...message,
                                  time: formatTime(message.updated_at || message.created_at),
                                  isCurrentUser: msg.isCurrentUser,
                                  is_edited: true,
                                  images: message.images || [],
                                  content: message.content || null,
                                  reactions: message.reactions || [],
                                  reply_to: message.reply_to || null,
                                  is_read: message.is_read || false,
                                }
                              : msg
                          );
                        case "delete":
                          return chat.messages.filter((msg) => msg.id !== message_id);
                        case "reaction_add":
                        case "reaction_remove":
                          return chat.messages.map((msg) =>
                            msg.id === message.id
                              ? { ...msg, reactions: message.reactions || [] }
                              : msg
                          );
                        default:
                          return chat.messages;
                      }
                    })(),
                  }
                : chat
            )
          );
          requestAnimationFrame(() => scrollToBottom());
        }
      };
  
      websocket.onerror = (error) => {
        console.error("WebSocket xatosi:", error);
      };
  
      websocket.onclose = (event) => {
        console.log("WebSocket yopildi:", event.code, event.reason);
      };
  
      setWs(websocket);
    },
    [getToken, currentUserId]
  );

  // Chatlarni yuklash
  const loadChats = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const response = await fetch("https://qqrnatcraft.uz/chat/chats/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Chatlarni yuklashda xato");
      const data = await response.json();
      setChats(
        data.map((chat: any) => {
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
              time: formatTime(msg.created_at),
              isCurrentUser: msg.sender.id === currentUserId,
              is_edited: !!msg.is_edited,
            })),
          };
        })
      );

      const activeChatId = localStorage.getItem("activeChatId");
      if (activeChatId && data.some((chat: any) => chat.id === parseInt(activeChatId))) {
        setSelectedChatId(parseInt(activeChatId));
      }
    } catch (error) {
      console.error("Chatlarni yuklashda xato:", error);
    }
  }, [user, getToken, currentUserId]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Xabar yuborish
  const handleSendMessage = useCallback(async () => {
    if (!selectedChatId || !ws || (!inputValue.trim() && !selectedImages.length)) return;
  
    if (selectedImages.length > 0) {
      const token = await getToken();
      const formData = new FormData();
      if (inputValue.trim()) formData.append("content", inputValue);
      if (replyingTo) formData.append("reply_to", replyingTo.id.toString()); // reply_to qo‘shish
      selectedImages.forEach((img) => formData.append("images", img));
  
      try {
        const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${selectedChatId}/send-message/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!response.ok) throw new Error("Media yuborishda xato");
        const serverMessage = await response.json();
  
        ws.send(
          JSON.stringify({
            action: "sync_message",
            message_id: serverMessage.id,
          })
        );
      } catch (error) {
        console.error("Media xabar yuborishda xato:", error);
        return;
      }
    } else if (inputValue.trim()) {
      const messageData: any = {
        action: editingMessage ? "edit_message" : "send_message",
        content: inputValue,
      };
      if (editingMessage) {
        messageData.message_id = editingMessage.id;
      }
      if (replyingTo) {
        messageData.reply_to = replyingTo.id; // reply_to qo‘shish
      }
  
      console.log("Yuborilayotgan xabar:", messageData); // Debugging uchun
      ws.send(JSON.stringify(messageData));
    }
  
    setInputValue("");
    setSelectedImages([]);
    setReplyingTo(null);
    setEditingMessage(null);
  }, [selectedChatId, ws, inputValue, selectedImages, editingMessage, replyingTo, getToken]);
  // Ovozli xabar
  const sendAudioMessage = useCallback(async (audioBlob: Blob) => {
    if (!selectedChatId || !ws) return;
    const token = await getToken();
    const formData = new FormData();
    formData.append("voice", audioBlob, "audio.webm");

    try {
      const response = await fetch(`https://qqrnatcraft.uz/chat/chats/${selectedChatId}/send-message/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Ovozli xabar yuborishda xato");
      const serverMessage = await response.json();

      ws.send(
        JSON.stringify({
          action: "sync_message",
          message_id: serverMessage.id,
        })
      );
    } catch (error) {
      console.error("Ovozli xabar yuborishda xato:", error);
    }
  }, [selectedChatId, ws, getToken]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        sendAudioMessage(new Blob(chunks, { type: "audio/webm" }));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Ovoz yozishda xato:", error);
      alert("Ovozli xabar yozib olishda xatolik!");
    }
  }, [sendAudioMessage]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  // Boshqa aksiyalar
  const deleteMessage = useCallback((messageId: number) => {
    if (!ws) return;
    ws.send(
      JSON.stringify({
        action: "delete_message",
        message_id: messageId,
      })
    );
  }, [ws]);

  const addReaction = useCallback((messageId: number, reaction: string) => {
    if (!ws) return;
    ws.send(
      JSON.stringify({
        action: "add_reaction",
        message_id: messageId,
        reaction,
      })
    );
  }, [ws]);

  const removeReaction = useCallback((messageId: number) => {
    if (!ws) return;
    ws.send(
      JSON.stringify({
        action: "remove_reaction",
        message_id: messageId,
      })
    );
  }, [ws]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
  }, []);

  const handleEditMessage = useCallback((message: Message) => {
    setEditingMessage(message);
    setInputValue(message.content || "");
    setSelectedImages([]);
    inputRef.current?.focus();
  }, []);

  const handleEmojiSelect = useCallback((emoji: { native: string }) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(selectedImages);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setSelectedImages(reorderedImages);
  }, [selectedImages]);

  // Effectlar
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (selectedChatId && !ws) {
      connectWebSocket(selectedChatId);
      return () => {
        if (ws instanceof WebSocket) {
          ws.close();
        }
      };
    }
  }, [selectedChatId, connectWebSocket, ws]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };
    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredMessages = useMemo(() =>
    selectedChat?.messages.filter((msg) =>
      // Agar content mavjud bo‘lsa, qidiruvga mosligini tekshir, aks holda faqat rasimli yoki boshqa xabarni qo‘sh
      msg.content ? msg.content.toLowerCase().includes(searchQuery.toLowerCase()) : true
    ) || [], [selectedChat, searchQuery]);

  const groupedMessages = useMemo(() => groupMessagesByDate(filteredMessages), [filteredMessages]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="flex flex-col w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden md:flex-row">
        <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg sm:text-xl font-semibold">Xabarlar</h2>
          </div>
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${selectedChatId === chat.id ? "bg-gray-100" : ""}`}
                onClick={() => setSelectedChatId(chat.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image
                  src={getImageUrl(chat.contact.avatar, BASE_URL, PLACEHOLDER_IMAGE)}
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

        <div className="flex-1 flex flex-col relative">
          {selectedChat ? (
            <>
              <div className="p-4 border-b bg-white flex items-center justify-between flex-wrap">
                <div className="flex items-center">
                  <Image
                    src={getImageUrl(selectedChat.contact.avatar, BASE_URL, PLACEHOLDER_IMAGE)}
                    alt={selectedChat.contact.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{selectedChat.contact.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{selectedChat.contact.status === "online" ? "Online" : "Offline"}</p>
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
                  <Button variant="ghost" size="sm"><Search size={20} /></Button>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
              >
                <AnimatePresence>
                  {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date}>
                      <div className="text-center my-2">
                        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {date}
                        </span>
                      </div>
                      {messages.map((message) => (
                        <div id={`message-${message.id}`} key={message.id}>
                          <MessageBubble
                            message={message}
                            onReply={setReplyingTo}
                            onEdit={handleEditMessage}
                            onDelete={deleteMessage}
                            onReact={addReaction}
                            onRemoveReaction={removeReaction}
                            onScrollToMessage={() => {}}
                            onImageClick={setFullscreenImage}
                            currentUser={currentUserId!}
                            messages={filteredMessages}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white">
                {replyingTo && (
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
                    <p className="text-xs sm:text-sm">Replying to {replyingTo.sender.first_name}: {replyingTo.content}</p>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}><X size={16} /></Button>
                  </div>
                )}
                {selectedImages.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div className="mb-2 flex flex-wrap gap-2" {...provided.droppableProps} ref={provided.innerRef}>
                          {selectedImages.map((img, idx) => (
                            <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                                className="relative"
                              >
                                <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="max-w-[100px] rounded-lg" />
                                <Button variant="ghost" size="sm" onClick={() => removeImage(idx)} className="absolute top-0 right-0 p-1">
                                  <X size={12} />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                          ))}
                          {provided.placeholder}
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Plus size={16} /></Button>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}

                <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
                  <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><Smile size={20} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}><ImageIcon size={20} /></Button>
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
                    placeholder="Xabar yozing..."
                    className="flex-1 bg-transparent outline-none px-3 text-xs sm:text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={handleSendMessage}><Send size={20} /></Button>
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

        {fullscreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={getImageUrl(fullscreenImage.images[fullscreenImage.index], BASE_URL, PLACEHOLDER_IMAGE)}
                alt="Fullscreen"
                className="max-w-full max-h-[90vh] rounded-lg"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
              />
              <Button variant="ghost" size="sm" onClick={() => setFullscreenImage(null)} className="absolute top-2 right-2 text-white">
                <X size={24} />
              </Button>
              {fullscreenImage.index > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setFullscreenImage({ ...fullscreenImage, index: fullscreenImage.index - 1 })} className="absolute top-1/2 left-2 text-white">
                  <ChevronLeft size={24} />
                </Button>
              )}
              {fullscreenImage.index < fullscreenImage.images.length - 1 && (
                <Button variant="ghost" size="sm" onClick={() => setFullscreenImage({ ...fullscreenImage, index: fullscreenImage.index + 1 })} className="absolute top-1/2 right-2 text-white">
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