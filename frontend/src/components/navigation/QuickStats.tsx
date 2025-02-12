import React from 'react';
import { Cpu, Network, Activity } from 'lucide-react';
import { useServerStatus } from '../../hooks/useServerStatus';

export const QuickStats: React.FC = () => {
  const { serverStatus } = useServerStatus();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <Cpu className="w-4 h-4 text-blue-400" />
        <span className="text-sm text-blue-400">{serverStatus.cpuUsage}%</span>
      </div>
      <div className="flex items-center space-x-2">
        <Network className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-400">{serverStatus.activeConnections} active</span>
      </div>
      <div className="flex items-center space-x-2">
        <Activity className="w-4 h-4 text-yellow-400" />
        <span className="text-sm text-yellow-400">Devices Online</span>
      </div>
    </div>
  );
};