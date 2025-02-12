import { useState, useEffect } from 'react';
import { ServerStatus } from '../types/server';

// Determinar el protocolo basado en el entorno
const HTTP_PROTOCOL = window.location.protocol === 'https:' ? 'https:' : 'http:';
const SERVER_HOST = '192.168.10.100:8080';

export const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    isOnline: false,
    ipAddress: '192.168.10.100',
    uptime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    lastUpdate: new Date().toISOString()
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${HTTP_PROTOCOL}//${SERVER_HOST}/health`);
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