"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { Dot } from "../dot/Dot";
import firstImg from '@/../public/img/first.png'
export default function PotteryStory() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setIsPaused(false); 
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true); 
      }
    }
  };

  return (
    <div className="relative mx-auto rounded-lg overflow-hidden h-[536px] w-full. mb-[144px]">
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          controls
          poster="/img/video.jpg"
          onPlay={() => {
            setIsPlaying(true);
            setIsPaused(false);
          }}
          onPause={() => {
            setIsPlaying(false);
            setIsPaused(true);
          }}
        >
          <source src="/videos/natcraft.mp4" type="video/mp4" />
        </video>

        {isPaused && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/50" 
            onClick={handlePlayPause} 
          >
            <img
              src="/img/video.jpg"
              alt="Poster"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/img/video-detail.png"
                alt="Play"
                className="object-cover rounded-full w-[316px] h-[316px]"
              />
            </div>
          </button>
        )}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-[20px]">
              <div className="flex -space-x-[16px]">
              {[1, 2, 3, 4, 5].map((index) => (
                <Avatar key={index} className="w-[56px] h-[56px] border-2 border-white ">
                  <AvatarImage src={`${firstImg.src}`} />
                  <AvatarFallback>U{index}</AvatarFallback>
                </Avatar>
              ))}
              </div>
              <div className=" flex items-center">
                <span className=" text-[18px]  text-white ">12K insonlar bizning hunarmandlar <br /> ishlaridan mamnunlar!</span>
                
              </div>
            </div>
            <Badge className="rounded-[24px] mb-[16px] bg-[#fcefe5] cursor-pointer p-[10px_16px] w-[305px] h-[36px] flex gap-[10px] " variant="secondary"><Dot/><p className="font-sans font-normal text-base leading-none text-[#242b3a]">Qoriniyoz ota kulolchilik ustaxonasi</p></Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
