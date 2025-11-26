import { EventEmitter } from 'events';
import mqtt from 'mqtt';

class MQTTClient extends EventEmitter {
  constructor(clientId, brokerUrl, options = {}) {
    super();
    this.clientId = clientId;
    this.brokerUrl = brokerUrl;
    this.options = {
      clientId: this.clientId,
      clean: true,
      reconnectPeriod: 1000,
      ...options
    };

    this.client = null;
    this.connected = false;
  }

  connect() {
    if (this.client) {
      return this;
    }

    this.client = mqtt.connect(this.brokerUrl, this.options);

    this.client.on('connect', () => {
      this.connected = true;
      this.emit('connect');
    });

    this.client.on('reconnect', () => {
      this.emit('reconnect');
    });

    this.client.on('close', () => {
      this.connected = false;
      this.emit('disconnect');
    });

    this.client.on('error', (error) => {
      this.emit('error', error);
    });

    this.client.on('message', (topic, message, packet) => {
      const payload = Buffer.isBuffer(message) ? message.toString() : message;
      this.emit('message', topic, payload, packet);
    });

    return this;
  }

  subscribe(topic, options = {}) {
    if (!this.client) {
      throw new Error('MQTT client no está conectado');
    }

    this.client.subscribe(topic, options, (error, granted) => {
      if (error) {
        this.emit('error', error);
        return;
      }
      this.emit('subscribed', granted);
    });

    return this;
  }

  publish(topic, message, options = {}) {
    if (!this.client) {
      throw new Error('MQTT client no está conectado');
    }

    const payload = typeof message === 'string' ? message : JSON.stringify(message);

    this.client.publish(topic, payload, options, (error) => {
      if (error) {
        this.emit('error', error);
      } else {
        this.emit('published', topic, payload);
      }
    });

    return this;
  }

  disconnect(force = false) {
    if (!this.client) {
      return;
    }

    this.client.end(force, {}, () => {
      this.connected = false;
      this.emit('disconnect');
      this.client.removeAllListeners();
      this.client = null;
    });
  }
}

export { MQTTClient };