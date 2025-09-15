// import React, { useCallback } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Search, ChevronLeft } from "lucide-react";
// import { Contact } from "./types";

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// interface ChatHeaderProps {
//   contact: Contact;
//   onSearch?: (query: string) => void;
//   onBack?: () => void;
// }

// const getImageUrl = (imagePath: string) =>
//   imagePath
//     ? imagePath.startsWith("http")
//       ? imagePath
//       : `${BASE_URL}${imagePath}`
//     : PLACEHOLDER_IMAGE;

// const ChatHeader: React.FC<ChatHeaderProps> = ({ contact, onSearch, onBack }) => {
//   const [searchQuery, setSearchQuery] = React.useState("");

//   const handleSearch = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       setSearchQuery(value);
//       onSearch?.(value);
//     },
//     [onSearch]
//   );

//   return (
//     <div className="p-4 border-b bg-white flex items-center justify-between flex-wrap">
//       <div className="flex items-center">
//         {onBack && (
//           <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to chat list" className="mr-2">
//             <ChevronLeft size={20} />
//           </Button>
//         )}
//         <Image
//           src={getImageUrl(contact.avatar)}
//           alt={contact.name}
//           width={40}
//           height={40}
//           className="rounded-full mr-3"
//           style={{ objectFit: 'contain' }}
//         />
//         <div>
//           <h3 className="font-semibold text-sm sm:text-base">{contact.name}</h3>
//           <p className="text-xs sm:text-sm text-gray-500">
//             {contact.status === "online" ? "Online" : "Offline"}
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center space-x-2 mt-2 sm:mt-0">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={handleSearch}
//           placeholder="Xabarni qidirish..."
//           className="border rounded-lg px-2 py-1 text-xs sm:text-sm w-full sm:w-auto"
//           aria-label="Search messages"
//         />
//         <Button variant="ghost" size="sm" aria-label="Search">
//           <Search size={20} />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import { Contact } from "./types";

const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

interface ChatHeaderProps {
  contact: Contact;
  onBack?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const getImageUrl = (imagePath: string) =>
  imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`
    : PLACEHOLDER_IMAGE;

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact, onBack, searchQuery, setSearchQuery }) => {
  return (
    <div className="p-4 border-b bg-white flex items-center justify-between">
      <div className="flex items-center">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to chat list" className="mr-2">
            <ChevronLeft size={20} />
          </Button>
        )}
        <Image
          src={getImageUrl(contact.avatar)}
          alt={contact.name}
          width={40}
          height={40}
          className="rounded-full mr-3 object-cover"
        />
        <div>
          <h3 className="font-semibold text-base">{contact.name}</h3>
          <p className="text-sm text-gray-500">
            {contact.status === "online" ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Xabarni qidirish..."
          className="border rounded-lg px-2 py-1 text-sm w-40 md:w-auto"
        />
        <Button variant="ghost" size="sm" aria-label="Search">
          <Search size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;