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
   npm run start
   ```

3. El servidor estará disponible en:
   - WebSocket: ws://localhost:5174
   - API REST: http://localhost:5174
   - Health Check: http://localhost:5174/api/health

### Conexión con broker MQTT real

El backend ahora se conecta a un broker MQTT real (por defecto EMQX en la misma máquina).

- Dirección por defecto: `mqtt://localhost:1883`
- Puedes sobrescribirla exportando la variable de entorno `MQTT_BROKER` antes de iniciar el servidor.
- El cliente reutiliza la librería oficial `mqtt` y loguea en consola eventos de conexión, reconexión y errores.
- Si se ejecuta dentro de Docker, establece la variable `PUBLIC_HOST` para indicar qué IP/host debe exponer a los clientes (por defecto `localhost`).

## Endpoints

- `ws://localhost:5174`: Conexión WebSocket principal
- `GET /api/health`: Estado del servidor y número de dispositivos conectados

## Docker Compose (stack completo)

En el directorio raíz del proyecto hay un `docker-compose.yml` que levanta EMQX, el backend y el frontend en contenedores.

```bash
docker-compose up --build
```

Servicios expuestos en la máquina host:

- Backend: `http://localhost:5174`
- Frontend: `http://localhost:5173`
- EMQX MQTT TCP: `mqtt://localhost:1883`
- EMQX WebSocket: `ws://localhost:8083/mqtt`
- Consola EMQX: `http://localhost:18083` (usuario por defecto `admin` / `public`)