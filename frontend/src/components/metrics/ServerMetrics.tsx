import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useServerStatus } from '../../hooks/useServerStatus';

export const ServerMetrics: React.FC = () => {
  const { serverStatus } = useServerStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 backdrop-blur rounded-lg border border-gray-700"
    >
      <Activity className="w-4 h-4 text-green-400" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            serverStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-xs font-medium">{serverStatus.ipAddress}</span>
        </div>
        <div className="text-[10px] text-gray-400">
          Last update: {new Date(serverStatus.lastUpdate).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};