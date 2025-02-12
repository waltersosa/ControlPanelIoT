import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt-browser';
import { Device } from '../types/device';
import { config } from '../config';

const MQTT_BROKER = config.mqttBroker;
const MQTT_OPTIONS = {
  keepalive: 60,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 2000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false,
  clientId: `mqttjs_${Math.random().toString(16).substring(2, 10)}_${Date.now()}`,
  username: '',
  password: ''
};

const MQTT_TOPICS = {
  deviceState: 'iot/device/+/state',
  deviceCommand: 'iot/device/{id}/command'
};

export const useMQTT = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mqttClient: mqtt.MqttClient | null = null;

    const connect = () => {
      console.log('Intentando conectar al broker:', MQTT_BROKER);
      mqttClient = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS);

      mqttClient.on('connect', () => {
        console.log('Conectado al broker MQTT');
        setIsConnected(true);
        
        // Suscribirse a todos los estados de dispositivos
        mqttClient?.subscribe('iot/device/+/state', { qos: 1 }, (err) => {
          if (err) {
            console.error('Error al suscribirse:', err);
          } else {
            console.log('Suscrito exitosamente a iot/device/+/state');
          }
        });
      });

      mqttClient.on('error', (error) => {
        console.error('MQTT Error:', error);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        console.log('Conexión MQTT cerrada');
        setIsConnected(false);
      });

      mqttClient.on('reconnect', () => {
        console.log('Intentando reconexión MQTT...');
      });

      mqttClient.on('message', (topic, message) => {
        console.log('Mensaje MQTT recibido:', {
          topic,
          message: message.toString()
        });
        
        try {
          const payload = JSON.parse(message.toString());
          const deviceId = topic.split('/')[2];
          console.log('Procesando dispositivo:', deviceId, payload);

          setDevices(prevDevices => {
            const deviceIndex = prevDevices.findIndex(d => d.id === deviceId);
            const updatedDevice = {
              id: deviceId,
              name: payload.name || `Device ${deviceId}`,
              type: payload.type,
              category: payload.category || 'unknown',
              isOnline: true,
              data: payload.data
            };

            console.log('Dispositivo actualizado:', updatedDevice);

            if (deviceIndex >= 0) {
              const newDevices = [...prevDevices];
              newDevices[deviceIndex] = updatedDevice;
              return newDevices;
            } else {
              return [...prevDevices, updatedDevice];
            }
          });
        } catch (error) {
          console.error('Error procesando mensaje MQTT:', error);
        }
      });

      setClient(mqttClient);
    };

    connect();

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  // Enviar comandos a los dispositivos
  const toggleRelay = useCallback((deviceId: string) => {
    if (client && isConnected) {
      const topic = MQTT_TOPICS.deviceCommand.replace('{id}', deviceId);
      const message = JSON.stringify({
        command: 'setState',
        value: true
      });
      console.log('Enviando comando al relay:', topic, message);
      client.publish(topic, message);
    }
  }, [client, isConnected]);

  const setServoAngle = useCallback((deviceId: string, angle: number) => {
    if (client && isConnected) {
      const topic = MQTT_TOPICS.deviceCommand.replace('{id}', deviceId);
      const message = JSON.stringify({
        command: 'setAngle',
        value: angle
      });
      console.log('Enviando comando al servo:', topic, message);
      client.publish(topic, message);
    }
  }, [client, isConnected]);

  return {
    devices,
    isConnected,
    toggleRelay,
    setServoAngle
  };
}; 