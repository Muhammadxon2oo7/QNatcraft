import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import { Message } from "./types";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  wsConnection: WebSocket | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
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
  setFullscreenImage,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
  searchQuery,
}) => {
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter((msg) =>
      msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const groupedMessages = useMemo(() => groupMessagesByDate(filteredMessages), [filteredMessages]);

  const handleDelete = (messageId: number) => {
    if (wsConnection) {
      wsConnection.send(JSON.stringify({ action: "delete_message", message_id: messageId }));
    }
  };

  const handleReact = (messageId: number, reaction: string) => {
    if (wsConnection) {
      wsConnection.send(JSON.stringify({ action: "add_reaction", message_id: messageId, reaction }));
    }
  };

  const handleRemoveReaction = (messageId: number) => {
    if (wsConnection) {
      wsConnection.send(JSON.stringify({ action: "remove_reaction", message_id: messageId }));
    }
  };

  const handleScrollToMessage = (id: number) => {
    const element = document.getElementById(`message-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setHighlightedMessageId(id);
      setTimeout(() => setHighlightedMessageId(null), 3000);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 relative scrollbar-thin scrollbar-thumb-gray-300">
      <AnimatePresence>
        {Object.entries(groupedMessages).map(([date, groupedMsgs]) => (
          <div key={date}>
            <div className="text-center my-3">
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
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
    </div>
  );
});

export default MessageList;