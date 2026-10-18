import React from 'react';
import { motion } from 'motion/react';

interface ScrollPopUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollPopUp({ children, className = '', delay = 0 }: ScrollPopUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 90, scale: 0.8, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: -90, scale: 0.8, rotateX: -15 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{
        duration: 0.85,
        delay: delay,
        type: "spring",
        stiffness: 80,
        damping: 13
      }}
      className={`transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
}
