// import React from "react";
// import { Button } from "@/components/ui/button";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";

// const BASE_URL = "https://qqrnatcraft.uz";
// const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// interface FullscreenImageViewerProps {
//   images: string[];
//   index: number;
//   onClose: () => void;
//   onPrev: () => void;
//   onNext: () => void;
// }

// const getImageUrl = (imagePath: string) =>
//   imagePath
//     ? imagePath.startsWith("http")
//       ? imagePath
//       : `${BASE_URL}${imagePath}`
//     : PLACEHOLDER_IMAGE;

// const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
//   images,
//   index,
//   onClose,
//   onPrev,
//   onNext,
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="relative w-full max-w-md h-[60vh]">
//         <img
//           src={getImageUrl(images[index])}
//           alt="Fullscreen"
//           className="w-full h-full object-contain rounded-lg"
//           onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
//         />
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onClose}
//           className="absolute top-2 right-2 text-white"
//           aria-label="Close fullscreen"
//         >
//           <X size={24} />
//         </Button>
//         {index > 0 && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onPrev}
//             className="absolute top-1/2 left-2 text-white"
//             aria-label="Previous image"
//           >
//             <ChevronLeft size={24} />
//           </Button>
//         )}
//         {index < images.length - 1 && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onNext}
//             className="absolute top-1/2 right-2 text-white"
//             aria-label="Next image"
//           >
//             <ChevronRight size={24} />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FullscreenImageViewer;
import React from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = "https://qqrnatcraft.uz";
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

interface FullscreenImageViewerProps {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const getImageUrl = (imagePath: string) =>
  imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${BASE_URL}${imagePath}`
    : PLACEHOLDER_IMAGE;

const FullscreenImageViewer: React.FC<FullscreenImageViewerProps> = ({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-[80vw] max-h-[80vh]">
        <img
          src={getImageUrl(images[index])}
          alt="Fullscreen"
          className="w-full h-full object-contain"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white"
          aria-label="Close fullscreen"
        >
          <X size={24} />
        </Button>
        {index > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            className="absolute top-1/2 left-4 text-white transform -translate-y-1/2"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        {index < images.length - 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="absolute top-1/2 right-4 text-white transform -translate-y-1/2"
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