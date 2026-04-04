"use client";

import { motion } from "motion/react";

const bars = [
  { opacity: 1, delay: 0 },
  { opacity: 0.75, delay: 0.2 },
  { opacity: 0.5, delay: 0.4 },
];

export function LogoLoader() {
  return (
    <div className="flex items-end gap-[6px]">
      {bars.map(({ opacity, delay }) => (
        <motion.div
          key={delay}
          initial={{ height: 12 }}
          animate={{ height: [12, 48, 12] }}
          transition={{
            duration: 1.2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            opacity,
            width: 6,
            borderRadius: 2,
            backgroundColor: "hsl(242 48% 58%)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
