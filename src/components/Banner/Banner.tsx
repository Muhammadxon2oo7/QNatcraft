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

      if (video.requestFullscreen) {
        video.requestFullscreen().catch((error) => {
          console.warn('Fullscreen request failed:', error);
        });
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        (video as any).mozRequestFullScreen();
      }
    }
  }, []);

  return (
    <div className="w-full  rounded-[24px]  banner">
      <video
        ref={videoRef}
        loop
        playsInline
        muted={true}
        autoPlay
        className="w-full  object-cover rounded-[24px]"
      >
        <source src="videos/natcraft.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
