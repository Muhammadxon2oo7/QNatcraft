// // import React, { useEffect, useCallback, useMemo } from "react";
// // import { AnimatePresence } from "framer-motion";
// // import MessageBubble from "./MessageBubble";
// // import { Message } from "./types";

// // interface MessageListProps {
// //   messages: Message[];
// //   currentUserId: number;
// //   wsConnection: WebSocket | undefined;
// //   messagesEndRef: React.RefObject<HTMLDivElement>;
// //   isAtBottomRef: React.MutableRefObject<boolean>;
// //   scrollToBottom: () => void;
// //   setFullscreenImage: (data: { images: string[]; index: number } | null) => void;
// //   searchQuery?: string;
// //   onReply: (message: Message | null) => void;
// //   onScrollToMessage: (id: number) => void;
// //   highlightedMessageId: number | null;
// // }

// // const getFormattedDate = (dateString: string) => {
// //   const date = new Date(dateString);
// //   const today = new Date();
// //   const yesterday = new Date(today);
// //   yesterday.setDate(today.getDate() - 1);

// //   if (date.toDateString() === today.toDateString()) return "Bugun";
// //   if (date.toDateString() === yesterday.toDateString()) return "Kecha";

// //   const day = String(date.getDate()).padStart(2, "0");
// //   const month = String(date.getMonth() + 1).padStart(2, "0");
// //   const year = date.getFullYear();
// //   return `${day}.${month}.${year}`;
// // };

// // const groupMessagesByDate = (messages: Message[]) => {
// //   const grouped: { [key: string]: Message[] } = {};
// //   messages.forEach((msg) => {
// //     const dateKey = getFormattedDate(msg.created_at);
// //     if (!grouped[dateKey]) grouped[dateKey] = [];
// //     grouped[dateKey].push(msg);
// //   });
// //   return grouped;
// // };

// // const MessageList: React.FC<MessageListProps> = React.memo(({
// //   messages,
// //   currentUserId,
// //   wsConnection,
// //   messagesEndRef,
// //   isAtBottomRef,
// //   scrollToBottom,
// //   setFullscreenImage,
// //   searchQuery = "",
// //   onReply,
// //   onScrollToMessage,
// //   highlightedMessageId,
// // }) => {
// //   const filteredMessages = useMemo(() => {
// //     if (!searchQuery.trim()) return messages;
// //     return messages.filter((msg) =>
// //       msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
// //     );
// //   }, [messages, searchQuery]);

// //   const groupedMessages = useMemo(
// //     () => groupMessagesByDate(filteredMessages),
// //     [filteredMessages]
// //   );

// //   const handleDelete = useCallback(
// //     (messageId: number) => {
// //       if (wsConnection) {
// //         wsConnection.send(JSON.stringify({ action: "delete_message", message_id: messageId }));
// //       }
// //     },
// //     [wsConnection]
// //   );

// //   const handleReact = useCallback(
// //     (messageId: number, reaction: string) => {
// //       if (wsConnection) {
// //         wsConnection.send(JSON.stringify({ action: "add_reaction", message_id: messageId, reaction }));
// //       }
// //     },
// //     [wsConnection]
// //   );

// //   const handleRemoveReaction = useCallback(
// //     (messageId: number) => {
// //       if (wsConnection) {
// //         wsConnection.send(JSON.stringify({ action: "remove_reaction", message_id: messageId }));
// //       }
// //     },
// //     [wsConnection]
// //   );

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       if (messagesEndRef.current) {
// //         const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
// //         isAtBottomRef.current = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
// //       }
// //     };
// //     const container = messagesEndRef.current;
// //     container?.addEventListener("scroll", handleScroll);
// //     return () => container?.removeEventListener("scroll", handleScroll);
// //   }, [messagesEndRef, isAtBottomRef]);

// //   return (
// //     <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={messagesEndRef}>
// //       <AnimatePresence>
// //         {Object.entries(groupedMessages).map(([date, groupedMsgs]) => (
// //           <div key={date}>
// //             <div className="text-center my-2">
// //               <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
// //                 {date}
// //               </span>
// //             </div>
// //             {groupedMsgs.map((message) => (
// //               <div id={`message-${message.id}`} key={message.id}>
// //                 <MessageBubble
// //                   message={message}
// //                   onReply={onReply}
// //                   onEdit={() => {}} // Placeholder for edit functionality
// //                   onDelete={handleDelete}
// //                   onReact={handleReact}
// //                   onRemoveReaction={handleRemoveReaction}
// //                   onScrollToMessage={onScrollToMessage}
// //                   onImageClick={setFullscreenImage}
// //                   currentUser={currentUserId}
// //                   messages={messages}
// //                   highlight={message.id === highlightedMessageId}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         ))}
// //       </AnimatePresence>
// //       <div ref={messagesEndRef} />
// //     </div>
// //   );
// // });

// // export default MessageList;

// import React, { useState, useMemo } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import Image from "next/image";
// import { Search, Loader2 } from "lucide-react";
// import { Chat } from "./types";

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// interface ChatListProps {
//   chats: Chat[];
//   selectedChatId: number | null;
//   onSelectChat: (chatId: number) => void;
//   isLoading: boolean;
// }

// const getImageUrl = (imagePath: string) =>
//   imagePath
//     ? imagePath.startsWith("http")
//       ? imagePath
//       : `${BASE_URL}${imagePath}`
//     : PLACEHOLDER_IMAGE;

// const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat, isLoading }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredChats = useMemo(() => {
//     if (!searchQuery.trim()) return chats;
//     return chats.filter(
//       (chat) =>
//         chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         chat.messages.some((msg) =>
//           msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     );
//   }, [chats, searchQuery]);

//   if (isLoading) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <Loader2 className="animate-spin text-gray-500" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full md:w-80 border-r bg-gray-50 overflow-y-auto flex flex-col">
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-semibold">Xabarlar</h2>
//         <div className="mt-2 flex items-center bg-gray-100 rounded-full p-2">
//           <Search size={20} className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Chatlarni qidirish..."
//             className="flex-1 bg-transparent outline-none text-sm"
//             aria-label="Search chats"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         <AnimatePresence>
//           {filteredChats.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">Chat topilmadi</div>
//           ) : (
//             filteredChats.map((chat) => (
//               <motion.div
//                 key={chat.id}
//                 className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
//                   selectedChatId === chat.id ? "bg-gray-100" : ""
//                 }`}
//                 onClick={() => onSelectChat(chat.id)}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={(e) => e.key === "Enter" && onSelectChat(chat.id)}
//               >
//                 <div className="relative">
//                   <Image
//                     src={getImageUrl(chat.contact.avatar)}
//                     alt={chat.contact.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full mr-3 object-contain"
//                   />
//                   {chat.unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-medium text-base truncate">{chat.contact.name}</h3>
//                   <p className="text-sm text-gray-600 truncate">
//                     {chat.messages[chat.messages.length - 1]?.content || "Xabar yo'q"}
//                   </p>
//                 </div>
//               </motion.div>
//             ))
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default ChatList;
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  wsConnection: WebSocket | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isAtBottomRef: React.MutableRefObject<boolean>;
  scrollToBottom: () => void;
  setFullscreenImage: (data: { images: string[]; index: number } | null) => void;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
  searchQuery: string;
}

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

const MessageList: React.FC<MessageListProps> = React.memo(({
  messages,
  currentUserId,
  wsConnection,
  messagesEndRef,
  isAtBottomRef,
  scrollToBottom,
  setFullscreenImage,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
  searchQuery,
}) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter((msg) =>
      msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const groupedMessages = useMemo(() => groupMessagesByDate(filteredMessages), [filteredMessages]);

  const handleDelete = useCallback((messageId: number) => {
    wsConnection?.send(JSON.stringify({ action: "delete_message", message_id: messageId }));
  }, [wsConnection]);

  const handleReact = useCallback((messageId: number, reaction: string) => {
    wsConnection?.send(JSON.stringify({ action: "add_reaction", message_id: messageId, reaction }));
  }, [wsConnection]);

  const handleRemoveReaction = useCallback((messageId: number) => {
    wsConnection?.send(JSON.stringify({ action: "remove_reaction", message_id: messageId }));
  }, [wsConnection]);

  const handleScrollToMessage = useCallback((id: number) => {
    const element = document.getElementById(`message-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setHighlightedMessageId(id);
      setTimeout(() => setHighlightedMessageId(null), 3000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current) {
        const container = messagesEndRef.current.parentElement as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = container;
        const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
        isAtBottomRef.current = atBottom;
        setShowScrollButton(!atBottom);
      }
    };
    const container = messagesEndRef.current?.parentElement;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [messagesEndRef, isAtBottomRef]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
      <AnimatePresence>
        {Object.entries(groupedMessages).map(([date, groupedMsgs]) => (
          <div key={date}>
            <div className="text-center my-2">
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            {groupedMsgs.map((message) => (
              <div id={`message-${message.id}`} key={message.id}>
                <MessageBubble
                  message={message}
                  onReply={setReplyingTo}
                  onEdit={setEditingMessage}
                  onDelete={handleDelete}
                  onReact={handleReact}
                  onRemoveReaction={handleRemoveReaction}
                  onScrollToMessage={handleScrollToMessage}
                  onImageClick={setFullscreenImage}
                  currentUserId={currentUserId}
                  messages={messages}
                  highlight={message.id === highlightedMessageId}
                />
              </div>
            ))}
          </div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
      {showScrollButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full p-2"
        >
          <ChevronDown size={20} />
        </Button>
      )}
    </div>
  );
});

export default MessageList;