const isBrowser = typeof window !== 'undefined';

function resolveHost(): string {
  if (import.meta.env.VITE_BACKEND_HOST) {
    return import.meta.env.VITE_BACKEND_HOST;
  }

  if (isBrowser && window.location.hostname) {
    return window.location.hostname;
  }

  return 'localhost';
}

function resolveBackendPort(): string {
  if (import.meta.env.VITE_BACKEND_PORT) {
    return import.meta.env.VITE_BACKEND_PORT;
  }

  if (isBrowser) {
    return window.location.port || '';
  }

  return '5173';
}

function resolveMqttPort(): string {
  return import.meta.env.VITE_MQTT_PORT || '8083';
}

const DEFAULT_HOST = resolveHost();
const DEFAULT_PORT = resolveBackendPort();
const DEFAULT_WS_PORT = resolveMqttPort();
const DEFAULT_PROTOCOL = isBrowser && window.location.protocol === 'https:' ? 'https://' : 'http://';
const DEFAULT_WS_PROTOCOL = DEFAULT_PROTOCOL === 'https://' ? 'wss://' : 'ws://';

// Create initial config object
export const config = {
  backendUrl: formatUrl(DEFAULT_PROTOCOL, DEFAULT_HOST, DEFAULT_PORT),
  wsUrl: formatUrl(DEFAULT_WS_PROTOCOL, DEFAULT_HOST, DEFAULT_PORT),
  mqttBroker: formatMqttUrl(DEFAULT_WS_PROTOCOL, DEFAULT_HOST, DEFAULT_WS_PORT),
  serverHost: DEFAULT_HOST,
  serverPort: normalizePort(DEFAULT_PORT)
};

// Function to initialize config with local IP
export async function updateConfigWithLocalIp() {
  try {
    const response = await fetch(`${config.backendUrl}/api/local-ip`);
    if (!response.ok) {
      throw new Error('Failed to get local IP');
    }

    const data = await response.json();
    if (!data.success || !data.ip) {
      throw new Error('Invalid response from server');
    }

    const host = data.ip;
    const backendPort = DEFAULT_PORT;
    const wsPort = DEFAULT_WS_PORT;

    updateConfigUrls(host, backendPort, wsPort);
    return true;
  } catch (error) {
    console.error('Error initializing config:', error);
    updateConfigUrls(DEFAULT_HOST, DEFAULT_PORT, DEFAULT_WS_PORT);
    return false;
  }
}

// Helper function to update all URLs
function updateConfigUrls(host: string, backendPort: string | number, wsPort: string | number) {
  config.serverHost = host;
  config.serverPort = normalizePort(backendPort);

  const isSecure = isBrowser && window.location.protocol === 'https:';
  const httpProtocol = isSecure ? 'https://' : 'http://';
  const wsProtocol = isSecure ? 'wss://' : 'ws://';

  config.backendUrl = formatUrl(httpProtocol, host, backendPort);
  config.wsUrl = formatUrl(wsProtocol, host, backendPort);
  config.mqttBroker = formatMqttUrl(wsProtocol, host, wsPort);

  console.log('Config URLs updated:', config);
}

// Initialize the config immediately
updateConfigWithLocalIp();

function normalizePort(port: string | number | undefined): string {
  if (port === undefined || port === null) {
    return '';
  }

  return typeof port === 'number' ? port.toString() : port;
}

function formatUrl(protocol: string, host: string, port: string | number | undefined) {
  const normalizedPort = normalizePort(port);
  const portSegment = normalizedPort ? `:${normalizedPort}` : '';
  return `${protocol}${host}${portSegment}`;
}

function formatMqttUrl(protocol: string, host: string, port: string | number | undefined) {
  const normalizedPort = normalizePort(port);
  const portSegment = normalizedPort ? `:${normalizedPort}` : ':8083';
  return `${protocol}${host}${portSegment}/mqtt`;
}