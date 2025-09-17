// import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
// import { motion, PanInfo } from "framer-motion";
// import { Reply, Edit, Trash2, Smile } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
// import { Message } from "./types";
// import { getMediaUrl } from "@/utils/helpers";

// interface MessageBubbleProps {
//   message: Message;
//   onReply: (message: Message | null) => void;
//   onEdit: (message: Message) => void;
//   onDelete: (id: number) => void;
//   onReact: (id: number, emoji: string) => void;
//   onRemoveReaction: (messageId: number) => void;
//   onScrollToMessage: (id: number) => void;
//   onImageClick: (data: { images: string[]; index: number }) => void;
//   currentUserId: number;
//   messages: Message[];
//   highlight?: boolean;
// }

// const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
//   ({
//     message,
//     onReply,
//     onEdit,
//     onDelete,
//     onReact,
//     onRemoveReaction,
//     onScrollToMessage,
//     onImageClick,
//     currentUserId,
//     messages,
//     highlight = false,
//   }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [showReactions, setShowReactions] = useState(false);
//     const [isHighlighted, setIsHighlighted] = useState(highlight);
//     const [swipeOffset, setSwipeOffset] = useState(0);
//     const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//       if (highlight) {
//         setIsHighlighted(true);
//         const timer = setTimeout(() => setIsHighlighted(false), 3000);
//         return () => clearTimeout(timer);
//       }
//     }, [highlight]);

//     const handleMouseEnter = () => {
//       hoverTimeout.current = setTimeout(() => setIsHovered(true), 500);
//     };

//     const handleMouseLeave = () => {
//       if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
//       setIsHovered(false);
//       setShowReactions(false);
//       setSwipeOffset(0);
//     };

//     const handleEmojiSelect = useCallback(
//       (emoji: { native: string }) => {
//         onReact(message.id, emoji.native);
//         setShowReactions(false);
//       },
//       [message.id, onReact]
//     );

//     const handleImageClick = useCallback(
//       (idx: number) => {
//         if (message.images) {
//           onImageClick({
//             images: message.images.map((i) => getMediaUrl(i.image, "image")),
//             index: idx,
//           });
//         }
//       },
//       [message.images, onImageClick]
//     );

//     const handleDrag = (_: any, info: PanInfo) => {
//       if (Math.abs(info.offset.x) > 50) {
//         setSwipeOffset(info.offset.x);
//       }
//     };

//     const handleDragEnd = () => {
//       if (Math.abs(swipeOffset) > 50) {
//         onReply(message);
//       }
//       setSwipeOffset(0);
//     };

//     const replyMessage = useMemo(() => {
//       if (!message.reply_to) return null;
//       if (typeof message.reply_to === "number") {
//         return messages.find((msg) => msg.id === message.reply_to) || null;
//       }
//       return message.reply_to;
//     }, [message.reply_to, messages]);

//     const displayName = replyMessage
//       ? replyMessage.sender.id === currentUserId
//         ? "Siz"
//         : replyMessage.sender.first_name
//       : null;

