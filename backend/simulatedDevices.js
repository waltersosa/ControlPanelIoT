import mqtt from 'mqtt';

const client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

// Configuración del dispositivo simulado
const deviceConfig = {
  id: 'dht_sim_001',
  name: 'DHT Simulado',
  type: 'dht',
  category: 'Sensor'
};

// Función para generar datos aleatorios del sensor
function generateSensorData() {
  return {
    temperature: (20 + Math.random() * 10).toFixed(1), // Temperatura entre 20-30°C
    humidity: (50 + Math.random() * 30).toFixed(1),    // Humedad entre 50-80%
    cpuFreq: 240,
    wifiStrength: -(35 + Math.random() * 20).toFixed(0), // RSSI entre -35 y -55 dBm
    uptime: Math.floor(Date.now() / 1000),
    ipAddress: '192.168.1.150'
  };
}

// Función para publicar datos
function publishData() {
  const message = {
    name: deviceConfig.name,
    type: deviceConfig.type,
    category: deviceConfig.category,
    data: generateSensorData()
  };

  const topic = `iot/device/${deviceConfig.id}/state`;
  client.publish(topic, JSON.stringify(message), { qos: 1 });
  console.log('Datos publicados:', message);
}

// Manejo de la conexión MQTT
client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  
  // Publicar datos cada 2 segundos
  setInterval(publishData, 2000);
});

client.on('error', (error) => {
  console.error('Error de conexión:', error);
});

// Manejar el cierre limpio
process.on('SIGINT', () => {
  console.log('Cerrando conexión MQTT...');
  client.end();
  process.exit();
}); 