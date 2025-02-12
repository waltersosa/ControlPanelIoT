import React from 'react';
import { useMQTT } from '../hooks/useMQTT';
import { DeviceCard } from '../components/DeviceCard';

const DevicesPage: React.FC = () => {
  const { devices, toggleRelay, setServoAngle } = useMQTT();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map(device => (
        <DeviceCard
          key={device.id}
          device={device}
          onToggleRelay={toggleRelay}
          onServoChange={setServoAngle}
        />
      ))}
    </div>
  );
};

export default DevicesPage; 