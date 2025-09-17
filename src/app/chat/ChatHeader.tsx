import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import { Contact } from "./types";
import { getMediaUrl } from "@/utils/helpers";

interface ChatHeaderProps {
  contact: Contact;
  onBack?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact, onBack, searchQuery, setSearchQuery }) => {
  return (
    <div className="p-3 sm:p-4 border-b bg-white flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to chat list" className="hover:bg-gray-100">
            <ChevronLeft size={24} className="text-gray-600" />
          </Button>
        )}
        <Image
          src={getMediaUrl(contact.avatar, "image")}
          alt={contact.name}
          width={48}
          height={48}
          className="rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h3 className="font-semibold text-lg sm:text-xl text-gray-800">{contact.name}</h3>
          <p className="text-sm text-gray-500">
            {contact.status === "online" ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Xabarni qidirish..."
            className="border rounded-full px-4 py-2 text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all w-32 sm:w-48 md:w-64"
          />
          <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;