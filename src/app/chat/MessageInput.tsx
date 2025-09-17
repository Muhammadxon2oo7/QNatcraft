import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Smile, Image as ImageIcon, Mic, X, Plus } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDebounce } from "@/hooks/useDebounce";
import { Message } from "./types";
import { BASE_URL } from "@/utils/constants";
import { toast } from "sonner";
import { useAuth } from "../../../context/auth-context";

interface MessageInputProps {
  chatId: number;
  wsConnection: WebSocket | null;
  getToken: () => string | null;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  wsConnection,
  getToken,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    if (editingMessage) {
      setInputValue(editingMessage.content || "");
      inputRef.current?.focus();
    } else {
      setInputValue("");
    }
  }, [editingMessage]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendMessage = useCallback(async () => {
    if (!wsConnection || (!debouncedInput.trim() && !selectedImages.length) || isSending) return;

    setIsSending(true);
    try {
      if (selectedImages.length > 0) {
        const token = await getToken();
        const formData = new FormData();
        if (debouncedInput.trim()) formData.append("content", debouncedInput);
        if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
        selectedImages.forEach((img) => formData.append("images", img));

        const response = await fetch(`${BASE_URL}/chat/chats/${chatId}/send-message/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!response.ok) throw new Error("Media upload failed");
        const serverMessage = await response.json();
        wsConnection.send(
          JSON.stringify({
            action: "sync_message",
            message_id: serverMessage.id,
          })
        );
      } else {
        const messageData: any = {
          action: editingMessage ? "edit_message" : "send_message",
          content: debouncedInput,
          chat_id: chatId,
        };
        if (editingMessage) messageData.message_id = editingMessage.id;
        if (replyingTo) messageData.reply_to = replyingTo.id;
        wsConnection.send(JSON.stringify(messageData));
      }

      setInputValue("");
      setSelectedImages([]);
      setReplyingTo(null);
      setEditingMessage(null);
    } catch (error) {
      toast.error("Xabar yuborishda xatolik yuz berdi.");
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  }, [chatId, wsConnection, debouncedInput, selectedImages, editingMessage, replyingTo, getToken, isSending]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("voice", audioBlob, "audio.webm");
        if (replyingTo) formData.append("reply_to", replyingTo.id.toString());

        try {
          const token = await getToken();
          const response = await fetch(`${BASE_URL}/chat/chats/${chatId}/send-message/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          if (!response.ok) throw new Error("Audio upload failed");
          const serverMessage = await response.json();
          wsConnection?.send(
            JSON.stringify({
              action: "sync_message",
              message_id: serverMessage.id,
              chat_id: chatId,
            })
          );
        } catch (error) {
          toast.error("Ovozli xabar yuborishda xatolik!");
          console.error("Error sending audio:", error);
        }

        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      toast.error("Ovozli xabar yozib olishda xatolik!");
      console.error("Error starting recording:", error);
    }
  }, [chatId, wsConnection, getToken, replyingTo]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
  }, []);

  const handleEmojiSelect = useCallback((emoji: { native: string }) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(selectedImages);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setSelectedImages(reorderedImages);
  }, [selectedImages]);

  return (
    <div className="p-3 sm:p-4 border-t bg-white relative shadow-sm">
      {(replyingTo || editingMessage) && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-3 shadow-sm">
          <p className="text-sm font-medium text-blue-700 truncate">
            {replyingTo
  ? `Replying to ${
      replyingTo.sender.id === user?.user_id
        ? "Siz"
        : replyingTo.sender.first_name
    }: ${replyingTo.content}`
  : `Editing: ${editingMessage?.content}`} 

          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setReplyingTo(null);
              setEditingMessage(null);
            }}
            aria-label="Cancel action"
            className="hover:bg-blue-100"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      {selectedImages.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                className="mb-3 flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedImages.map((img, idx) => (
                  <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative flex-shrink-0"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${idx}`}
                          className="w-24 h-24 rounded-lg object-cover shadow-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 rounded-full border-gray-300 hover:bg-gray-100"
                  aria-label="Add more images"
                >
                  <Plus size={20} />
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Show emoji picker"
          className="hover:bg-gray-200"
        >
          <Smile size={24} className="text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image"
          className="hover:bg-gray-200"
        >
          <ImageIcon size={24} className="text-gray-600" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          disabled={isSending}
          className={`relative ${isRecording ? "bg-red-100" : "hover:bg-gray-200"}`}
        >
          <Mic size={24} className={isRecording ? "text-red-500 animate-pulse" : "text-gray-600"} />
          {isRecording && (
            <motion.span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatDuration(recordingDuration)}
            </motion.span>
          )}
        </Button>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
          placeholder="Xabar yozing..."
          className="flex-1 bg-transparent outline-none px-4 py-2 text-sm text-gray-800 placeholder-gray-500 focus:ring-0"
          aria-label="Message input"
          disabled={isSending}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSendMessage}
          aria-label="Send message"
          disabled={isSending || (!debouncedInput.trim() && !selectedImages.length)}
          className="hover:bg-blue-100"
        >
          <Send size={24} className="text-blue-500" />
        </Button>
        {showEmojiPicker && (
          <motion.div
            className="absolute bottom-16 left-0 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;