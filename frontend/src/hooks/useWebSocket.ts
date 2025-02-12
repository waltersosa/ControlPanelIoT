import { useState, useEffect } from 'react';
import { Device } from '../types/device';

// Simulación de dispositivos
const simulatedDevices: Device[] = [
  {
    id: 'dht_001',
    name: 'DHT Sala',
    type: 'dht',
    category: 'Sensor',
    isOnline: true,
    data: {
      temperature: 23,
      humidity: 45,
      cpuFreq: 160,
      wifiStrength: -55,
      uptime: 3600
    }
  },
  {
    id: 'dht_002',
    name: 'DHT Cocina',
    type: 'dht',
    category: 'Sensor',
    isOnline: true,
    data: {
      temperature: 25,
      humidity: 50,
      cpuFreq: 160,
      wifiStrength: -60,
      uptime: 3600
    }
  },
  {
    id: 'relay_001',
    name: 'Relé Luz',
    type: 'relay',
    category: 'Control',
    isOnline: true,
    data: {
      relayState: false,
      cpuFreq: 160,
      wifiStrength: -45,
      uptime: 3600
    }
  },
  {
    id: 'relay_002',
    name: 'Relé Ventilador',
    type: 'relay',
    category: 'Control',
    isOnline: true,
    data: {
      relayState: false,
      cpuFreq: 160,
      wifiStrength: -50,
      uptime: 3600
    }
  },
  {
    id: 'servo_001',
    name: 'Servo Persiana',
    type: 'servo',
    category: 'Actuador',
    isOnline: true,
    data: {
      servoAngle: 90,
      cpuFreq: 160,
      wifiStrength: -65,
      uptime: 3600
    }
  },
  {
    id: 'servo_002',
    name: 'Servo Puerta',
    type: 'servo',
    category: 'Actuador',
    isOnline: true,
    data: {
      servoAngle: 0,
      cpuFreq: 160,
      wifiStrength: -70,
      uptime: 3600
    }
  }
];

export const useWebSocket = () => {
  const [devices, setDevices] = useState<Device[]>(simulatedDevices);

  // Simular actualizaciones periódicas
  useEffect(() => {
    const updateDevices = () => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          const newDevice = { ...device };
          
          // Actualizar datos según el tipo de dispositivo
          if (device.type === 'dht') {
            newDevice.data = {
              ...device.data,
              temperature: 20 + Math.random() * 10,
              humidity: 40 + Math.random() * 20,
              cpuFreq: 160 + Math.random() * 80,
              wifiStrength: -30 - Math.random() * 40,
              uptime: (device.data.uptime || 0) + 1
            };
          } else if (device.type === 'servo') {
            newDevice.data = {
              ...device.data,
              cpuFreq: 160 + Math.random() * 80,
              wifiStrength: -30 - Math.random() * 40,
              uptime: (device.data.uptime || 0) + 1
            };
          } else if (device.type === 'relay') {
            newDevice.data = {
              ...device.data,
              cpuFreq: 160 + Math.random() * 80,
              wifiStrength: -30 - Math.random() * 40,
              uptime: (device.data.uptime || 0) + 1
            };
          }
          
          return newDevice;
        })
      );
    };

    const interval = setInterval(updateDevices, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleRelay = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId && device.type === 'relay'
          ? {
              ...device,
              data: {
                ...device.data,
                relayState: !device.data.relayState
              }
            }
          : device
      )
    );
  };

  const setServoAngle = (deviceId: string, angle: number) => {
    if (angle >= 0 && angle <= 180) {
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.id === deviceId && device.type === 'servo'
            ? {
                ...device,
                data: {
                  ...device.data,
                  servoAngle: angle
                }
              }
            : device
        )
      );
    }
  };

  return {
    devices,
    isConnected: true,
    toggleRelay,
    setServoAngle
  };
};