import React from 'react';
import { PowerSwitch } from '../widgets/PowerSwitch';
import { ThermostatWidget } from '../widgets/ThermostatWidget';
import { ServoWidget } from '../widgets/ServoWidget';
import { useWebSocket } from '../../hooks/useWebSocket';

export const DeviceGrid: React.FC = () => {
  const { devices, toggleRelay, setServoAngle } = useWebSocket();

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
            ipAddress="192.168.0.100"
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
            ipAddress="192.168.0.100"
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