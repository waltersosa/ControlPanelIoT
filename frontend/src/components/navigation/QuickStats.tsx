import React from 'react';
import { Network } from 'lucide-react';

export const QuickStats: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Network className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-400">MQTT Ready</span>
      </div>
    </div>
  );
};