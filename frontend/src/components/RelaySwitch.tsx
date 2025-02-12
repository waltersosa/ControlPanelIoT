import React from 'react';
import { motion } from 'framer-motion';
import useSound from 'use-sound';

interface RelaySwitchProps {
  isOn: boolean;
  onChange: () => void;
}

export const RelaySwitch: React.FC<RelaySwitchProps> = ({ isOn, onChange }) => {
  const [playOn] = useSound('/sounds/switch-on.mp3', { volume: 0.5 });
  const [playOff] = useSound('/sounds/switch-off.mp3', { volume: 0.5 });

  const handleClick = () => {
    onChange();
    isOn ? playOff() : playOn();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
        isOn ? 'bg-red-500' : 'bg-gray-300'
      }`}
    >
      <motion.div
        className="absolute w-6 h-6 bg-white rounded-full"
        initial={false}
        animate={{
          x: isOn ? 32 : 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};