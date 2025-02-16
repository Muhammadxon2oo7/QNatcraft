"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "../../../public/img/header/Search";

export default function AnimatedSearchTransform() {
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputWidth, setInputWidth] = useState("40px"); // Dinamik kenglik
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsInputActive(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsInputActive(false);
    }
  };

  useEffect(() => {
    if (isInputActive && inputRef.current) {
      inputRef.current.focus();
    }

    // Ekran o'lchamiga qarab input kengligini moslash
    const updateWidth = () => {
      const maxWidth = Math.min(window.innerWidth * 0.5, 300); // 90% yoki 500px dan kattaroq bo‘lmaydi
      setInputWidth(`${maxWidth}px`);
    };

    updateWidth(); // Dastlabki yuklanganda ham ishlaydi
    window.addEventListener("resize", updateWidth); // Ekran o‘zgarsa qayta hisoblaydi

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", updateWidth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInputActive]);

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[52px] flex items-center  flex-grow justify-end "
      animate={{
        width: isInputActive ? inputWidth : "40px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <AnimatePresence mode="wait" >
        {isInputActive ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center w-full h-full gap-[16px] pl-[10px]"
          >
            <Input
              ref={inputRef}
              className="pl-3  py-2 w-full h-full bg-[#f6f6f6] flex flex-grow focus:outline-none focus:ring-blue-500 responsive-btn"
              placeholder="Search..."
            />
            <Button
              className="bg-[#f6f6f6] hover:bg-[#e0e0e0] hover:cursor-pointer flex items-center justify-center  py-[14px] responsive-btn transition-colors duration-200"
              onClick={() => {
                console.log("Search:", inputRef.current?.value);
              }}
            >
              <Search />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex justify-end items-center"
          >
            <Button
              className="bg-[#f6f6f6] hover:bg-[#e0e0e0] hover:cursor-pointer flex items-center justify-center responsive-btn rounded-[16px]  py-[14px] transition-colors duration-200"
              onClick={handleButtonClick}
            >
              <Search />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
