import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Thermometer, Droplets, Cpu, Clock, Signal } from 'lucide-react';
import { Device } from '../types';
import { RelaySwitch } from './RelaySwitch';
import { ServoControl } from './ServoControl';
import { TemperatureGauge } from './TemperatureGauge';

interface DeviceCardProps {
  device: Device;
  onToggleRelay: (id: string) => void;
  onServoChange: (id: string, angle: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggleRelay,
  onServoChange,
}) => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const getWifiStrengthColor = (strength: number) => {
    if (strength >= -50) return 'text-green-500';
    if (strength >= -70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-lg overflow-hidden group"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
            {device.name}
          </h3>
          <p className="text-sm text-gray-400">{device.type.toUpperCase()}</p>
          <p className="text-sm text-gray-400">IP Address: {device.data.ipAddress}</p>
        </div>
        <motion.div
          animate={{
            scale: device.isOnline ? [1, 1.2, 1] : 1,
            opacity: device.isOnline ? 1 : 0.5,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {device.isOnline ? (
            <Wifi className="w-6 h-6 text-green-500" />
          ) : (
            <WifiOff className="w-6 h-6 text-red-500" />
          )}
        </motion.div>
      </div>

      {/* Device Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {device.data.temperature !== undefined && (
          <div className="col-span-2 flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-center space-x-3">
              <TemperatureGauge value={device.data.temperature} />
              <div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-bold">{device.data.temperature}°C</span>
                </div>
                {device.data.humidity !== undefined && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{device.data.humidity}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Metrics */}
        <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-400">CPU</span>
            </div>
            <span className="text-sm font-medium">{device.data.cpuFreq}MHz</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className={`w-4 h-4 ${getWifiStrengthColor(device.data.wifiStrength!)}`} />
              <span className="text-sm text-gray-400">RSSI</span>
            </div>
            <span className="text-sm font-medium">{device.data.wifiStrength}dBm</span>
          </div>
        </div>

        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-400">Uptime</span>
            </div>
            <span className="text-sm font-medium">{formatUptime(device.data.uptime!)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {device.data.relayState !== undefined && (
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <span className="text-sm text-gray-400">Power</span>
            <RelaySwitch
              isOn={device.data.relayState}
              onChange={() => onToggleRelay(device.id)}
            />
          </div>
        )}

        {device.data.servoAngle !== undefined && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Servo Control</span>
              <span className="text-sm font-medium">{device.data.servoAngle}°</span>
            </div>
            <ServoControl
              angle={device.data.servoAngle}
              onChange={(angle) => onServoChange(device.id, angle)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};