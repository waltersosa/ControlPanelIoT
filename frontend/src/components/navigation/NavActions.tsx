import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, BarChart3 } from 'lucide-react';
import { ServerMetrics } from '../metrics/ServerMetrics';
import { ThemeToggle } from '../theme/ThemeToggle';

interface NavActionsProps {
  onToggleTerminal: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onToggleTerminal }) => {
  return (
    <div className="flex items-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleTerminal}
        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
      >
        <Terminal className="w-5 h-5 text-green-400" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
      >
        <BarChart3 className="w-5 h-5 text-blue-400" />
      </motion.button>
      <ServerMetrics />
      <ThemeToggle />
    </div>
  );
};