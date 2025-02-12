import React from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';
import { Power, Zap, Cpu } from 'lucide-react';

interface PowerSwitchProps {
  isOn: boolean;
  onChange: () => void;
  label?: string;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({ isOn, onChange, label = 'Relé' }) => {
  const [playOn] = useSound('/sounds/switch-on.mp3', { volume: 0.5 });
  const [playOff] = useSound('/sounds/switch-off.mp3', { volume: 0.5 });

  const handleToggle = () => {
    onChange();
    isOn ? playOff() : playOn();
  };

  return (
    <motion.div
      className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        
        {/* Relay Status */}
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <Cpu className="w-4 h-4" />
          <span>GPIO5</span>
        </div>
        
        {/* Switch Button */}
        <motion.button
          onClick={handleToggle}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
            isOn ? 'bg-gradient-to-br from-yellow-500 to-red-600' : 'bg-gray-800'
          } transition-colors duration-300`}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-full ${
            isOn ? 'animate-pulse-slow bg-yellow-500/20' : ''
          } filter blur-xl transition-opacity duration-300`} />
          
          {/* Power Icon */}
          <motion.div
            animate={{
              scale: isOn ? [1, 1.2, 1] : 1,
              rotate: isOn ? 360 : 0,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Power className={`w-10 h-10 ${
              isOn ? 'text-white' : 'text-gray-400'
            }`} />
          </motion.div>

          {/* Ring Effect */}
          <div className={`absolute inset-0 rounded-full border-2 ${
            isOn ? 'border-yellow-500 animate-ping-slow' : 'border-gray-700'
          } transition-colors duration-300`} />
        </motion.button>

        {/* Status Text */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-2 h-2 rounded-full ${
            isOn ? 'bg-yellow-500 animate-pulse' : 'bg-gray-600'
          }`} />
          <span className={`text-sm ${
            isOn ? 'text-yellow-500' : 'text-gray-500'
          }`}>
            {isOn ? 'HIGH' : 'LOW'}
          </span>
          <span className="text-xs text-gray-500">
            {isOn ? '3.3V' : '0V'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};