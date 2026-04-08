import React from 'react';
import { motion } from 'motion/react';

interface BeeDecorationProps {
  className?: string;
  size?: number;
  delay?: number;
  fly?: boolean;
}

export const BeeDecoration = ({ className = "", size = 32, delay = 0, fly = false }: BeeDecorationProps) => {
  const flyAnimation = {
    x: ['-10vw', '100vw'],
    y: [0, -50, 0, 50, 0],
    rotate: [90, 80, 100, 90] // Facing right roughly
  };

  const hoverAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    x: [0, 5, -5, 0]
  };

  return (
    <motion.div
      initial={fly ? { x: -100, opacity: 0 } : { y: 0, rotate: 0 }}
      animate={fly ? {
        x: ['0%', '1000%'], // Move across simplistic
        y: [0, -30, 0, 30, 0],
      } : hoverAnimation}
      transition={fly ? {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
        delay: delay
      } : {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      className={`absolute pointer-events-none z-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
         {/* Wings */}
        <motion.path 
          d="M15 18C15 18 10 10 20 5C30 0 32 15 32 15" 
          fill="#E2E8F0" 
          fillOpacity="0.8"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 0.15, repeat: Infinity }}
          style={{ originX: 0.6, originY: 0.6 }}
        />
        <motion.path 
          d="M15 18C15 18 10 26 20 31C30 36 32 21 32 21" 
          fill="#E2E8F0" 
          fillOpacity="0.8"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
          style={{ originX: 0.6, originY: 0.6 }}
        />
        
        {/* Body */}
        <circle cx="25" cy="18" r="12" fill="#FBBF24" stroke="#1E293B" strokeWidth="2"/>
        
        {/* Stripes */}
        <path d="M25 10V26" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 12V24" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M31 12V24" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Antennae */}
        <path d="M18 10C18 10 16 6 14 6" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 10C32 10 34 6 36 6" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="13" cy="5" r="1.5" fill="#1E293B"/>
        <circle cx="37" cy="5" r="1.5" fill="#1E293B"/>
        
        {/* Eyes & Smile */}
        <circle cx="22" cy="16" r="1.5" fill="#1E293B"/>
        <circle cx="28" cy="16" r="1.5" fill="#1E293B"/>
        <path d="M23 21C23 21 24 22 25 22C26 22 27 21 27 21" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
};
