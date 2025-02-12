import { MQTTClient } from './mqttClient.js';

class SimulatedDevice {
  constructor(deviceId, type) {
    this.deviceId = deviceId;
    this.type = type;
    this.client = new MQTTClient(deviceId);
    this.interval = null;
    this.relayState = false;

    // Configurar cliente MQTT
    this.client.on('connect', () => {
      console.log(`Dispositivo ${deviceId} conectado`);
      this.startSimulation();
    });

    this.client.on('message', (topic, message) => {
      if (topic === `iot/device/${deviceId}/command`) {
        this.handleCommand(JSON.parse(message.toString()));
      }
    });
  }

  connect() {
    this.client.connect();
    this.client.subscribe(`iot/device/${this.deviceId}/command`);
  }

  handleCommand(message) {
    switch (this.type) {
      case 'relay':
        if (message.command === 'setState') {
          this.relayState = message.value;
          this.publishState({ state: this.relayState });
        }
        break;

      case 'servo':
        if (message.command === 'setAngle') {
          this.publishState({ angle: message.value });
        }
        break;
    }
  }

  publishState(data) {
    const state = {
      deviceId: this.deviceId,
      type: this.type,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        cpuFreq: parseFloat((160 + Math.random() * 80).toFixed(1)), // CPU frecuencia con 1 decimal
        wifiStrength: parseFloat((-30 - Math.random() * 40).toFixed(1)), // WiFi con 1 decimal
        uptime: Math.floor(process.uptime()) // Tiempo de actividad
      }
    };

    this.client.publish(`iot/device/${this.deviceId}/state`, JSON.stringify(state));
  }

  startSimulation() {
    switch (this.type) {
      case 'dht':
        this.interval = setInterval(() => {
          this.publishState({
            temperature: parseFloat((20 + Math.random() * 10).toFixed(1)), // Temperatura con 1 decimal
            humidity: parseFloat((40 + Math.random() * 20).toFixed(1)) // Humedad con 1 decimal
          });
        }, 2000);
        break;

      case 'relay':
        this.interval = setInterval(() => {
          this.relayState = !this.relayState;
          this.publishState({ state: this.relayState });
        }, 5000);
        break;

      case 'servo':
        this.interval = setInterval(() => {
          const angle = Math.floor(Math.random() * 180);
          this.publishState({ angle });
        }, 3000);
        break;
    }
  }

  stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default SimulatedDevice;
