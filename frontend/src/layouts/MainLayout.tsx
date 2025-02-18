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
  const [brokerIp, setBrokerIp] = React.useState<string>('Connecting...');
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    const updateConnectionStatus = () => {
      const currentHost = window.location.hostname;
      if (currentHost && currentHost !== 'localhost') {
        setBrokerIp(currentHost);
        setIsConnected(true);
      } else {
        setBrokerIp(config.serverHost);
        setIsConnected(true);
      }
    };

    updateConnectionStatus();
    const interval = setInterval(updateConnectionStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTerminal = () => {
    setShowTerminal(!showTerminal);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800 text-gray-100">
        <Navbar
          brokerIp={brokerIp}
          isConnected={isConnected}
          isDarkMode={isDarkMode}
          showTerminal={showTerminal}
          onToggleTerminal={toggleTerminal}
        />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        {showTerminal && <Terminal />}
      </div>
    </div>
  );
};