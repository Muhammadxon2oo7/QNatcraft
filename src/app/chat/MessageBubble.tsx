// import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { Reply, Edit, Trash2, Smile } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Message, Sender } from "./types";

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";
// const PLACEHOLDER_AUDIO = "/placeholder-audio.mp3";

// interface MessageBubbleProps {
//   message: Message;
//   onReply: (message: Message | null) => void;
//   onEdit: (message: Message) => void;
//   onDelete: (id: number) => void;
//   onReact: (id: number, emoji: string) => void;
//   onRemoveReaction: (messageId: number) => void;
//   onScrollToMessage: (id: number) => void;
//   onImageClick: (data: { images: string[]; index: number }) => void;
//   currentUser: number;
//   messages: Message[];
//   highlight?: boolean;
// }

// const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice") =>
//   mediaPath
//     ? mediaPath.startsWith("http")
//       ? mediaPath
//       : `${BASE_URL}${mediaPath}`
//     : type === "image"
//       ? PLACEHOLDER_IMAGE
//       : PLACEHOLDER_AUDIO;

// const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ 
//   message,
//   onReply,
//   onEdit,
//   onDelete,
//   onReact,
//   onRemoveReaction,
//   onScrollToMessage,
//   onImageClick,
//   currentUser,
//   messages,
//   highlight = false,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);
//   const [isHighlighted, setIsHighlighted] = useState(highlight);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🔥"];

//   useEffect(() => {
//     if (highlight) {
//       setIsHighlighted(true);
//       const timer = setTimeout(() => setIsHighlighted(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [highlight]);

//   const handleReact = useCallback(
//     (emoji: string) => {
//       onReact(message.id, emoji);
//       setShowReactions(false);
//     },
//     [message.id, onReact]
//   );

//   const handleRemoveReaction = useCallback(() => {
//     onRemoveReaction(message.id);
//   }, [message.id, onRemoveReaction]);

//   const handleImageClick = useCallback(
//     (idx: number) => {
//       if (message.images) {
//         onImageClick({
//           images: message.images.map((i) => getMediaUrl(i.image, "image")),
//           index: idx,
//         });
//       }
//     },
//     [message.images, onImageClick]
//   );

//   const replyMessage = useMemo(() => {
//     if (!message.reply_to) return null;
//     if (typeof message.reply_to === "number") {
//       const foundMessage = messages.find((msg) => msg.id === message.reply_to);
//       return foundMessage && foundMessage.sender ? foundMessage : null;
//     }
//     return message.reply_to && message.reply_to.sender ? message.reply_to : null;
//   }, [message.reply_to, messages]);

//   const handleTouchEnd = useCallback(() => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(() => setIsHovered(false), 2000);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);

//   return (
//     <motion.div
//       className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 w-full`}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onTouchStart={() => setIsHovered(true)}
//       onTouchEnd={handleTouchEnd}
//     >
//       <div className="max-w-[70%] sm:max-w-[60%] flex flex-col items-start relative">
//         {replyMessage && (
//           <div
//             className="bg-green-100 p-2 rounded-lg text-xs text-gray-600 border-l-4 border-green-300 cursor-pointer hover:bg-green-200 mb-2 w-full"
//             onClick={() => replyMessage.id && onScrollToMessage(replyMessage.id)}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => e.key === "Enter" && replyMessage.id && onScrollToMessage(replyMessage.id)}
//           >
//             <p className="font-medium">{replyMessage.sender?.first_name || "Noma'lum"}</p>
//             <p className="truncate">{replyMessage.content || "Xabar mavjud emas"}</p>
//           </div>
//         )}
//         <div className="flex-1 w-full relative">
//           <motion.div
//             className={`rounded-lg p-3 shadow w-full break-words relative ${
//               message.isCurrentUser
//                 ? "bg-blue-500 text-white"
//                 : message.is_read
//                   ? "bg-white text-gray-800"
//                   : "bg-white text-gray-800"
//             } ${isHighlighted ? "border-2 border-blue-400" : ""}`}
//             animate={
//               isHovered
//                 ? {
//                     boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
//                     background: message.isCurrentUser
//                       ? "linear-gradient(135deg, #3B82F6, #60A5FA)"
//                       : message.is_read
//                         ? "linear-gradient(135deg, #F3F4F6, #FFFFFF)"
//                         : "linear-gradient(135deg, #ff8581, #ffff)",
//                   }
//                 : isHighlighted
//                   ? { boxShadow: "0 4px 15px rgba(16, 185, 129, 0.5)" }
//                   : { boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }
//             }
//             transition={{ duration: 0.2 }}
//           >
//             {message.images && message.images.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {message.images.map((img, idx) => (
//                   <img
//                     key={img.id}
//                     src={getMediaUrl(img.image, "image")}
//                     alt={`Image ${idx}`}
//                     className="max-w-[100px] sm:max-w-[150px] rounded-lg cursor-pointer object-cover"
//                     onClick={() => handleImageClick(idx)}
//                     onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
//                   />
//                 ))}
//               </div>
//             )}
//             {message.voice && (
//               <audio
//                 controls
//                 src={getMediaUrl(message.voice, "voice")}
//                 className="mt-2 w-full min-w-[200px]"
//                 onError={(e) => (e.currentTarget.src = PLACEHOLDER_AUDIO)}
//               />
//             )}
//             {message.content && (
//               <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//             )}
//             <div className="flex justify-between items-center mt-1 text-xs">
//               <span>
//                 {message.time}
//                 {message.is_edited && (
//                   <span className="ml-1 text-gray-400 italic">(tahrirlandi)</span>
//                 )}
//               </span>
//             </div>

