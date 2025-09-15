// import React, { useState, useRef, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Send, Smile, Image as ImageIcon, Mic, Plus, X } from "lucide-react";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Message } from "./types";

// interface MessageInputProps {
//   chatId: number;
//   wsConnection: WebSocket | undefined;
//   scrollToBottom: () => void;
//   getToken: () => Promise<string | null>;
//   replyingTo?: Message | null;
//   setReplyingTo?: (message: Message | null) => void;
// }

// const BASE_URL = "https://qqrnatcraft.uz";

// const MessageInput: React.FC<MessageInputProps> = ({
//   chatId,
//   wsConnection,
//   scrollToBottom,
//   getToken,
//   replyingTo,
//   setReplyingTo,
// }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   const handleSendMessage = useCallback(async () => {
//     if (!wsConnection || (!inputValue.trim() && !selectedImages.length)) return;

//     if (selectedImages.length > 0) {
//       const token = await getToken();
//       const formData = new FormData();
//       if (inputValue.trim()) formData.append("content", inputValue);
//       if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
//       selectedImages.forEach((img) => formData.append("images", img));

//       try {
//         const response = await fetch(`${BASE_URL}/chat/chats/${chatId}/send-message/`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         });
//         if (!response.ok) throw new Error("Media upload failed");
//         const serverMessage = await response.json();
//         wsConnection.send(
//           JSON.stringify({
//             action: "sync_message",
//             message_id: serverMessage.id,
//           })
//         );
//       } catch (error) {
//         console.error("Error sending media message:", error);
//         return;
//       }
//     } else if (inputValue.trim()) {
//       const messageData: any = {
//         action: "send_message",
//         content: inputValue,
//       };
//       if (replyingTo) messageData.reply_to = replyingTo.id;
//       wsConnection.send(JSON.stringify(messageData));
//     }

//     setInputValue("");
//     setSelectedImages([]);
//     setReplyingTo?.(null);
//     scrollToBottom();
//   }, [chatId, wsConnection, inputValue, selectedImages, scrollToBottom, getToken, replyingTo, setReplyingTo]);

//   const startRecording = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const chunks: Blob[] = [];
//       recorder.ondataavailable = (e) => chunks.push(e.data);
//       recorder.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const formData = new FormData();
//         formData.append("voice", audioBlob, "audio.webm");
//         if (replyingTo) formData.append("reply_to", replyingTo.id.toString());

//         getToken().then((token) => {
//           fetch(`${BASE_URL}/chat/chats/${chatId}/send-message/`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formData,
//           })
//             .then((response) => response.json())
//             .then((serverMessage) => {
//               wsConnection?.send(
//                 JSON.stringify({
//                   action: "sync_message",
//                   message_id: serverMessage.id,
//                 })
//               );
//             })
//             .catch((error) => console.error("Error sending audio message:", error));
//         });

//         stream.getTracks().forEach((track) => track.stop());
//       };
//       recorder.start();
//       mediaRecorderRef.current = recorder;
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       alert("Ovozli xabar yozib olishda xatolik!");
//     }
//   }, [chatId, wsConnection, getToken, replyingTo]);

//   const stopRecording = useCallback(() => {
//     mediaRecorderRef.current?.stop();
//     setIsRecording(false);
//   }, []);

//   const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)]);
//   }, []);

//   const handleEmojiSelect = useCallback((emoji: { native: string }) => {
//     setInputValue((prev) => prev + emoji.native);
//     setShowEmojiPicker(false);
//     inputRef.current?.focus();
//   }, []);

