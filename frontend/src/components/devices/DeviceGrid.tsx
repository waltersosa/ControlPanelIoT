import React from 'react';
import { PowerSwitch } from '../widgets/PowerSwitch';
import { ThermostatWidget } from '../widgets/ThermostatWidget';
import { ServoWidget } from '../widgets/ServoWidget';
import { useMQTT } from '../../hooks/useMQTT';
import { AlertCircle } from 'lucide-react';

export const DeviceGrid: React.FC = () => {
  const { devices, isConnected, toggleRelay, setServoAngle } = useMQTT();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-500 mb-2">Error de Conexión</h3>
        <p className="text-gray-400 text-center">
          No se pudo conectar al broker MQTT. Por favor, verifica tu conexión a internet.
        </p>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-gray-400 mb-2">No hay dispositivos</h3>
        <p className="text-gray-500 text-center">
          Esperando a que los dispositivos se conecten...
        </p>
      </div>
    );
  }

  const renderDevice = (device: any) => {
    switch (device.type) {
      case 'relay':
        return (
          <PowerSwitch
            key={device.id}
            isOn={device.data.relayState}
            onChange={() => toggleRelay(device.id)}
            label={device.name}
          />
        );
      case 'dht':
        return (
          <ThermostatWidget
            key={device.id}
            deviceName={device.name}
            category={device.category}
            ipAddress={device.data.ipAddress || 'Unknown'}
            temperature={device.data.temperature}
            humidity={device.data.humidity}
            isOnline={device.isOnline}
          />
        );
      case 'servo':
        return (
          <ServoWidget
            key={device.id}
            deviceName={device.name}
            category={device.category}
            ipAddress={device.data.ipAddress || 'Unknown'}
            angle={device.data.servoAngle}
            isOnline={device.isOnline}
            onChange={(angle) => setServoAngle(device.id, angle)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map(device => renderDevice(device))}
    </div>
  );
};