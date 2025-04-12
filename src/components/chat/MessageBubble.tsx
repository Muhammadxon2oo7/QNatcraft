// import { motion } from "framer-motion";
// import { Reply, Edit, Trash2, Smile } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ReadReceipt from "./ReadReceipt";
// import { useState, useCallback } from "react";

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
//   reply_to?: number | { id: number; sender: Sender; content: string };
//   isEdited?: boolean;
//   created_at: string;
// }

// interface MessageBubbleProps {
//   message: Message;
//   onReply: (message: Message | null) => void;
//   onEdit: (message: Message) => void;
//   onDelete: (id: number) => void;
//   onReact: (id: number, emoji: string) => void;
//   onRemoveReaction: (messageId: number) => void;
//   onScrollToMessage: (id: number) => void;
//   onImageClick: (data: { images: string[]; index: number }) => void;
//   currentUser: number | string;
//   messages?: Message[];
// }

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";
// const PLACEHOLDER_AUDIO = "/placeholder-audio.mp3";

// const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice") =>
//   mediaPath ? (mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`) : (type === "image" ? PLACEHOLDER_IMAGE : PLACEHOLDER_AUDIO);

// const MessageBubble: React.FC<MessageBubbleProps> = ({
//   message,
//   onReply,
//   onEdit,
//   onDelete,
//   onReact,
//   onRemoveReaction,
//   onScrollToMessage,
//   onImageClick,
//   currentUser,
//   messages = [],
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);
//   const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🔥"];

//   const handleReact = useCallback((emoji: string) => {
//     onReact(message.id, emoji);
//     setShowReactions(false);
//   }, [message.id, onReact]);

//   const handleRemoveReaction = useCallback(() => {
//     onRemoveReaction(message.id);
//   }, [message.id, onRemoveReaction]);

//   const handleImageClick = useCallback((idx: number) => {
//     onImageClick({
//       images: message.images!.map((i) => getMediaUrl(i.image, "image")),
//       index: idx,
//     });
//   }, [message.images, onImageClick]);

//   const replyMessage = typeof message.reply_to === "number"
//     ? messages.find((msg) => msg.id === message.reply_to)
//     : message.reply_to;

//   return (
//     <motion.div
//       className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 w-full`}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onTouchStart={() => setIsHovered(true)}
//       onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
//     >
//       <div className="max-w-[70%] flex flex-col items-start relative">
//         {replyMessage && (
//           <div
//             className="bg-green-100 p-2 rounded-lg text-xs text-gray-600 border-l-4 border-green-300 cursor-pointer hover:bg-green-200 mb-2 w-full"
//             onClick={() => onScrollToMessage(typeof message.reply_to === "number" ? message.reply_to : message.reply_to!.id)}
//           >
//             <p className="font-medium">{replyMessage.sender?.first_name || "Noma'lum"}</p>
//             <p className="truncate">{replyMessage.content || "Xabar mavjud emas"}</p>
//           </div>
//         )}
//         <div className="flex-1 w-full relative">
//           <motion.div
//             className={`rounded-lg p-3 ${
//               message.isCurrentUser
//                 ? "bg-blue-500 text-white"
//                 : message.is_read
//                 ? "bg-white text-gray-800"
//                 : "bg-white text-gray-800"
//             } shadow w-full break-words relative`}
//             animate={
//               isHovered
//                 ? {
//                     boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
//                     background: message.isCurrentUser
//                       ? "linear-gradient(135deg, #3B82F6, #60A5FA)"
//                       : message.is_read
//                       ? "linear-gradient(135deg, #F3F4F6, #FFFFFF)"
//                       : "linear-gradient(135deg, #ff8581, #ffff)",
//                   }
//                 : { boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }
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
//                     className="max-w-[100px] rounded-lg cursor-pointer object-cover"
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
//               <p
//                 className="text-sm whitespace-pre-wrap"
//                 dangerouslySetInnerHTML={{ __html: message.content.replace(/<(b|i|u|mark)>(.*?)<\/\1>/g, "<$1>$2</$1>").replace(/<(\/?(b|i|u|mark))>/g, "") }}
//               />
//             )}
//             <div className="flex justify-between items-center mt-1 text-xs">
//               <span>
//                 {message.time}
//                 {message.isEdited && <span className="ml-1 text-gray-400 italic">(tahrirlandi)</span>}
//               </span>
//               {message.isCurrentUser && <ReadReceipt isRead={message.is_read} />}
//             </div>

//             {/* Tugmalar gradient chiziq bilan */}
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
//                   >
//                     <Reply size={12} />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white w-6 h-6 p-0 hover:from-yellow-600 hover:to-yellow-800 shadow-sm"
//                     onClick={() => setShowReactions(!showReactions)}
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
//                       >
//                         <Edit size={12} />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white w-6 h-6 p-0 hover:from-red-600 hover:to-red-800 shadow-sm"
//                         onClick={() => onDelete(message.id)}
//                       >
//                         <Trash2 size={12} />
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </motion.div>
//             )}

//             {/* Reaksiya tanlash oynasi */}
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
//                   onClick={() => reaction.user.id === currentUser && handleRemoveReaction()}
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
// };

// export default MessageBubble;



