import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark?: boolean;
  onToggle?: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark = false, onToggle = () => {} }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-yellow-500" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </motion.button>
  );
};