//     return (
//       <motion.div
//         className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 px-2 sm:px-4 relative`}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0, x: swipeOffset }}
//         transition={{ duration: 0.5 }}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         drag={message.isCurrentUser ? "x" : false}
//         dragConstraints={{ left: 0, right: 100 }}
//         onDrag={handleDrag}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col relative">
//           {replyMessage && (
//             <div
//               className="bg-blue-50 p-3 rounded-lg text-sm text-gray-600 border-l-4 border-blue-300 cursor-pointer hover:bg-blue-100 mb-2 transition-colors"
//               onClick={() => replyMessage.id && onScrollToMessage(replyMessage.id)}
//             >
//               <p className="font-medium text-blue-700">{displayName}</p>
//               <p className="truncate">{replyMessage.content || "No message"}</p>
//             </div>
//           )}
//           <motion.div
//             className={`rounded-2xl p-4 shadow-md ${
//               message.isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"
//             } ${isHighlighted ? "border-2 border-blue-400 shadow-lg" : ""}`}
//             animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
//             transition={{ duration: 0.2 }}
//           >
//             {message.images && message.images.length > 0 && (
//               <div className="grid grid-cols-2 gap-2 mb-3">
//                 {message.images.map((img, idx) => (
//                   <img
//                     key={img.id}
//                     src={getMediaUrl(img.image, "image")}
//                     alt={`Image ${idx}`}
//                     className="w-32 h-32 rounded-lg cursor-pointer object-cover"
//                     onClick={() => handleImageClick(idx)}
//                   />
//                 ))}
//               </div>
//             )}
//             {message.voice && (
//               <div className="mt-2 w-64 relative">
//                 <audio
//                   controls
//                   src={getMediaUrl(message.voice, "voice")}
//                   className="w-full rounded-lg"
//                 />
//               </div>
//             )}
//             {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}
//             <div className="flex justify-between items-center mt-2 text-xs">
//               <span className={message.isCurrentUser ? "text-blue-100" : "text-gray-500"}>
//                 {message.time}
//                 {message.is_edited && <span className="ml-1 italic">(edited)</span>}
//               </span>
//               {message.isCurrentUser && (
//                 <span className="ml-2 text-blue-100">{message.is_read ? "Seen" : "Sent"}</span>
//               )}
//             </div>
//           </motion.div>
//           {message.reactions && message.reactions.length > 0 && (
//             <div className="flex mt-2 space-x-1">
//               {message.reactions.map((reaction) => (
//                 <span
//                   key={reaction.id}
//                   className={`text-sm px-2 py-1 cursor-pointer ${
//                     reaction.user.id === currentUserId ? "bg-blue-100" : "bg-gray-100"
//                   } rounded-full shadow-sm hover:bg-opacity-80`}
//                   onClick={() => reaction.user.id === currentUserId && onRemoveReaction(message.id)}
//                 >
//                   {reaction.reaction}
//                 </span>
//               ))}
//             </div>
//           )}
//           {isHovered && (
//             <motion.div
//               className="flex gap-1 mt-2 justify-end absolute -top-10 right-0 bg-white rounded-lg shadow-lg p-1"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => onReply(message)}
//                 className="hover:bg-gray-100"
//               >
//                 <Reply size={16} />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setShowReactions(true)}
//                 className="hover:bg-gray-100"
//               >
//                 <Smile size={16} />
//               </Button>
//               {message.isCurrentUser && (
//                 <>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => onEdit(message)}
//                     className="hover:bg-gray-100"
//                   >
//                     <Edit size={16} />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => onDelete(message.id)}
//                     className="hover:bg-red-100"
//                   >
//                     <Trash2 size={16} />
//                   </Button>
//                 </>
//               )}
//             </motion.div>
//           )}
//           {showReactions && (
//             <motion.div
//               className="absolute z-20 mt-2 right-0"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     );
//   }
// );

