# IoT Dashboard Backend

Este es el servidor WebSocket para el IoT Dashboard que maneja las conexiones con los dispositivos ESP32 y ESP8266.

## Características

- Conexiones WebSocket bidireccionales
- Soporte para múltiples tipos de dispositivos:
  - Relés
  - Sensores DHT (temperatura y humedad)
  - Servomotores
- Registro automático de dispositivos
- Broadcast de estado en tiempo real
- Endpoint de health check

## Estructura de Mensajes

### Registro de Dispositivo
```json
{
  "type": "register",
  "deviceId": "unique_device_id",
  "deviceType": "relay|dht|servo"
}
```

### Mensajes de Relé
```json
{
  "type": "relay",
  "state": true|false
}
```

### Mensajes de DHT
```json
{
  "type": "dht",
  "temperature": 23.5,
  "humidity": 45
}
```

### Mensajes de Servo
```json
{
  "type": "servo",
  "angle": 90
}
```

## Uso

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor:
   ```bash
   npm run server
   ```

3. El servidor estará disponible en:
   - WebSocket: ws://localhost:8080
   - Health Check: http://localhost:8080/health

## Endpoints

- `ws://localhost:8080`: Conexión WebSocket principal
- `GET /health`: Estado del servidor y número de dispositivos conectados