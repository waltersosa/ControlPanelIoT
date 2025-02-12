import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wifi, Hash } from 'lucide-react';

interface ThermostatWidgetProps {
  deviceName: string;
  deviceId: string;
  category: string;
  ipAddress: string;
  temperature: number;
  humidity: number;
  isOnline: boolean;
}

export const ThermostatWidget: React.FC<ThermostatWidgetProps> = ({
  deviceName,
  deviceId,
  category,
  ipAddress,
  temperature,
  humidity,
  isOnline,
}) => {
  const percentage = ((temperature + 20) / 80) * 100; // Range: -20°C to 60°C

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
    >
      {/* Device Info Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{deviceName}</h3>
          <span className="text-sm text-gray-400">{category}</span>
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

      {/* Thermostat Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1F2937"
              strokeWidth="10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
            />
          </svg>
          
          {/* Temperature Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{temperature}°C</span>
            <div className="flex items-center space-x-2 mt-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-400">{humidity}%</span>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-red-500/20 filter blur-xl animate-pulse-slow" />
        </div>
      </div>

      {/* Temperature Range Indicators */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>-20°C</span>
        <span>60°C</span>
      </div>
    </motion.div>
  );
};