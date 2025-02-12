import React from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Terminal } from '../components/terminal/Terminal';
import { config } from '../config';

interface MainLayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  showTerminal: boolean;
  setShowTerminal: (show: boolean) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isDarkMode,
  showTerminal,
  setShowTerminal
}) => {
  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-100">
        {/* Animated Background Grid */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent)]"></div>
        </div>

        {/* Glowing Orb Effect */}
        <div className="fixed top-0 left-1/3 -translate-x-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="fixed top-0 right-1/3 translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <Navbar onToggleTerminal={toggleTerminal} />
        
        {/* Server IP Container - Actualizado para mostrar el broker MQTT */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Broker MQTT:</span>
                <span className="text-lg font-mono text-red-500">broker.hivemq.com:8000</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <Terminal show={showTerminal} onClose={() => setShowTerminal(false)} />
      </div>
    </div>
  );
};