// export default MessageBubble;
import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { Reply, Edit, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "./types";
import { getMediaUrl } from "@/utils/helpers";

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

const MessageBubble: React.FC<MessageBubbleProps> = React.memo(
  ({
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
    const [swipeOffset, setSwipeOffset] = useState(0);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (highlight) {
        setIsHighlighted(true);
        const timer = setTimeout(() => setIsHighlighted(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [highlight]);

    const handleMouseEnter = () => {
      hoverTimeout.current = setTimeout(() => setIsHovered(true), 500);
    };

    const handleMouseLeave = () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setIsHovered(false);
      setShowReactions(false);
      setSwipeOffset(0);
    };

    const handleImageClick = useCallback(
      (idx: number) => {
        if (message.images) {
          onImageClick({
            images: message.images.map((i) => getMediaUrl(i.image, "image")),
            index: idx,
          });
        }
      },
      [message.images, onImageClick]
    );

    const handleDrag = (_: any, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 50) {
        setSwipeOffset(info.offset.x);
      }
    };

    const handleDragEnd = () => {
      if (Math.abs(swipeOffset) > 50) {
        onReply(message);
      }
      setSwipeOffset(0);
    };

    const replyMessage = useMemo(() => {
      if (!message.reply_to) return null;
      if (typeof message.reply_to === "number") {
        return messages.find((msg) => msg.id === message.reply_to) || null;
      }
      return message.reply_to;
    }, [message.reply_to, messages]);

    const displayName = replyMessage
      ? replyMessage.sender.id === currentUserId
        ? "Siz"
        : replyMessage.sender.first_name
      : null;

    return (
      <motion.div
        className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 px-2 sm:px-4 relative`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: swipeOffset }}
        transition={{ duration: 0.5 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        drag="x"
        dragConstraints={{ left: 0, right: 100 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <div className="max-w-[85%] sm:max-w-[75%] md:max-w-[65%] flex flex-col relative">
          {replyMessage && (
            <div
              className={`bg-blue-50 p-3 rounded-lg text-sm text-gray-600 border-l-4 border-blue-300 cursor-pointer hover:bg-blue-100 mb-2 transition-colors ${
                isHighlighted ? "bg-yellow-100" : ""
              }`}
              onClick={() => replyMessage.id && onScrollToMessage(replyMessage.id)}
            >
              <p className="font-medium text-blue-700">{displayName}</p>
              <p className="truncate">{replyMessage.content || "No message"}</p>
            </div>
          )}
          <motion.div
            className={`rounded-2xl p-4 shadow-md ${
              message.isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"
            } ${isHighlighted ? "border-2 border-yellow-400 shadow-lg" : ""}`}
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {message.images && message.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {message.images.map((img, idx) => (
                  <img
                    key={img.id}
                    src={getMediaUrl(img.image, "image")}
                    alt={`Image ${idx}`}
                    className="w-32 h-32 rounded-lg cursor-pointer object-cover"
                    onClick={() => handleImageClick(idx)}
                  />
                ))}
              </div>
            )}
            {message.voice && (
              <div className="mt-2 w-64 relative">
                <audio
                  controls
                  src={getMediaUrl(message.voice, "voice")}
                  className="w-full rounded-lg"
                />
              </div>
            )}
            {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}
            <div className="flex justify-between items-center mt-2 text-xs">
              <span className={message.isCurrentUser ? "text-blue-100" : "text-gray-500"}>
                {message.time}
                {message.is_edited && <span className="ml-1 italic">(edited)</span>}
              </span>
              {message.isCurrentUser && (
                <span className="ml-2 text-blue-100">{message.is_read ? "Seen" : "Sent"}</span>
              )}
            </div>
          </motion.div>
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex mt-2 space-x-1">
              {message.reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  className={`text-sm px-2 py-1 cursor-pointer ${
                    reaction.user.id === currentUserId ? "bg-blue-100" : "bg-gray-100"
                  } rounded-full shadow-sm hover:bg-opacity-80`}
                  onClick={() => reaction.user.id === currentUserId && onRemoveReaction(message.id)}
                >
                  {reaction.reaction}
                </span>
              ))}
            </div>
          )}
          {isHovered && (
            <motion.div
              className="flex gap-1 mt-2 justify-end absolute -top-10 right-0 bg-white rounded-lg shadow-lg p-1 z-40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReply(message)}
                className="hover:bg-gray-100"
              >
                <Reply size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReactions(true)}
                className="hover:bg-gray-100"
              >
                <Smile size={16} />
              </Button>
              {message.isCurrentUser && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(message)}
                    className="hover:bg-gray-100"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(message.id)}
                    className="hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </Button>
                </>
              )}
            </motion.div>
          )}
          {showReactions && (
            <motion.div
              className="absolute z-100 mt-2 right-0 bg-white rounded-lg shadow-lg p-2 flex gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onReact(message.id, "❤️");
                  setShowReactions(false);
                }}
                className="hover:bg-gray-100"
              >
                ❤️
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onReact(message.id, "🔥");
                  setShowReactions(false);
                }}
                className="hover:bg-gray-100"
              >
                🔥
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onReact(message.id, "👍");
                  setShowReactions(false);
                }}
                className="hover:bg-gray-100"
              >
                👍
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onReact(message.id, "👎");
                  setShowReactions(false);
                }}
                className="hover:bg-gray-100"
              >
                👎
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
);

export default MessageBubble;
