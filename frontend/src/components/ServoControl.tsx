import React from 'react';
import { motion } from 'framer-motion';

interface ServoControlProps {
  angle: number;
  onChange: (angle: number) => void;
}

export const ServoControl: React.FC<ServoControlProps> = ({ angle, onChange }) => {
  return (
    <div className="relative w-32 h-32">
      <motion.div
        className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full"
        style={{
          background: `conic-gradient(from -90deg, #EF4444 ${(angle / 180) * 100}%, transparent ${(angle / 180) * 100}%)`,
        }}
      >
        <input
          type="range"
          min="0"
          max="180"
          value={angle}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          className="absolute w-2 h-8 bg-white origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">{angle}°</span>
      </div>
    </div>
  );
};