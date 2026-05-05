"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BubbleBackground() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = crypto.randomUUID();

      setBubbles((prev) => [
        ...prev,
        {
          id,
          size: Math.random() * 45 + 20,
          left: Math.random() * 100,
          delay: Math.random() * 0.4,
          blur: Math.random() > 0.5 ? "blur-sm" : "blur-md",
        },
      ]);

      // Remove bubble after animation ends
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, 4500);
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ y: 500, opacity: 0.5, scale: 0.6 }}
          animate={{
            y: -120,
            opacity: 0,
            scale: 1.3,
            x: [0, -15, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            ease: "easeOut",
            delay: bubble.delay,
          }}
          className={`absolute rounded-full bg-gradient-to-br from-indigo-300/50 to-purple-600/50 ${bubble.blur}`}
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}vw`,
          }}
        />
      ))}
    </div>
  );
}
