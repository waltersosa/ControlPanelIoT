import { EventEmitter } from 'events';
import { broker } from './mqttBroker.js';

class MQTTClient extends EventEmitter {
  constructor(clientId) {
    super();
    this.clientId = clientId;
    this.connected = false;
    this.subscriptions = new Set();
    
    // Registrar con el broker
    broker.registerClient(this.clientId, this);
    
    // Escuchar mensajes del broker
    broker.on('message', (targetClientId, topic, message) => {
      if (targetClientId === this.clientId && this.subscriptions.has(topic)) {
        this.emit('message', topic, message);
      }
    });
  }

  connect() {
    this.connected = true;
    this.emit('connect');
    return this;
  }

  subscribe(topic) {
    this.subscriptions.add(topic);
    broker.subscribe(this.clientId, topic);
    return this;
  }

  publish(topic, message) {
    if (this.connected) {
      broker.publish(topic, message, this.clientId);
    }
    return this;
  }

  disconnect() {
    this.connected = false;
    broker.removeClient(this.clientId);
    this.emit('disconnect');
  }
}

export { MQTTClient };