import { motion } from "framer-motion";
import { Reply, Edit, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useMemo } from "react";

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

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message | null) => void;
  onEdit: (message: Message) => void;
  onDelete: (id: number) => void;
  onReact: (id: number, emoji: string) => void;
  onRemoveReaction: (messageId: number) => void;
  onScrollToMessage: (id: number) => void;
  onImageClick: (data: { images: string[]; index: number }) => void;
  currentUser: number | string;
  messages: Message[];
}

const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";
const PLACEHOLDER_AUDIO = "/placeholder-audio.mp3";

const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice") =>
  mediaPath ? (mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`) : (type === "image" ? PLACEHOLDER_IMAGE : PLACEHOLDER_AUDIO);

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onRemoveReaction,
  onScrollToMessage,
  onImageClick,
  currentUser,
  messages,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🔥"];

  const handleReact = useCallback((emoji: string) => {
    onReact(message.id, emoji);
    setShowReactions(false);
  }, [message.id, onReact]);

  const handleRemoveReaction = useCallback(() => {
    onRemoveReaction(message.id);
  }, [message.id, onRemoveReaction]);

  const handleImageClick = useCallback((idx: number) => {
    onImageClick({
      images: message.images!.map((i) => getMediaUrl(i.image, "image")),
      index: idx,
    });
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
      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      <div className="max-w-[70%] flex flex-col items-start relative">
        {replyMessage && (
          <div
            className="bg-green-100 p-2 rounded-lg text-xs text-gray-600 border-l-4 border-green-300 cursor-pointer hover:bg-green-200 mb-2 w-full"
            onClick={() => onScrollToMessage(replyMessage.id)}
          >
            <p className="font-medium">{replyMessage.sender.first_name}</p>
            <p className="truncate">{replyMessage.content || "Xabar mavjud emas"}</p>
          </div>
        )}
        <div className="flex-1 w-full relative">
          <motion.div
            className={`rounded-lg p-3 ${
              message.isCurrentUser
                ? "bg-blue-500 text-white"
                : message.is_read
                ? "bg-white text-gray-800"
                : "bg-white text-gray-800"
            } shadow w-full break-words relative`}
            animate={
              isHovered
                ? {
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                    background: message.isCurrentUser
                      ? "linear-gradient(135deg, #3B82F6, #60A5FA)"
                      : message.is_read
                      ? "linear-gradient(135deg, #F3F4F6, #FFFFFF)"
                      : "linear-gradient(135deg, #ff8581, #ffff)",
                  }
                : { boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }
            }
            transition={{ duration: 0.2 }}
          >
            {message.images && message.images.length > 0 && (
  <div className="flex flex-wrap gap-2 mb-2">
    {message.images.map((img, idx) => (
      <img
        key={img.id}
        src={getMediaUrl(img.image, "image")}
        alt={`Image ${idx}`}
        className="max-w-[100px] rounded-lg cursor-pointer object-cover"
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
                className="mt-2 w-full min-w-[200px]"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER_AUDIO)}
              />
            )}
            {message.content && (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
            <div className="flex justify-between items-center mt-1 text-xs">
              <span>
                {message.time}
                {message.is_edited && <span className="ml-1 text-gray-400 italic">(tahrirlandi)</span>}
              </span>
            </div>

            {isHovered && (
              <motion.div
                className={`absolute top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10 ${
                  message.isCurrentUser ? "left-[-70px]" : "right-[-70px]"
                }`}
                initial={{ opacity: 0, x: message.isCurrentUser ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`h-1 w-6 ${
                    message.isCurrentUser
                      ? "bg-gradient-to-r from-gray-900 to-transparent"
                      : "bg-gradient-to-l from-gray-900 to-transparent"
                  }`}
                />
                <div className="flex gap-1 bg-gray-900 bg-opacity-50 p-1 rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white w-6 h-6 p-0 hover:from-green-600 hover:to-green-800 shadow-sm"
                    onClick={() => onReply(message)}
                  >
                    <Reply size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white w-6 h-6 p-0 hover:from-yellow-600 hover:to-yellow-800 shadow-sm"
                    onClick={() => setShowReactions(!showReactions)}
                  >
                    <Smile size={12} />
                  </Button>
                  {message.isCurrentUser && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white w-6 h-6 p-0 hover:from-blue-600 hover:to-blue-800 shadow-sm"
                        onClick={() => onEdit(message)}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white w-6 h-6 p-0 hover:from-red-600 hover:to-red-800 shadow-sm"
                        onClick={() => onDelete(message.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {showReactions && (
              <motion.div
                className={`absolute top-[-35px] flex gap-1 bg-gray-900 bg-opacity-50 p-1 rounded-full z-10 ${
                  message.isCurrentUser ? "right-0" : "left-0"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {reactionOptions.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="text-white w-6 h-6 p-0 hover:bg-gray-700 rounded-full"
                    onClick={() => handleReact(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="flex justify-start mt-1">
              {message.reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  className={`text-sm rounded-full px-2 py-1 mr-1 cursor-pointer ${
                    reaction.user.id === currentUser ? "bg-blue-200" : "bg-gray-200"
                  }`}
                  onClick={() => reaction.user.id === currentUser && handleRemoveReaction()}
                >
                  {reaction.reaction}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;