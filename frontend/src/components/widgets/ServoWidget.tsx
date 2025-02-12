import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Wifi } from 'lucide-react';

interface ServoWidgetProps {
  deviceName: string;
  category: string;
  ipAddress: string;
  angle: number;
  isOnline: boolean;
  onChange: (angle: number) => void;
}

export const ServoWidget: React.FC<ServoWidgetProps> = ({
  deviceName,
  category,
  ipAddress,
  angle,
  isOnline,
  onChange,
}) => {
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

      {/* Servo Control */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
          
          {/* Active Arc */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${(angle / 180) * 440} 440`}
            />
          </svg>

          {/* Servo Arm */}
          <motion.div
            className="absolute w-1 h-20 bg-blue-500 origin-bottom"
            style={{
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }}
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 -mt-1 -ml-1" />
          </motion.div>

          {/* Angle Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{angle}°</span>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-xl animate-pulse-slow" />
        </div>

        {/* Angle Control */}
        <input
          type="range"
          min="0"
          max="180"
          value={angle}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(angle/180)*100}%, #374151 ${(angle/180)*100}%, #374151 100%)`,
          }}
        />

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(90)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </motion.button>
      </div>
    </motion.div>
  );
};