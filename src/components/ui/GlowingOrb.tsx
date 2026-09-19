'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function GlowingOrb({
  color = '#ff2a4d',
  size = 400,
  blur = 150,
  x = 0,
  y = 0,
  delay = 0,
  duration = 10,
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none mix-blend-screen"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: `blur(${blur}px)`,
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: ['-5%', '5%', '-5%'],
        y: ['-5%', '5%', '-5%'],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}
