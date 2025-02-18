import { WebSocketServer } from 'ws';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { MQTTClient } from './mqttClient.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getLocalIp } from './utils/getLocalIp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app with CORS configuration
const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware for parsing JSON and handling CORS preflight
app.use(express.json());
app.options('*', cors());

// API endpoint for getting local IP with error handling
app.get('/api/local-ip', (req, res) => {
  try {
    const ip = getLocalIp();
    res.setHeader('Content-Type', 'application/json');
    res.json({ ip, success: true });
  } catch (error) {
    console.error('Error getting local IP:', error);
    res.status(500).json({ 
      error: 'Failed to get local IP', 
      success: false 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    connectedDevices: wss.clients ? wss.clients.size : 0,
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

// Get MQTT broker URL from environment variables
const mqttBrokerUrl = process.env.MQTT_BROKER || 'mqtt://localhost:1883';

// MQTT client for the server
const serverMqtt = new MQTTClient('webserver', mqttBrokerUrl);
serverMqtt.connect();

// Start server
const port = process.env.PORT || 5174;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Local IP: ${getLocalIp()}`);
});