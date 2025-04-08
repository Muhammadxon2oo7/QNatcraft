"use client";

import { Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createChat } from "@/lib/chat";
import { useAuth } from "../../../../context/auth-context";
import { useState } from "react";

interface ContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  buyerid: number | undefined; // Bu hozircha ishlatilmaydi
}

export function ContactDialog({
  isOpen,
  onOpenChange,
  productId,
}: ContactDialogProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    const token = getToken();
   

    setIsLoading(true);
    try {
      const chat = await createChat(productId, token?token:'');
      router.push(`/chat/`);
      onOpenChange(false);
    } catch (error) {
      console.error("Chat boshlashda xatolik:", error);
      alert("Chat boshlashda xatolik yuz berdi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-md z-100 overflow-hidden"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md w-full h-full"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl p-0 overflow-hidden z-50 mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Biz bilan bog'lanish</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 hover:bg-gray-200 transition-colors"
                aria-label="Modalni yopish"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="rounded-lg overflow-hidden h-[250px] bg-gray-100 shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50264037015!2d69.1392822!3d41.2825125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1646734234283!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex flex-col gap-4">
                <motion.a
                  href="tel:+998900000001"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors shadow-sm"
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">+998 90 000 00 01</span>
                </motion.a>
                <motion.button
                  onClick={handleStartChat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="flex items-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-lg hover:bg-amber-100 transition-colors shadow-sm disabled:opacity-50"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">{isLoading ? "Yuklanmoqda..." : "Chatni boshlash"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}