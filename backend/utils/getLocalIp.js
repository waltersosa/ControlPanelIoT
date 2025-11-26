import { networkInterfaces } from 'os';

export function getLocalIp() {
  if (process.env.PUBLIC_HOST) {
    return process.env.PUBLIC_HOST;
  }

  const nets = networkInterfaces();

  // Patrones comunes para interfaces WiFi
  const wifiPatterns = [
    /^wi-?fi/i,     // WiFi, Wi-fi
    /^wlan/i,       // WLAN
    /^wireless/i,   // Wireless
    /^net/i,        // Network adapter
    /^ra/i          // Ralink/Realtek adapters
  ];

  // Primero buscar interfaces que coincidan con patrones WiFi
  for (const name of Object.keys(nets)) {
    if (wifiPatterns.some(pattern => pattern.test(name))) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }

  // Si no se encuentra una interfaz WiFi, buscar cualquier interfaz no interna
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost'; // Fallback a localhost si no se encuentra una IP adecuada
}