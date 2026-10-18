import React from 'react';
import { motion } from 'motion/react';
import { Armchair } from 'lucide-react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1917] text-[#faf9f6]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#b45309]/20 flex items-center justify-center mb-4 border border-[#b45309]/40">
          <Armchair className="w-8 h-8 text-[#d97706]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wide text-center">
          Cole World
        </h1>
        <p className="text-xs md:text-sm font-sans uppercase tracking-[0.25em] text-[#a8a29e] mt-2 text-center">
          Furniture & Interior Designs
        </p>
        <div className="w-32 h-0.5 bg-[#292524] mt-6 relative overflow-hidden rounded-full">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d97706] to-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
