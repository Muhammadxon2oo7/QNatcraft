import { motion } from "framer-motion";

interface Design {
  color: string;
  pattern: string;
  extra: string;
}

interface ProductPreviewProps {
  product: string;
  design: Design;
}

export default function ProductPreview({ product, design }: ProductPreviewProps) {
  const productImages: { [key: string]: string } = {
    Choynak: "/images/teapot.png",
    Vaza: "/images/vase.png",
    Tarelka: "/images/plate.png",
  };

  const getPatternOverlay = () => {
    switch (design.pattern) {
      case "floral":
        return "url('/images/floral-pattern.png')";
      case "geometric":
        return "url('/images/geometric-pattern.png')";
      default:
        return "none";
    }
  };

  const getExtraElement = () => {
    if (design.extra === "handle") {
      return (
        <div className="absolute top-1/4 right-0 w-16 h-8 bg-gray-600 rounded-l-full translate-x-8" />
      );
    }
    if (design.extra === "ornament") {
      return (
        <div className="absolute bottom-8 left-8 w-12 h-12 bg-yellow-400 rounded-full opacity-70" />
      );
    }
    return null;
  };

  return (
    <motion.div
      className="relative w-64 h-64 flex items-center justify-center"
      animate={{ scale: 1 }}
      initial={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full">
        {/* Asosiy mahsulot rasmi */}
        <motion.img
          src={productImages[product]}
          alt={product}
          className="w-full h-full object-contain"
          style={{ filter: `hue-rotate(${getHueFromColor(design.color)}deg)` }}
          animate={{ filter: `hue-rotate(${getHueFromColor(design.color)}deg)` }}
          transition={{ duration: 0.3 }}
        />
        {/* Naqsh qatlami */}
        {design.pattern !== "none" && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: getPatternOverlay() }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          />
        )}
        {/* Qo‘shimcha detallar */}
        {getExtraElement()}
      </div>
    </motion.div>
  );
}

// Rangdan hue qiymatini olish uchun yordamchi funksiya
function getHueFromColor(hex: string) {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max === min) return 0;
  if (max === r) h = (g - b) / (max - min);
  else if (max === g) h = 2 + (b - r) / (max - min);
  else h = 4 + (r - g) / (max - min);
  h *= 60;
  return h < 0 ? h + 360 : h;
}