//   const removeImage = useCallback((index: number) => {
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const onDragEnd = useCallback((result: any) => {
//     if (!result.destination) return;
//     const reorderedImages = Array.from(selectedImages);
//     const [movedImage] = reorderedImages.splice(result.source.index, 1);
//     reorderedImages.splice(result.destination.index, 0, movedImage);
//     setSelectedImages(reorderedImages);
//   }, [selectedImages]);

//   return (
//     <div className="p-4 border-t bg-white relative">
//       {replyingTo && (
//         <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
//           <p className="text-xs sm:text-sm">
//             Replying to {replyingTo.sender?.first_name || "Noma'lum"}: {replyingTo.content}
//           </p>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setReplyingTo?.(null)}
//             aria-label="Cancel reply"
//           >
//             <X size={16} />
//           </Button>
//         </div>
//       )}
//       {selectedImages.length > 0 && (
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="images" direction="horizontal">
//             {(provided) => (
//               <div
//                 className="mb-2 flex flex-wrap gap-2"
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {selectedImages.map((img, idx) => (
//                   <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="relative"
//                       >
//                         <img
//                           src={URL.createObjectURL(img)}
//                           alt={`Preview ${idx}`}
//                           className="max-w-[100px] rounded-lg"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeImage(idx)}
//                           className="absolute top-0 right-0 p-1"
//                           aria-label="Remove image"
//                         >
//                           <X size={12} />
//                         </Button>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => fileInputRef.current?.click()}
//                   aria-label="Add more images"
//                 >
//                   <Plus size={16} />
//                 </Button>
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       )}
//       <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//           aria-label="Show emoji picker"
//         >
//           <Smile size={20} />
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => fileInputRef.current?.click()}
//           aria-label="Upload image"
//         >
//           <ImageIcon size={20} />
//         </Button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           accept="image/*"
//           multiple
//           onChange={handleImageUpload}
//           className="hidden"
//         />
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={isRecording ? stopRecording : startRecording}
//           aria-label={isRecording ? "Stop recording" : "Start recording"}
//         >
//           <Mic size={20} className={isRecording ? "text-red-500" : ""} />
//         </Button>
//         <input
//           ref={inputRef}
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           placeholder="Xabar yozing..."
//           className="flex-1 bg-transparent outline-none px-3 text-xs sm:text-sm"
//           aria-label="Message input"
//         />
//         <Button variant="ghost" size="sm" onClick={handleSendMessage} aria-label="Send message">
//           <Send size={20} />
//         </Button>
//         {showEmojiPicker && (
//           <div className="absolute bottom-16 right-4 z-10">
//             <Picker data={data} onEmojiSelect={handleEmojiSelect} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageInput;
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, Image as ImageIcon, Mic, Plus, X } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Message } from "./types";

interface MessageInputProps {
  chatId: number;
  wsConnection: WebSocket | null;
  scrollToBottom: () => void;
  getToken: () => Promise<string | null>;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
  editingMessage: Message | null;
  setEditingMessage: (message: Message | null) => void;
}

const BASE_URL = "https://qqrnatcraft.uz";

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  wsConnection,
  scrollToBottom,
  getToken,
  replyingTo,
  setReplyingTo,
  editingMessage,
  setEditingMessage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (editingMessage) {
      setInputValue(editingMessage.content || "");
      inputRef.current?.focus();
    } else {
      setInputValue("");
    }
  }, [editingMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!wsConnection || (!inputValue.trim() && !selectedImages.length)) return;

    if (selectedImages.length > 0) {
      const token = await getToken();
      const formData = new FormData();
      if (inputValue.trim()) formData.append("content", inputValue);
      if (replyingTo) formData.append("reply_to", replyingTo.id.toString());
      selectedImages.forEach((img) => formData.append("images", img));

      try {
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
      } catch (error) {
        console.error("Error sending media message:", error);
        return;
      }
    } else if (inputValue.trim()) {
      const messageData: any = {
        action: editingMessage ? "edit_message" : "send_message",
        content: inputValue,
      };
      if (editingMessage) messageData.message_id = editingMessage.id;
      if (replyingTo) messageData.reply_to = replyingTo.id;
      wsConnection.send(JSON.stringify(messageData));
    }

    setInputValue("");
    setSelectedImages([]);
    setReplyingTo(null);
    setEditingMessage(null);
    scrollToBottom();
  }, [chatId, wsConnection, inputValue, selectedImages, editingMessage, replyingTo, getToken, scrollToBottom]);

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

        const token = await getToken();
        fetch(`${BASE_URL}/chat/chats/${chatId}/send-message/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
          .then((response) => response.json())
          .then((serverMessage) => {
            wsConnection?.send(
              JSON.stringify({
                action: "sync_message",
                message_id: serverMessage.id,
              })
            );
          })
          .catch((error) => console.error("Error sending audio message:", error));

        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Ovozli xabar yozib olishda xatolik!");
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
    <div className="p-4 border-t bg-white relative">
      {replyingTo && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
          <p className="text-sm truncate">
            Replying to {replyingTo.sender?.first_name || "Noma'lum"}: {replyingTo.content}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(null)}
            aria-label="Cancel reply"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      {editingMessage && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2">
          <p className="text-sm truncate">
            Editing: {editingMessage.content}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingMessage(null)}
            aria-label="Cancel edit"
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
                className="mb-2 flex overflow-x-auto gap-2 pb-2"
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
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 p-1 bg-white rounded-full"
                          aria-label="Remove image"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0"
                  aria-label="Add more images"
                >
                  <Plus size={16} />
                </Button>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <div className="flex items-center bg-gray-100 rounded-full p-2 space-x-2 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Show emoji picker"
        >
          <Smile size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image"
        >
          <ImageIcon size={20} />
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
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <Mic size={20} className={isRecording ? "text-red-500" : ""} />
        </Button>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Xabar yozing..."
          className="flex-1 bg-transparent outline-none px-3 text-sm"
          aria-label="Message input"
        />
        <Button variant="ghost" size="sm" onClick={handleSendMessage} aria-label="Send message">
          <Send size={20} />
        </Button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0 z-10">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;