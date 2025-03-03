import React, { useEffect, useRef } from 'react';

export const Banner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = true;
      
      video.play().catch((error) => {
        console.warn('Autoplay failed:', error);
      });

      // requestFullscreen() ni olib tashlaymiz yoki qo'lda ishga tushirish variantini qo'shamiz
    }
  }, []);

  return (
    <div className="w-full rounded-[24px] banner">
      <video
        ref={videoRef}
        loop
        playsInline
        muted
        autoPlay
        className="w-full object-cover rounded-[24px] md:h-[650px]"
      >
        <source src="videos/natcraft.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
