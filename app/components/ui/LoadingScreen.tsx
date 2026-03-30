'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-[#1A1D21]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative"
      >
        <div className="w-16 h-16 bg-[#4A154B] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#4A154B]/20">
          <Hash size={32} className="text-white" />
        </div>
        
        {/* Animated Glow */}
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#4A154B] blur-2xl -z-10 rounded-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col items-center"
      >
        <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
          SyncUp
        </h2>
        <div className="mt-4 flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-1.5 h-1.5 bg-[#4A154B] dark:bg-accent rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