//             {isHovered && (
//               <motion.div
//                 className={`absolute top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10 ${
//                   message.isCurrentUser ? "left-[-70px]" : "right-[-70px]"
//                 }`}
//                 initial={{ opacity: 0, x: message.isCurrentUser ? -10 : 10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div
//                   className={`h-1 w-6 ${
//                     message.isCurrentUser
//                       ? "bg-gradient-to-r from-gray-900 to-transparent"
//                       : "bg-gradient-to-l from-gray-900 to-transparent"
//                   }`}
//                 />
//                 <div className="flex gap-1 bg-gray-900 bg-opacity-50 p-1 rounded-full">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white w-6 h-6 p-0 hover:from-green-600 hover:to-green-800 shadow-sm"
//                     onClick={() => onReply(message)}
//                     aria-label="Reply to message"
//                   >
//                     <Reply size={12} />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white w-6 h-6 p-0 hover:from-yellow-600 hover:to-yellow-800 shadow-sm"
//                     onClick={() => setShowReactions(!showReactions)}
//                     aria-label="Show reactions"
//                   >
//                     <Smile size={12} />
//                   </Button>
//                   {message.isCurrentUser && (
//                     <>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white w-6 h-6 p-0 hover:from-blue-600 hover:to-blue-800 shadow-sm"
//                         onClick={() => onEdit(message)}
//                         aria-label="Edit message"
//                       >
//                         <Edit size={12} />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white w-6 h-6 p-0 hover:from-red-600 hover:to-red-800 shadow-sm"
//                         onClick={() => onDelete(message.id)}
//                         aria-label="Delete message"
//                       >
//                         <Trash2 size={12} />
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </motion.div>
//             )}

//             {showReactions && (
//               <motion.div
//                 className={`absolute top-[-35px] flex gap-1 bg-gray-900 bg-opacity-50 p-1 rounded-full z-10 ${
//                   message.isCurrentUser ? "right-0" : "left-0"
//                 }`}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 {reactionOptions.map((emoji) => (
//                   <Button
//                     key={emoji}
//                     variant="ghost"
//                     size="sm"
//                     className="text-white w-6 h-6 p-0 hover:bg-gray-700 rounded-full"
//                     onClick={() => handleReact(emoji)}
//                     aria-label={`React with ${emoji}`}
//                   >
//                     {emoji}
//                   </Button>
//                 ))}
//               </motion.div>
//             )}
//           </motion.div>

//           {message.reactions && message.reactions.length > 0 && (
//             <div className="flex justify-start mt-1">
//               {message.reactions.map((reaction) => (
//                 <span
//                   key={reaction.id}
//                   className={`text-sm rounded-full px-2 py-1 mr-1 cursor-pointer ${
//                     reaction.user.id === currentUser ? "bg-blue-200" : "bg-gray-200"
//                   }`}
//                   onClick={() =>
//                     reaction.user.id === currentUser && handleRemoveReaction()
//                   }
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={(e) =>
//                     e.key === "Enter" && reaction.user.id === currentUser && handleRemoveReaction()
//                   }
//                 >
//                   {reaction.reaction}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// });

// export default MessageBubble;

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Reply, Edit, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, Sender } from "./types";

