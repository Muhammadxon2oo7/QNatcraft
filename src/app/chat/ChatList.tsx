import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { Chat } from "./types";
import { getMediaUrl } from "@/utils/helpers";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

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
    <div className="w-full md:w-96 lg:w-[28rem] border-r bg-gray-50 overflow-y-auto flex flex-col transition-all duration-300">
      <div className="p-4 border-b bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Xabarlar</h2>
        <div className="mt-3 flex items-center bg-gray-100 rounded-full p-2">
          <Search size={20} className="text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Chatlarni qidirish..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 focus:ring-0"
            aria-label="Search chats"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredChats.map((chat) => (
            <motion.div
              key={chat.id}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                selectedChatId === chat.id ? "bg-gray-100 border-l-4 border-blue-500" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectChat(chat.id)}
            >
              <div className="relative">
                <Image
                  src={getMediaUrl(chat.contact.avatar, "image")}
                  alt={chat.contact.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-3 object-cover border border-gray-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{chat.contact.name}</h3>
                  <span className="text-xs text-gray-500">
                    {chat.messages[chat.messages.length - 1]?.time || ""}
                  </span>
                </div>
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