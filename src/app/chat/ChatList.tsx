import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { Chat } from "./types";

const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

const getImageUrl = (imagePath: string) =>
  imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`
    : PLACEHOLDER_IMAGE;

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    return chats.filter(
      (chat) =>
        chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some((msg) =>
          msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [chats, searchQuery]);

  return (
    <div className="w-full md:w-80 border-r bg-gray-50 overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Xabarlar</h2>
        <div className="mt-2 flex items-center bg-gray-100 rounded-full p-2">
          <Search size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chatlarni qidirish..."
            className="flex-1 bg-transparent outline-none text-sm"
            aria-label="Search chats"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedChatId === chat.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectChat(chat.id)}
            >
              <div className="relative">
                <Image
                  src={getImageUrl(chat.contact.avatar)}
                  alt={chat.contact.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3 object-cover"
                />
                {chat.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base truncate">{chat.contact.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {chat.messages[chat.messages.length - 1]?.content || "Xabar yo'q"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatList;