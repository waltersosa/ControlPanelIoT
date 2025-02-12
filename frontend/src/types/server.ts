export interface ServerStatus {
  isOnline: boolean;
  ipAddress: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  lastUpdate: string;
}