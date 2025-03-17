import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductSelectorProps {
  onSelect: (product: string) => void;
}

export default function ProductSelector({ onSelect }: ProductSelectorProps) {
  const products = [
    { name: "Choynak", img: "/images/teapot.png" },
    { name: "Vaza", img: "/images/vase.png" },
    { name: "Tarelka", img: "/images/plate.png" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {products.map((product) => (
        <motion.div
          key={product.name}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-48 object-contain bg-gray-50"
          />
          <div className="p-4 text-center">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <Button
              onClick={() => onSelect(product.name)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
            >
              Tanlash
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}