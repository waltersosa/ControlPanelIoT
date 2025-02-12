import React from 'react';
import { motion } from 'framer-motion';
import { Server, BookOpen, Terminal } from 'lucide-react';
import { QuickStats } from './QuickStats';
import { NavActions } from './NavActions';
import { Link } from './Link';

interface NavbarProps {
  onToggleTerminal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleTerminal }) => {
  return (
    <nav className="relative bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Server className="w-8 h-8 text-red-500" />
              </motion.div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">
                IoT Command Center
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/">Dashboard</Link>
              <Link to="/guide">
                <BookOpen className="w-4 h-4 mr-2" />
                Guía de Dispositivos
              </Link>
              <Link to="/terminal">
                <Terminal className="w-4 h-4 mr-2" />
                Terminal IDE
              </Link>
            </div>
            <QuickStats />
          </div>
          <NavActions onToggleTerminal={onToggleTerminal} />
        </div>
      </div>
    </nav>
  );
};