const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";
const PLACEHOLDER_AUDIO = "/placeholder-audio.mp3";

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message | null) => void;
  onEdit: (message: Message) => void;
  onDelete: (id: number) => void;
  onReact: (id: number, emoji: string) => void;
  onRemoveReaction: (messageId: number) => void;
  onScrollToMessage: (id: number) => void;
  onImageClick: (data: { images: string[]; index: number }) => void;
  currentUserId: number;
  messages: Message[];
  highlight?: boolean;
}

const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice") =>
  mediaPath
    ? mediaPath.startsWith("http")
      ? mediaPath
      : `${BASE_URL}${mediaPath}`
    : type === "image" ? PLACEHOLDER_IMAGE : PLACEHOLDER_AUDIO;

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  message,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onRemoveReaction,
  onScrollToMessage,
  onImageClick,
  currentUserId,
  messages,
  highlight = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(highlight);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🔥"];

  useEffect(() => {
    if (highlight) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setIsHovered(true), 500); // Delay 500ms
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
    setShowReactions(false);
  };

  const handleReact = useCallback((emoji: string) => {
    onReact(message.id, emoji);
    setShowReactions(false);
  }, [message.id, onReact]);

  const handleRemoveReaction = useCallback(() => {
    onRemoveReaction(message.id);
  }, [message.id, onRemoveReaction]);

  const handleImageClick = useCallback((idx: number) => {
    if (message.images) {
      onImageClick({
        images: message.images.map((i) => getMediaUrl(i.image, "image")),
        index: idx,
      });
    }
  }, [message.images, onImageClick]);

  const replyMessage = useMemo(() => {
    if (!message.reply_to) return null;
    if (typeof message.reply_to === "number") {
      return messages.find((msg) => msg.id === message.reply_to) || null;
    }
    return message.reply_to;
  }, [message.reply_to, messages]);

  return (
    <motion.div
      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[70%] flex flex-col">
        {replyMessage && (
          <div
            className="bg-green-100 p-2 rounded-lg text-xs text-gray-600 border-l-4 border-green-300 cursor-pointer hover:bg-green-200 mb-2"
            onClick={() => replyMessage.id && onScrollToMessage(replyMessage.id)}
          >
            <p className="font-medium">{replyMessage.sender?.first_name || "Unknown"}</p>
            <p className="truncate">{replyMessage.content || "No message"}</p>
          </div>
        )}
        <motion.div
          className={`rounded-lg p-3 shadow ${
            message.isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800"
          } ${isHighlighted ? "border-2 border-blue-400" : ""}`}
          animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {message.images.map((img, idx) => (
                <img
                  key={img.id}
                  src={getMediaUrl(img.image, "image")}
                  alt={`Image ${idx}`}
                  className="max-w-[150px] rounded-lg cursor-pointer object-cover"
                  onClick={() => handleImageClick(idx)}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                />
              ))}
            </div>
          )}
          {message.voice && (
            <audio
              controls
              src={getMediaUrl(message.voice, "voice")}
              className="mt-2 w-full"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER_AUDIO)}
            />
          )}
          {message.content && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}
          <div className="flex justify-between items-center mt-1 text-xs">
            <span>
              {message.time}
              {message.is_edited && <span className="ml-1 italic">(edited)</span>}
            </span>
            {message.isCurrentUser && (
              <span className="ml-2">{message.is_read ? "Seen" : "Sent"}</span>
            )}
          </div>
        </motion.div>
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex mt-1">
            {message.reactions.map((reaction) => (
              <span
                key={reaction.id}
                className={`text-sm px-1 mr-1 cursor-pointer ${reaction.user.id === currentUserId ? "bg-blue-200" : "bg-gray-200"} rounded-full`}
                onClick={() => reaction.user.id === currentUserId && handleRemoveReaction()}
              >
                {reaction.reaction}
              </span>
            ))}
          </div>
        )}
        {isHovered && (
          <motion.div
            className="flex gap-1 mt-2 justify-end if not current user left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button size="sm" onClick={() => onReply(message)}><Reply size={16} /></Button>
            <Button size="sm" onClick={() => setShowReactions(true)}><Smile size={16} /></Button>
            {message.isCurrentUser && (
              <>
                <Button size="sm" onClick={() => onEdit(message)}><Edit size={16} /></Button>
                <Button size="sm" onClick={() => onDelete(message.id)}><Trash2 size={16} /></Button>
              </>
            )}
          </motion.div>
        )}
        {showReactions && (
          <motion.div
            className="flex gap-1 mt-1 justify-end if not current user left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {reactionOptions.map((emoji) => (
              <Button key={emoji} size="sm" onClick={() => handleReact(emoji)}>
                {emoji}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default MessageBubble;