import { useState, useEffect } from 'react';
import { ServerStatus } from '../types/server';
import { config } from '../config';

export const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    isOnline: false,
    ipAddress: config.serverHost,
    uptime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    lastUpdate: new Date().toISOString()
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/health`);
        const data = await response.json();
        
        setServerStatus(prev => ({
          ...prev,
          isOnline: true,
          activeConnections: data.connectedDevices,
          lastUpdate: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error checking server status:', error);
        setServerStatus(prev => ({
          ...prev,
          isOnline: false,
          lastUpdate: new Date().toISOString()
        }));
      }
    };

    // Verificar estado inicial
    checkStatus();

    // Verificar estado cada 5 segundos
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return { serverStatus };
};