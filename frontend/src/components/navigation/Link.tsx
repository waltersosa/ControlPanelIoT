import React from 'react';
import { motion } from 'framer-motion';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface LinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterLink to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-red-500/10 text-red-500'
            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
        }`}
      >
        {children}
      </motion.div>
    </RouterLink>
  );
};