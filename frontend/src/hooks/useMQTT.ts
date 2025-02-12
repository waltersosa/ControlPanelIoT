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
  username: 'santiago',
  password: 'sosamejia'
};

export const useMQTT = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [topics, setTopics] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);

  const subscribeToTopic = useCallback((mqttClient: mqtt.MqttClient, topic: string) => {
    if (!topics.has(topic)) {
      console.log(`Intentando suscribirse a: ${topic}`);
      mqttClient.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`Error al suscribirse a ${topic}:`, err);
        } else {
          console.log(`Suscrito exitosamente a ${topic}`);
          setTopics(prev => new Set(prev).add(topic));
        }
      });
    }
  }, [topics]);

  useEffect(() => {
    let mqttClient: mqtt.MqttClient | null = null;

    const connect = () => {
      console.log('Intentando conectar al broker:', MQTT_BROKER);
      mqttClient = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS);

      mqttClient.on('connect', () => {
        console.log('Conectado al broker MQTT');
        setIsConnected(true);
        
        mqttClient?.subscribe('iot/discovery', { qos: 1 }, (err) => {
          if (err) {
            console.error('Error al suscribirse a discovery:', err);
          } else {
            console.log('Suscrito a discovery');
          }
        });

        mqttClient?.subscribe('iot/device/+/state', { qos: 1 }, (err) => {
          if (err) {
            console.error('Error al suscribirse a los estados:', err);
          } else {
            console.log('Suscrito a los estados de dispositivos');
          }
        });
      });

      mqttClient.on('message', (topic, message) => {
        console.log(`Mensaje recibido en topic ${topic}:`, message.toString());
        
        try {
          const payload = JSON.parse(message.toString());

          if (topic === 'iot/discovery') {
            console.log('Discovery message received:', payload);
            if (payload.stateTopic && mqttClient) {
              subscribeToTopic(mqttClient, payload.stateTopic);
              if (payload.commandTopic) {
                subscribeToTopic(mqttClient, payload.commandTopic);
              }
            }
            return;
          }

          const deviceId = topic.split('/')[2];
          console.log(`Actualizando dispositivo ${deviceId}:`, payload);

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

            if (deviceIndex >= 0) {
              const newDevices = [...prevDevices];
              newDevices[deviceIndex] = updatedDevice;
              return newDevices;
            } else {
              return [...prevDevices, updatedDevice];
            }
          });
        } catch (error) {
          console.error('Error procesando mensaje MQTT:', error, 'Topic:', topic, 'Message:', message.toString());
        }
      });

      mqttClient.on('error', (error) => {
        console.error('MQTT Error:', error);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        console.log('Conexión MQTT cerrada');
        setIsConnected(false);
      });

      setClient(mqttClient);
    };

    connect();

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, [subscribeToTopic]);

  const toggleRelay = useCallback((deviceId: string, state: boolean) => {
    if (client && isConnected) {
      const topic = `iot/device/${deviceId}/command`;
      const message = JSON.stringify({
        command: 'setState',
        value: state
      });
      console.log(`Enviando comando al relay ${deviceId}:`, message);
      client.publish(topic, message, { qos: 1 });
    } else {
      console.error('No se puede enviar comando: Cliente MQTT no conectado');
    }
  }, [client, isConnected]);

  const setServoAngle = useCallback((deviceId: string, angle: number) => {
    if (client && isConnected && angle >= 0 && angle <= 180) {
      const topic = `iot/device/${deviceId}/command`;
      const message = JSON.stringify({
        command: 'setAngle',
        value: angle
      });
      client.publish(topic, message, { qos: 1 });
    }
  }, [client, isConnected]);

  return {
    devices,
    isConnected,
    toggleRelay,
    setServoAngle
  };
}; 