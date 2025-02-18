// Initial configuration with default values
const DEFAULT_PORT = import.meta.env.VITE_BACKEND_PORT || 5174;
const DEFAULT_WS_PORT = import.meta.env.VITE_MQTT_PORT || 8083;
const DEFAULT_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost';

// Create initial config object
export const config = {
  backendUrl: `http://${DEFAULT_HOST}:${DEFAULT_PORT}`,
  wsUrl: `ws://${DEFAULT_HOST}:${DEFAULT_WS_PORT}`,
  mqttBroker: `ws://${DEFAULT_HOST}:${DEFAULT_WS_PORT}/mqtt`,
  serverHost: DEFAULT_HOST,
  serverPort: DEFAULT_PORT.toString()
};

// Function to initialize config with local IP
export async function updateConfigWithLocalIp() {
  try {
    // Get the local IP from the backend
    const response = await fetch(`${config.backendUrl}/api/local-ip`);
    if (!response.ok) {
      throw new Error('Failed to get local IP');
    }
    const data = await response.json();
    if (!data.success || !data.ip) {
      throw new Error('Invalid response from server');
    }
    
    // Use the local IP from the backend for MQTT broker connection
    const host = data.ip;
    
    // Use the default ports for backend and MQTT
    const backendPort = DEFAULT_PORT;
    const wsPort = DEFAULT_WS_PORT;
    
    // Update all URLs with the determined host and port
    updateConfigUrls(host, backendPort, wsPort);
    return true;
  } catch (error) {
    console.error('Error initializing config:', error);
    // Fallback to default values if everything else fails
    updateConfigUrls(DEFAULT_HOST, DEFAULT_PORT, DEFAULT_WS_PORT);
    return false;
  }
}

// Helper function to update all URLs
function updateConfigUrls(host: string, backendPort: string | number, wsPort: string | number) {
  config.serverHost = host;
  config.serverPort = backendPort.toString();
  
  // If we're accessing via HTTPS, use secure protocols
  const isSecure = window.location.protocol === 'https:';
  const httpProtocol = isSecure ? 'https://' : 'http://';
  const wsProtocol = isSecure ? 'wss://' : 'ws://';
  
  config.backendUrl = `${httpProtocol}${host}${backendPort ? `:${backendPort}` : ''}`;
  config.wsUrl = `${wsProtocol}${host}${backendPort ? `:${backendPort}` : ''}`;
  config.mqttBroker = `${wsProtocol}${host}${wsPort ? `:${wsPort}` : ''}/mqtt`;
  
  console.log('Config URLs updated:', config);
}

// Initialize the config immediately
updateConfigWithLocalIp();