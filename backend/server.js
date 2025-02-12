import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { MQTTClient } from './mqttClient.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear Express app
const app = express();
app.use(cors());

// Crear servidor HTTP
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Cliente MQTT para el servidor
const serverMqtt = new MQTTClient('webserver');
serverMqtt.connect();

// Almacenar estado de dispositivos
const deviceStates = new Map();

// Suscribirse a todos los estados de dispositivos
serverMqtt.subscribe('iot/device/+/state');

// Manejar mensajes MQTT
serverMqtt.on('message', (topic, message) => {
  const deviceId = topic.split('/')[2];
  deviceStates.set(deviceId, {
    ...message,
    lastSeen: Date.now()
  });
  broadcastDeviceStatus();
});

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Nueva conexión WebSocket');

  // Enviar estado actual
  broadcastDeviceStatus();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'command') {
        serverMqtt.publish(
          `iot/device/${message.deviceId}/command`,
          {
            command: message.command,
            value: message.value
          }
        );
      }
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });
});

// Broadcast del estado de dispositivos
function broadcastDeviceStatus() {
  const status = Array.from(deviceStates.entries()).map(([id, state]) => ({
    id,
    type: state.type,
    lastSeen: state.lastSeen,
    data: state.data
  }));

  const message = JSON.stringify({
    type: 'status',
    devices: status
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(message);
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedDevices: deviceStates.size,
    uptime: process.uptime()
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`Servidor ejecutándose en http://${HOST}:${PORT}`);
});

// Limpieza de dispositivos inactivos
setInterval(() => {
  const now = Date.now();
  for (const [deviceId, state] of deviceStates.entries()) {
    if (now - state.lastSeen > 30000) { // 30 segundos
      deviceStates.delete(deviceId);
      broadcastDeviceStatus();
    }
  }
}, 10000);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando servidor HTTP');
  server.close(() => {
    console.log('Servidor HTTP cerrado');
    serverMqtt.disconnect();
    process.exit(0);
  });
});