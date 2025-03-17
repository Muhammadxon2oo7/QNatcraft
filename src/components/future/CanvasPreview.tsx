"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Design {
  color: string;
  pattern: string;
  extra: string;
}

interface CanvasPreviewProps {
  product: string;
  design: Design;
}

export default function CanvasPreview({ product, design }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const productImages: { [key: string]: string } = {
    Choynak: "/images/teapot.png",
    Vaza: "/images/vase.png",
    Tarelka: "/images/plate.png",
  };

  const patternImages: { [key: string]: string } = {
    floral: "/images/floral-pattern.png",
    geometric: "/images/geometric-pattern.png",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawCanvas = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mahsulot rasmini chizish
      const productImg = new Image();
      productImg.src = productImages[product];
      await new Promise((resolve) => (productImg.onload = resolve));

      const scale = Math.min(
        canvas.width / productImg.width,
        canvas.height / productImg.height
      );
      const imgWidth = productImg.width * scale;
      const imgHeight = productImg.height * scale;
      const x = (canvas.width - imgWidth) / 2;
      const y = (canvas.height - imgHeight) / 2;

      ctx.drawImage(productImg, x, y, imgWidth, imgHeight);

      // Rang qo‘llash
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = design.color;
      ctx.fillRect(x, y, imgWidth, imgHeight);

      // Naqsh qo‘shish
      if (design.pattern !== "none") {
        const patternImg = new Image();
        patternImg.src = patternImages[design.pattern];
        await new Promise((resolve) => (patternImg.onload = resolve));

        const pattern = ctx.createPattern(patternImg, "repeat");
        if (pattern) {
          ctx.globalCompositeOperation = "overlay";
          ctx.fillStyle = pattern;
          ctx.fillRect(x, y, imgWidth, imgHeight);
        }
      }

      // Qo‘shimcha detal qo‘shish
      ctx.globalCompositeOperation = "source-over";
      if (design.extra === "handle" && product === "Choynak") {
        ctx.fillStyle = "#666";
        ctx.fillRect(x + imgWidth - 20, y + imgHeight / 3, 40, 20);
      } else if (design.extra === "ornament") {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(x + 40, y + imgHeight - 40, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawCanvas();
  }, [product, design]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="border rounded-lg shadow-lg bg-white"
      />
    </motion.div>
  );
}