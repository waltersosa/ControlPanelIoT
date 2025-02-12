import React from 'react';
import { motion } from 'framer-motion';
import { Power, Wifi, Hash } from 'lucide-react';

interface PowerSwitchProps {
  isOn: boolean;
  onChange: (state: boolean) => void;
  label: string;
  deviceId: string;
  ipAddress: string;
  isOnline: boolean;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({ 
  isOn, 
  onChange, 
  label,
  deviceId,
  ipAddress,
  isOnline
}) => {
  const handleClick = () => {
    if (isOnline) {
      console.log(`Cambiando estado del relay ${deviceId} a:`, !isOn);
      onChange(!isOn);
    } else {
      console.warn('Dispositivo offline - no se puede cambiar el estado');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
    >
      {/* Device Info Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <span className="text-sm text-gray-400">Control</span>
          <div className="flex items-center mt-1 space-x-1">
            <Hash className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">{deviceId}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <Wifi className={`w-4 h-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-xs text-gray-400">{ipAddress}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Switch Control */}
      <div className="flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          disabled={!isOnline}
          className={`relative w-40 h-40 rounded-full ${
            isOn ? 'bg-yellow-500/20' : 'bg-gray-800/50'
          } border-4 ${
            isOn ? 'border-yellow-500' : 'border-gray-700'
          } transition-colors duration-300 ${
            !isOnline ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Power
            className={`w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              isOn ? 'text-yellow-500' : 'text-gray-500'
            }`}
          />
        </motion.button>
      </div>

      {/* Status Text */}
      <div className="flex flex-col items-center space-y-2 mt-4">
        <div className={`w-2 h-2 rounded-full ${
          isOn ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'
        }`} />
        <span className={`text-sm ${
          isOn ? 'text-yellow-500' : 'text-gray-500'
        }`}>
          {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
    </motion.div>
  );
};