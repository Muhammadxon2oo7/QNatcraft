import { motion } from "framer-motion";
import { Reply, Edit, Trash2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReadReceipt from "./ReadReceipt";
import { useState } from "react";

interface Sender {
  id: number;
  email: string;
  first_name: string;
 
  profile: { profile_image: string };
}

interface Message {
  id: number;
  sender: Sender;
  content?: string;
  images?: { id: number; image: string }[];
  voice?: string;
  time: string;
  isCurrentUser: boolean;
  is_read: boolean;
  reactions?: { id: number; user: Sender; reaction: string }[];
  reply_to?: { id: number; sender: Sender; content: string };
  isEdited?: boolean;
  created_at: string; // Add this property
}

interface MessageBubbleProps {
  message: Message;
  onReply: (message: Message | null) => void; // Update this
  onEdit: (message: Message) => void;
  onDelete: (id: number) => void;
  onReact: (id: number, emoji: string) => void;
  onScrollToMessage: (id: number) => void;
  onImageClick: (data: { images: string[]; index: number }) => void;
  currentUser: number | string;
}
const BASE_URL = "https://qqrnatcraft.uz"; // Backend domeni
const PLACEHOLDER_IMAGE = "/placeholder.jpg"; // Muqobil rasm yo‘li
const PLACEHOLDER_AUDIO = "/placeholder-audio.mp3"; // Muqobil ovoz fayli (mavjud bo‘lishi kerak)

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onScrollToMessage,
  onImageClick,
  currentUser,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🔥"];

  const handleReact = (emoji: string) => {
    onReact(message.id, emoji);
    setShowReactions(false);
  };

  // Media URL’ni to‘liq qilish uchun umumiy funksiya (rasm va ovoz uchun)
  const getMediaUrl = (mediaPath: string | undefined, type: "image" | "voice") => {
    if (!mediaPath) return type === "image" ? PLACEHOLDER_IMAGE : PLACEHOLDER_AUDIO;
    return mediaPath.startsWith("http") ? mediaPath : `${BASE_URL}${mediaPath}`;
  };

  return (
    <motion.div
      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"} mb-4 w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-[70%] flex items-start">
        <div className="flex-1">
          {message.reply_to && (
            <div
              className="bg-gray-100 p-2 rounded-t-lg text-xs text-gray-600 border-l-4 border-blue-300 cursor-pointer hover:bg-gray-200"
              onClick={() => onScrollToMessage(message.reply_to!.id)}
            >
              <p className="font-medium">{message.reply_to.sender.first_name}</p>
              <p className="truncate">{message.reply_to.content}</p>
            </div>
          )}
          <div
            className={`rounded-lg p-3 ${
              message.isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800"
            } shadow w-full break-words`}
          >
            {message.images && message.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {message.images.map((img, idx) => (
                  <img
                    key={img.id}
                    src={getMediaUrl(img.image, "image")}
                    alt={`Image ${idx}`}
                    className="max-w-[100px] rounded-lg cursor-pointer object-cover"
                    onClick={() =>
                      onImageClick({
                        images: message.images!.map((i) => getMediaUrl(i.image, "image")),
                        index: idx,
                      })
                    }
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE; // Agar rasm yuklanmasa
                    }}
                  />
                ))}
              </div>
            )}
            {message.voice && (
              <audio
                controls
                src={getMediaUrl(message.voice, "voice")}
                className="mt-2 w-full min-w-[200px]"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_AUDIO; // Agar ovoz yuklanmasa
                }}
              />
            )}
            {message.content && (
              <p
                className="text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/<(b|i|u|mark)>(.*?)<\/\1>/g, "<$1>$2</$1>")
                    .replace(/<(\/?(b|i|u|mark))>/g, ""),
                }}
              />
            )}
            <div className="flex justify-between items-center mt-1 text-xs">
              <span>
                {message.time}
                {message.isEdited && <span className="ml-1 text-gray-400 italic">(tahrirlangan)</span>}
              </span>
              {message.isCurrentUser && <ReadReceipt isRead={message.is_read} />}
            </div>
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="flex justify-start mt-1">
              {message.reactions.map((reaction) => (
                <span key={reaction.id} className="text-sm bg-gray-200 rounded-full px-2 py-1 mr-1">
                  {reaction.reaction}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center mt-2 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center"
            >
              <Smile size={14} />
            </Button>
            {showReactions && (
              <div className="flex space-x-1 overflow-x-auto w-[100px] noscroll">
                {reactionOptions.map((emoji) => (
                  <Button key={emoji} variant="ghost" size="sm" onClick={() => handleReact(emoji)}>
                    {emoji}
                  </Button>
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(message)}
              className="flex items-center"
            >
              <Reply size={14} />
            </Button>
            {message.isCurrentUser && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onEdit(message)}>
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(message.id)}>
                  <Trash2 size={14} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;