// "use client";

// import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Send,
//   MessageSquare,
//   X,
//   Smile,
//   Search,
//   Image as ImageIcon,
//   Mic,
//   Plus,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// import MessageBubble from "@/components/chat/MessageBubble";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useAuth } from "../../../context/auth-context";

// export interface Sender {
//   id: number;
//   email: string;
//   first_name: string;
//   profile: { profile_image: string };
// }

// export interface Message {
//   highlight: boolean;
//   id: number;
//   sender: Sender;
//   content?: string;
//   images?: { id: number; image: string }[];
//   voice?: string;
//   time: string;
//   isCurrentUser: boolean;
//   is_read: boolean;
//   reactions?: { id: number; user: Sender; reaction: string }[];
//   reply_to?: { id: number; sender: Sender; content: string } | null | number;
//   updated_at?: string;
//   created_at: string;
//   is_edited?: boolean;
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
//   unreadCount: number; // Yangi xabarlar soni
// }

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// const formatTime = (date: string) =>
//   new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// const getImageUrl = (imagePath: string) =>
//   imagePath
//     ? imagePath.startsWith("http")
//       ? imagePath
//       : `${BASE_URL}${imagePath}`
//     : PLACEHOLDER_IMAGE;

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

// const ChatPage: React.FC = () => {
//   const { user, getToken } = useAuth();
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
//   const [inputValue, setInputValue] = useState<string>("");
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [replyingTo, setReplyingTo] = useState<Message | null>(null);
//   const [editingMessage, setEditingMessage] = useState<Message | null>(null);
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [fullscreenImage, setFullscreenImage] = useState<{
//     images: string[];
//     index: number;
//   } | null>(null);
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const [wsConnections, setWsConnections] = useState<Map<number, WebSocket>>(
//     new Map()
//   );
//   const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(
//     null
//   );

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const isAtBottomRef = useRef(true);

//   const currentUserId = user?.user_id;
//   const selectedChat = useMemo(
//     () => chats.find((chat) => chat.id === selectedChatId) || null,
//     [chats, selectedChatId]
//   );

//   const scrollToBottom = useCallback(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//       isAtBottomRef.current = true;
//       setShowScrollButton(false);
//       if (selectedChatId) {
//         setChats((prev) =>
//           prev.map((chat) =>
//             chat.id === selectedChatId ? { ...chat, unreadCount: 0 } : chat
//           )
//         );
//       }
//     }
//   }, [selectedChatId]);

//   const scrollToMessage = useCallback((messageId: number) => {
//     const element = document.getElementById(`message-${messageId}`);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth", block: "center" });
//       setHighlightedMessageId(messageId);
//       setTimeout(() => setHighlightedMessageId(null), 3000);
//     }
//   }, []);

//   const connectWebSocket = useCallback(
//     async (chatId: number) => {
//       const token = await getToken();
//       if (!token) return;

//       const websocket = new WebSocket(
//         `wss://qqrnatcraft.uz/ws/chat/${chatId}/?token=${token}`
//       );

//       websocket.onopen = () => {
//         console.log(`WebSocket ulandi: chat/${chatId}`);
//       };

//       websocket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.error) {
//           console.error("WebSocket xatosi:", data.error);
//           return;
//         }

//         if (data.type === "chat_message") {
//           const { action, message, message_id } = data;
//           setChats((prev) =>
//             prev.map((chat) => {
//               if (chat.id !== chatId) return chat; // Faqat mos chatni yangilaymiz

//               return {
//                 ...chat,
//                 messages: (() => {
//                   switch (action) {
//                     case "new":
//                       const newMessage = {
//                         ...message,
//                         time: formatTime(message.created_at),
//                         isCurrentUser: message.sender.id === currentUserId,
//                         is_edited: !!message.is_edited,
//                         images: message.images || [],
//                         content: message.content || null,
//                         reactions: message.reactions || [],
//                         reply_to: message.reply_to || null,
//                         is_read: chatId === selectedChatId && isAtBottomRef.current,
//                         highlight: true,
//                       };
//                       if (chatId === selectedChatId && isAtBottomRef.current) {
//                         setTimeout(scrollToBottom, 0);
//                       }
//                       return [...chat.messages, newMessage];

//                     case "edit":
//                       return chat.messages.map((msg) =>
//                         msg.id === message.id
//                           ? {
//                               ...msg,
//                               content: message.content || null,
//                               images: message.images || [],
//                               time: formatTime(message.updated_at || message.created_at),
//                               is_edited: true,
//                               reactions: message.reactions || [],
//                               reply_to: message.reply_to || null,
//                               is_read: msg.is_read,
//                               sender: msg.sender,
//                             }
//                           : msg
//                       );

//                     case "delete":
//                       return chat.messages.filter((msg) => msg.id !== message_id);

//                     case "reaction_add":
//                     case "reaction_remove":
//                       return chat.messages.map((msg) =>
//                         msg.id === message.id
//                           ? { ...msg, reactions: message.reactions || [] }
//                           : msg
//                       );

//                     default:
//                       return chat.messages;
//                   }
//                 })(),
//                 unreadCount:
//                   action === "new" && (chatId !== selectedChatId || !isAtBottomRef.current)
//                     ? chat.unreadCount + 1
//                     : chat.unreadCount,
//               };
//             })
//           );

//           if (chatId === selectedChatId && !isAtBottomRef.current) {
//             setShowScrollButton(true);
//           }
//         }
//       };

//       websocket.onerror = (error) => {
//         console.error("WebSocket xatosi:", error);
//       };

//       websocket.onclose = () => {
//         console.log("WebSocket yopildi");
//       };

//       setWsConnections((prev) => new Map(prev).set(chatId, websocket));
//     },
//     [getToken, currentUserId, selectedChatId, scrollToBottom]
//   );

//   const loadChats = useCallback(async () => {
//     if (!user) return;
//     try {
//       const token = await getToken();
//       const response = await fetch(`${BASE_URL}/chat/chats/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) throw new Error("Chatlarni yuklashda xato");
//       const data = await response.json();
//       const newChats = data.map((chat: any) => {
//         const isSellerCurrentUser = chat.seller.id === currentUserId;
//         const contactUser = isSellerCurrentUser ? chat.buyer : chat.seller;
//         return {
//           id: chat.id,
//           contact: {
//             id: contactUser.id,
//             name: contactUser.first_name,
//             avatar: contactUser.profile.profile_image,
//             status: "online",
//           },
//           messages: chat.messages.map((msg: any) => ({
//             ...msg,
//             time: formatTime(msg.created_at),
//             isCurrentUser: msg.sender.id === currentUserId,
//             is_edited: !!msg.is_edited,
//             highlight: false,
//           })),
//           unreadCount: 0,
//         };
//       });
//       setChats(newChats);

//       // Har bir chat uchun WebSocket ulanishini ochish
//       newChats.forEach((chat: Chat) => {
//         connectWebSocket(chat.id);
//       });

//       const activeChatId = localStorage.getItem("activeChatId");
//       if (activeChatId && data.some((chat: any) => chat.id === parseInt(activeChatId))) {
//         setSelectedChatId(parseInt(activeChatId));
//       }
//     } catch (error) {
//       console.error("Chatlarni yuklashda xato:", error);
//     }
//   }, [user, getToken, currentUserId, connectWebSocket]);

//   const handleSendMessage = useCallback(async () => {
//     if (!selectedChatId || !wsConnections.get(selectedChatId) || (!inputValue.trim() && !selectedImages.length))
//       return;

//     const ws = wsConnections.get(selectedChatId);
//     if (!ws) return;

//     if (selectedImages.length > 0) {
//       const token = await getToken();
//       const formData = new FormData();
//       if (inputValue.trim()) formData.append("content", inputValue);
//       if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
//       selectedImages.forEach((img) => formData.append("images", img));

//       try {
//         const response = await fetch(
//           `${BASE_URL}/chat/chats/${selectedChatId}/send-message/`,
//           {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formData,
//           }
//         );
//         if (!response.ok) throw new Error("Media yuborishda xato");
//         const serverMessage = await response.json();
//         ws.send(
//           JSON.stringify({
//             action: "sync_message",
//             message_id: serverMessage.id,
//           })
//         );
//       } catch (error) {
//         console.error("Media xabar yuborishda xato:", error);
//         return;
//       }
//     } else if (inputValue.trim()) {
//       const messageData: any = {
//         action: editingMessage ? "edit_message" : "send_message",
//         content: inputValue,
//       };
//       if (editingMessage) {
//         messageData.message_id = editingMessage.id;
//       }
//       if (replyingTo) {
//         messageData.reply_to = replyingTo.id;
//       }
//       ws.send(JSON.stringify(messageData));
//     }

//     setInputValue("");
//     setSelectedImages([]);
//     setReplyingTo(null);
//     setEditingMessage(null);
//     scrollToBottom();
//   }, [
//     selectedChatId,
//     wsConnections,
//     inputValue,
//     selectedImages,
//     editingMessage,
//     replyingTo,
//     getToken,
//     scrollToBottom,
//   ]);

//   const sendAudioMessage = useCallback(
//     async (audioBlob: Blob) => {
//       if (!selectedChatId || !wsConnections.get(selectedChatId)) return;
//       const ws = wsConnections.get(selectedChatId);
//       if (!ws) return;

//       const token = await getToken();
//       const formData = new FormData();
//       formData.append("voice", audioBlob, "audio.webm");

//       try {
//         const response = await fetch(
//           `${BASE_URL}/chat/chats/${selectedChatId}/send-message/`,
//           {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formData,
//           }
//         );
//         if (!response.ok) throw new Error("Ovozli xabar yuborishda xato");
//         const serverMessage = await response.json();
//         ws.send(
//           JSON.stringify({
//             action: "sync_message",
//             message_id: serverMessage.id,
//           })
//         );
//       } catch (error) {
//         console.error("Ovozli xabar yuborishda xato:", error);
//       }
//     },
//     [selectedChatId, wsConnections, getToken]
//   );

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

//   const deleteMessage = useCallback(
//     (messageId: number) => {
//       if (!selectedChatId || !wsConnections.get(selectedChatId)) return;
//       const ws = wsConnections.get(selectedChatId);
//       if (!ws) return;
//       ws.send(
//         JSON.stringify({
//           action: "delete_message",
//           message_id: messageId,
//         })
//       );
//     },
//     [selectedChatId, wsConnections]
//   );

//   const addReaction = useCallback(
//     (messageId: number, reaction: string) => {
//       if (!selectedChatId || !wsConnections.get(selectedChatId)) return;
//       const ws = wsConnections.get(selectedChatId);
//       if (!ws) return;
//       ws.send(
//         JSON.stringify({
//           action: "add_reaction",
//           message_id: messageId,
//           reaction,
//         })
//       );
//     },
//     [selectedChatId, wsConnections]
//   );

//   const removeReaction = useCallback(
//     (messageId: number) => {
//       if (!selectedChatId || !wsConnections.get(selectedChatId)) return;
//       const ws = wsConnections.get(selectedChatId);
//       if (!ws) return;
//       ws.send(
//         JSON.stringify({
//           action: "remove_reaction",
//           message_id: messageId,
//         })
//       );
//     },
//     [selectedChatId, wsConnections]
//   );

//   const handleImageUpload = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const files = e.target.files;
//       if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
//     },
//     []
//   );

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

//   const onDragEnd = useCallback((result: any) => {
//     if (!result.destination) return;
//     const reorderedImages = Array.from(selectedImages);
//     const [movedImage] = reorderedImages.splice(result.source.index, 1);
//     reorderedImages.splice(result.destination.index, 0, movedImage);
//     setSelectedImages(reorderedImages);
//   }, [selectedImages]);

//   useEffect(() => {
//     loadChats();
//   }, [loadChats]);

//   useEffect(() => {
//     return () => {
//       wsConnections.forEach((ws) => ws.close());
//     };
//   }, [wsConnections]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (chatContainerRef.current) {
//         const { scrollTop, scrollHeight, clientHeight } =
//           chatContainerRef.current;
//         isAtBottomRef.current =
//           Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
//         setShowScrollButton(!isAtBottomRef.current && (selectedChat?.unreadCount || 0) > 0);
//       }
//     };
//     const container = chatContainerRef.current;
//     container?.addEventListener("scroll", handleScroll);
//     return () => container?.removeEventListener("scroll", handleScroll);
//   }, [selectedChat?.unreadCount]);

//   useEffect(() => {
//     if (selectedChatId) {
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? {
//                 ...chat,
//                 unreadCount: 0,
//                 messages: chat.messages.map((msg) => ({
//                   ...msg,
//                   is_read: true, // Chat ochilganda barcha xabarlarni o‘qilgan deb belgilash
//                 })),
//               }
//             : chat
//         )
//       );
//       localStorage.setItem("activeChatId", selectedChatId.toString());
//       scrollToBottom();
//     }
//   }, [selectedChatId, scrollToBottom]);

//   const filteredMessages = useMemo(() => {
//     if (!selectedChat || !searchQuery.trim()) return selectedChat?.messages || [];
//     return selectedChat.messages.filter((msg) =>
//       msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [selectedChat, searchQuery]);

//   const groupedMessages = useMemo(
//     () => groupMessagesByDate(filteredMessages),
//     [filteredMessages]
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
//       <div className="flex flex-col w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden md:flex-row">
//         <div className="w-full md:w-1/3 border-r bg-gray-50 overflow-y-auto">
//           <div className="p-4 border-b">
//             <h2 className="text-lg sm:text-xl font-semibold">Xabarlar</h2>
//           </div>
//           <AnimatePresence>
//             {chats.map((chat) => (
//               <motion.div
//                 key={chat.id}
//                 className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
//                   selectedChatId === chat.id ? "bg-gray-100" : ""
//                 }`}
//                 onClick={() => setSelectedChatId(chat.id)}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//               >
//                 <div className="relative">
//                   <Image
//                     src={getImageUrl(chat.contact.avatar)}
//                     alt={chat.contact.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full mr-3"
//                   />
//                   {chat.unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-medium text-sm sm:text-base">
//                     {chat.contact.name}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600 truncate">
//                     {chat.messages[chat.messages.length - 1]?.content ||
//                       "Xabar yo'q"}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>

//         <div className="flex-1 flex flex-col relative">
//           {selectedChat ? (
//             <>
//               <div className="p-4 border-b bg-white flex items-center justify-between flex-wrap">
//                 <div className="flex items-center">
//                   <Image
//                     src={getImageUrl(selectedChat.contact.avatar)}
//                     alt={selectedChat.contact.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full mr-3"
//                   />
//                   <div>
//                     <h3 className="font-semibold text-sm sm:text-base">
//                       {selectedChat.contact.name}
//                     </h3>
//                     <p className="text-xs sm:text-sm text-gray-500">
//                       {selectedChat.contact.status === "online"
//                         ? "Online"
//                         : "Offline"}
//                     </p>
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
//                   <Button variant="ghost" size="sm">
//                     <Search size={20} />
//                   </Button>
//                 </div>
//               </div>

//               <div
//                 ref={chatContainerRef}
//                 className="flex-1 overflow-y-auto p-4 bg-gray-50"
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
//                             messages={selectedChat.messages}
//                             highlight={
//                               message.highlight ||
//                               message.id === highlightedMessageId
//                             }
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </AnimatePresence>
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="p-4 border-t bg-white relative">
//                 {replyingTo && (
//                   <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
//                     <p className="text-xs sm:text-sm">
//                       Replying to {replyingTo.sender?.first_name || "Noma'lum"}:{" "}
//                       {replyingTo.content}
//                     </p>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setReplyingTo(null)}
//                     >
//                       <X size={16} />
//                     </Button>
//                   </div>
//                 )}
//                 {selectedImages.length > 0 && (
//                   <DragDropContext onDragEnd={onDragEnd}>
//                     <Droppable droppableId="images" direction="horizontal">
//                       {(provided) => (
//                         <div
//                           className="mb-2 flex flex-wrap gap-2"
//                           {...provided.droppableProps}
//                           ref={provided.innerRef}
//                         >
//                           {selectedImages.map((img, idx) => (
//                             <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
//                             {(provided) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 style={provided.draggableProps.style as React.CSSProperties} // Tur aniqlash
//                                 className="relative"
//                               >
//                                 <img
//                                   src={URL.createObjectURL(img)}
//                                   alt={`Preview ${idx}`}
//                                   className="max-w-[100px] rounded-lg"
//                                 />
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => removeImage(idx)}
//                                   className="absolute top-0 right-0 p-1"
//                                 >
//                                   <X size={12} />
//                                 </Button>
//                               </div>
//                             )}
//                           </Draggable>
//                           ))}
//                           {provided.placeholder}
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => fileInputRef.current?.click()}
//                           >
//                             <Plus size={16} />
//                           </Button>
//                         </div>
//                       )}
//                     </Droppable>
//                   </DragDropContext>
//                 )}

//                 <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   >
//                     <Smile size={20} />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     <ImageIcon size={20} />
//                   </Button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={isRecording ? stopRecording : startRecording}
//                   >
//                     <Mic
//                       size={20}
//                       className={isRecording ? "text-red-500" : ""}
//                     />
//                   </Button>
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Xabar yozing..."
//                     className="flex-1 bg-transparent outline-none px-3 text-xs sm:text-sm"
//                   />
//                   <Button variant="ghost" size="sm" onClick={handleSendMessage}>
//                     <Send size={20} />
//                   </Button>
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
//                     className="absolute bottom-4 right-4 rounded-full p-2 flex items-center gap-1 bg-white shadow-lg"
//                   >
//                     <ChevronDown size={20} />
//                     {selectedChat?.unreadCount > 0 && (
//                       <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
//                         {selectedChat.unreadCount}
//                       </span>
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <MessageSquare
//                   size={48}
//                   className="mx-auto mb-4 text-gray-400"
//                 />
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   Chatni tanlang
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {fullscreenImage && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//             <div className="relative">
//               <img
//                 src={getImageUrl(fullscreenImage.images[fullscreenImage.index])}
//                 alt="Fullscreen"
//                 className="max-w-full max-h-[90vh] rounded-lg"
//                 onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
//               />
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setFullscreenImage(null)}
//                 className="absolute top-2 right-2 text-white"
//               >
//                 <X size={24} />
//               </Button>
//               {fullscreenImage.index > 0 && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() =>
//                     setFullscreenImage({
//                       ...fullscreenImage,
//                       index: fullscreenImage.index - 1,
//                     })
//                   }
//                   className="absolute top-1/2 left-2 text-white"
//                 >
//                   <ChevronLeft size={24} />
//                 </Button>
//               )}
//               {fullscreenImage.index < fullscreenImage.images.length - 1 && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() =>
//                     setFullscreenImage({
//                       ...fullscreenImage,
//                       index: fullscreenImage.index + 1,
//                     })
//                   }
//                   className="absolute top-1/2 right-2 text-white"
//                 >
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



// -------------------------------------------------------------------------------------------------



// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useAuth } from "../../../context/auth-context";

// import ChatList from "./ChatList";
// import ChatHeader from "./ChatHeader";
// import MessageList from "./MessageList";
// import MessageInput from "./MessageInput";
// import FullscreenImageViewer from "./FullscreenImageViewer";

// import { Chat, Message } from "./types";

// const BASE_URL = "https://qqrnatcraft.uz";

// const ChatPage: React.FC = () => {
//   const { user, getToken } = useAuth();

//   const [chats, setChats] = useState<Chat[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
//   const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

//   const [fullscreenImage, setFullscreenImage] = useState<{
//     images: string[];
//     index: number;
//   } | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const isAtBottomRef = useRef(true);
//   const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

//   const currentUserId = user ? Number(user.user_id) : undefined;

//   /** Scroll to bottom helper */
//   const scrollToBottom = useCallback(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//       isAtBottomRef.current = true;
//     }
//   }, []);

//   /** Load chats from API */
//   const loadChats = useCallback(async () => {
//     if (!user) return;

//     try {
//       const token = await getToken();
//       const response = await fetch(`${BASE_URL}/chat/chats/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to load chats");

//       const data = await response.json();

//       const newChats: Chat[] = data.map((chat: any) => {
//         const isSellerCurrentUser = chat.seller.id === currentUserId;
//         const contactUser = isSellerCurrentUser ? chat.buyer : chat.seller;

//         return {
//           id: chat.id,
//           contact: {
//             id: contactUser.id,
//             name: contactUser.first_name,
//             avatar: contactUser.profile.profile_image,
//             status: "online",
//           },
//           messages: chat.messages.map((msg: any) => ({
//             ...msg,
//             time: new Date(msg.created_at).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             isCurrentUser: msg.sender.id === currentUserId,
//             is_edited: !!msg.is_edited,
//             highlight: false,
//           })),
//           unreadCount: 0,
//         };
//       });

//       setChats(newChats);

//       // Restore last active chat
//       const activeChatId = localStorage.getItem("activeChatId");
//       if (
//         activeChatId &&
//         data.some((chat: any) => chat.id === parseInt(activeChatId))
//       ) {
//         setSelectedChatId(parseInt(activeChatId));
//       }
//     } catch (error) {
//       console.error("Error loading chats:", error);
//     }
//   }, [user, currentUserId, getToken]);

//   /** Handle WebSocket messages */
//   const handleMessage = useCallback(
//     (event: MessageEvent) => {
//       const data = JSON.parse(event.data);

//       if (data.error) {
//         console.error("WebSocket error:", data.error);
//         return;
//       }

//       if (data.type === "chat_message") {
//         const { action, message, message_id, chat_id } = data;

//         setChats((prev) =>
//           prev.map((chat) => {
//             if (chat.id !== chat_id) return chat;

//             let updatedMessages: Message[] = [...chat.messages];

//             switch (action) {
//               case "new": {
//                 const newMessage: Message = {
//                   ...message,
//                   time: new Date(message.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   }),
//                   isCurrentUser: message.sender.id === currentUserId,
//                   is_edited: !!message.is_edited,
//                   images: message.images || [],
//                   content: message.content || null,
//                   reactions: message.reactions || [],
//                   reply_to: message.reply_to || null,
//                   is_read: chat_id === selectedChatId && isAtBottomRef.current,
//                   highlight: true,
//                 };
//                 updatedMessages = [...updatedMessages, newMessage];

//                 if (chat_id === selectedChatId && isAtBottomRef.current) {
//                   setTimeout(scrollToBottom, 0);
//                 }
//                 break;
//               }

//               case "edit":
//                 updatedMessages = updatedMessages.map((msg) =>
//                   msg.id === message.id
//                     ? {
//                         ...msg,
//                         content: message.content || null,
//                         images: message.images || [],
//                         time: new Date(
//                           message.updated_at || message.created_at
//                         ).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }),
//                         is_edited: true,
//                         reactions: message.reactions || [],
//                         reply_to: message.reply_to || null,
//                         is_read: msg.is_read,
//                         sender: msg.sender,
//                       }
//                     : msg
//                 );
//                 break;

//               case "delete":
//                 updatedMessages = updatedMessages.filter(
//                   (msg) => msg.id !== message_id
//                 );
//                 break;

//               case "reaction_add":
//               case "reaction_remove":
//                 updatedMessages = updatedMessages.map((msg) =>
//                   msg.id === message.id
//                     ? { ...msg, reactions: message.reactions || [] }
//                     : msg
//                 );
//                 break;
//             }

//             return {
//               ...chat,
//               messages: updatedMessages,
//               unreadCount:
//                 action === "new" &&
//                 (chat_id !== selectedChatId || !isAtBottomRef.current)
//                   ? chat.unreadCount + 1
//                   : chat.unreadCount,
//             };
//           })
//         );
//       }
//     },
//     [currentUserId, selectedChatId, scrollToBottom]
//   );

//   /** Connect WebSocket (single connection for all chats) */
//   const connectWebSocket = useCallback(async () => {
//     const token = await getToken();
//     if (!token) return;

//     const ws = new WebSocket(`wss://qqrnatcraft.uz/ws/chat/?token=${token}`);

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected");
//       if (reconnectTimer.current) {
//         clearTimeout(reconnectTimer.current);
//         reconnectTimer.current = null;
//       }
//     };

//     ws.onmessage = handleMessage;

//     ws.onclose = () => {
//       console.warn("⚠️ WebSocket closed, reconnecting...");
//       reconnectTimer.current = setTimeout(connectWebSocket, 3000);
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       ws.close();
//     };

//     setWsConnection(ws);
//   }, [getToken, handleMessage]);

//   /** Load chats and connect WebSocket on mount */
//   useEffect(() => {
//     loadChats();
//     connectWebSocket();
//     return () => {
//       wsConnection?.close();
//       if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
//     };
//   }, [loadChats, connectWebSocket]);

//   /** Handle selected chat */
//   useEffect(() => {
//     if (selectedChatId) {
//       setChats((prev) =>
//         prev.map((chat) =>
//           chat.id === selectedChatId
//             ? {
//                 ...chat,
//                 unreadCount: 0,
//                 messages: chat.messages.map((msg) => ({
//                   ...msg,
//                   is_read: true,
//                 })),
//               }
//             : chat
//         )
//       );

//       localStorage.setItem("activeChatId", selectedChatId.toString());
//       scrollToBottom();
//     }
//   }, [selectedChatId, scrollToBottom]);

//   const selectedChat =
//     chats.find((chat) => chat.id === selectedChatId) || null;

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
//       <div className="flex flex-col md:flex-row w-full max-w-6xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
//         <ChatList
//           chats={chats}
//           selectedChatId={selectedChatId}
//           onSelectChat={setSelectedChatId}
//         />

//         <div className="flex-1 flex flex-col">
//           {selectedChat && currentUserId !== undefined ? (
//             <>
//               <ChatHeader contact={selectedChat.contact} />

//               <MessageList
//                 messages={selectedChat.messages}
//                 currentUserId={currentUserId}
//                 wsConnection={wsConnection}
//                 messagesEndRef={messagesEndRef}
//                 isAtBottomRef={isAtBottomRef}
//                 scrollToBottom={scrollToBottom}
//                 setFullscreenImage={setFullscreenImage}
//               />

//               <MessageInput
//                 chatId={selectedChatId!}
//                 wsConnection={wsConnection}
//                 scrollToBottom={scrollToBottom}
//                 getToken={getToken}
//               />
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-600">
//               Chatni tanlang yoki foydalanuvchi tizimga kirmagan
//             </div>
//           )}
//         </div>

//         {fullscreenImage && (
//           <FullscreenImageViewer
//             images={fullscreenImage.images}
//             index={fullscreenImage.index}
//             onClose={() => setFullscreenImage(null)}
//             onPrev={() =>
//               setFullscreenImage({
//                 ...fullscreenImage,
//                 index: fullscreenImage.index - 1,
//               })
//             }
//             onNext={() =>
//               setFullscreenImage({
//                 ...fullscreenImage,
//                 index: fullscreenImage.index + 1,
//               })
//             }
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/auth-context";

import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import FullscreenImageViewer from "./FullscreenImageViewer";

import { Chat, Message } from "./types";

const BASE_URL = "https://qqrnatcraft.uz";

const ChatPage: React.FC = () => {
  const { user, getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [wsConnections, setWsConnections] = useState<Map<number, WebSocket>>(new Map());
  const [isMobile, setIsMobile] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const currentUserId = user ? Number(user.user_id) : undefined;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && selectedChatId) {
        // Do nothing, let back button handle
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedChatId]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      isAtBottomRef.current = true;
    }
  }, []);

  const sortChats = (chatsList: Chat[]) => {
    return chatsList.sort((a, b) => {
      const aLastTime = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].created_at).getTime() : 0;
      const bLastTime = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].created_at).getTime() : 0;
      return bLastTime - aLastTime;
    });
  };

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
          unreadCount: 0,
        };
      });

      setChats(sortChats(newChats));

      newChats.forEach((chat) => connectWebSocket(chat.id));

      const activeChatId = localStorage.getItem("activeChatId");
      if (
        activeChatId &&
        data.some((chat: any) => chat.id === parseInt(activeChatId))
      ) {
        setSelectedChatId(parseInt(activeChatId));
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, [user, currentUserId, getToken]);

  const connectWebSocket = useCallback(async (chatId: number) => {
    const token = await getToken();
    if (!token) return;

    const ws = new WebSocket(`wss://qqrnatcraft.uz/ws/chat/${chatId}/?token=${token}`);

    ws.onopen = () => console.log(`✅ WebSocket connected for chat ${chatId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("WebSocket error:", data.error);
        return;
      }

      if (data.type === "chat_message") {
        const { action, message, message_id } = data;
        setChats((prev) => {
          const updatedChats = prev.map((chat) => {
            if (chat.id !== chatId) return chat;

            let updatedMessages = [...chat.messages];

            switch (action) {
              case "new":
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
                  is_read: chatId === selectedChatId && isAtBottomRef.current,
                  highlight: true,
                };
                updatedMessages.push(newMessage);
                if (chatId === selectedChatId && isAtBottomRef.current) {
                  setTimeout(scrollToBottom, 0);
                }
                break;
              case "edit":
                updatedMessages = updatedMessages.map((msg) =>
                  msg.id === message.id
                    ? {
                        ...msg,
                        content: message.content || null,
                        images: message.images || [],
                        time: new Date(
                          message.updated_at || message.created_at
                        ).toLocaleTimeString([], {
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
                  msg.id === message.id
                    ? { ...msg, reactions: message.reactions || [] }
                    : msg
                );
                break;
            }

            return {
              ...chat,
              messages: updatedMessages,
              unreadCount:
                action === "new" &&
                (chatId !== selectedChatId || !isAtBottomRef.current)
                  ? chat.unreadCount + 1
                  : chat.unreadCount,
            };
          });
          return sortChats(updatedChats);
        });
      }
    };

    ws.onclose = () => console.warn(`⚠️ WebSocket closed for chat ${chatId}, reconnecting...`);

    ws.onerror = (error) => console.error("WebSocket error:", error);

    setWsConnections((prev) => {
      const newMap = new Map(prev);
      newMap.set(chatId, ws);
      return newMap;
    });
  }, [getToken, currentUserId, selectedChatId, scrollToBottom]);

  useEffect(() => {
    loadChats();
    return () => {
      wsConnections.forEach((ws) => ws.close());
    };
  }, [loadChats, wsConnections]);

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
      scrollToBottom();
    }
  }, [selectedChatId, scrollToBottom]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const handleBackToList = () => {
    setSelectedChatId(null);
    setReplyingTo(null);
    setEditingMessage(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex-col md:flex-row">
        {(!isMobile || !selectedChatId) && (
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
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
              wsConnection={wsConnections.get(selectedChatId!)}
              messagesEndRef={messagesEndRef}
              isAtBottomRef={isAtBottomRef}
              scrollToBottom={scrollToBottom}
              setFullscreenImage={setFullscreenImage}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              searchQuery={searchQuery}
            />

            <MessageInput
              chatId={selectedChatId!}
              wsConnection={wsConnections.get(selectedChatId!)}
              scrollToBottom={scrollToBottom}
              getToken={getToken}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
            />
          </div>
        ) : (
          !isMobile && (
            <div className="flex-1 flex items-center justify-center text-gray-600">
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