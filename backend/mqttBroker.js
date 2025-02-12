import { EventEmitter } from 'events';

// Simulación de broker MQTT
class MQTTBroker extends EventEmitter {
  constructor() {
    super();
    this.topics = new Map();
    this.clients = new Map();
    console.log('MQTT Broker iniciado');
  }

  subscribe(clientId, topic) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, new Set());
    }
    this.topics.get(topic).add(clientId);
    console.log(`Cliente ${clientId} suscrito a ${topic}`);
  }

  unsubscribe(clientId, topic) {
    if (this.topics.has(topic)) {
      this.topics.get(topic).delete(clientId);
    }
  }

  publish(topic, message, sender) {
    if (this.topics.has(topic)) {
      const subscribers = this.topics.get(topic);
      subscribers.forEach(clientId => {
        if (clientId !== sender) {
          this.emit('message', clientId, topic, message);
        }
      });
    }
    console.log(`Mensaje publicado en ${topic}:`, message);
  }

  registerClient(clientId, client) {
    this.clients.set(clientId, client);
    console.log(`Cliente registrado: ${clientId}`);
  }

  removeClient(clientId) {
    this.clients.delete(clientId);
    // Eliminar de todas las suscripciones
    this.topics.forEach(subscribers => {
      subscribers.delete(clientId);
    });
  }
}

export const broker = new MQTTBroker();