import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "@/utils/helpers";

interface FullscreenImageViewerProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startY = touch.clientY;
      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY;
        if (currentY - startY > 100) {
          onClose();
        }
      };
      document.addEventListener("touchmove", handleTouchMove);
      return () => document.removeEventListener("touchmove", handleTouchMove);
    };
    document.addEventListener("touchstart", handleTouch);
    return () => document.removeEventListener("touchstart", handleTouch);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh] sm:w-[80vw] sm:h-[80vh] max-w-[800px] max-h-[600px]"
        onClick={(e) => e.stopPropagation()}
        ref={viewerRef}
      >
        <img
          src={getMediaUrl(images[index], "image")}
          alt="Fullscreen"
          className="w-full h-full object-contain rounded-lg"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full"
          aria-label="Close fullscreen"
        >
          <X size={24} />
        </Button>
        {index > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            className="absolute top-1/2 left-4 text-white bg-black/50 hover:bg-black/70 rounded-full transform -translate-y-1/2"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        {index < images.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute top-1/2 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full transform -translate-y-1/2"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FullscreenImageViewer;