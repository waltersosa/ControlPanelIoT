// Código para Relay - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "HOLA";  // Cambia esto por el SSID de tu red WiFi
const char* password = "12345678";  // Cambia esto por la contraseña de tu red WiFi
const char* mqtt_server = "192.168.10.122";  // Cambiado a la IP del broker
const int mqtt_port = 1883;
const int relayPin = 2;  // Cambiado a GPIO2 que tiene un LED incorporado para pruebas

// Constante para definir la lógica del relay
const bool RELAY_ACTIVE_HIGH = true; // Cambiado a true para probar la otra lógica

WiFiClient espClient;
PubSubClient client(espClient);
const char* deviceId = "relay_esp32_001";  // ID único para este dispositivo
const char* stateTopic = "iot/device/relay_esp32_001/state";
const char* commandTopic = "iot/device/relay_esp32_001/command";
const char* discoveryTopic = "iot/discovery";
bool relayState = false;

// Declaraciones de funciones
void setRelayState(bool state);
void sendState();
void callback(char* topic, byte* payload, unsigned int length);
void reconnect();

void setRelayState(bool state) {
  relayState = state;
  // Lógica directa - para depuración
  digitalWrite(relayPin, state ? HIGH : LOW);
  
  // Debug más detallado
  Serial.print("Relay state cambiado a: ");
  Serial.print(state ? "ON" : "OFF");
  Serial.print(" (Pin físico: ");
  Serial.print(state ? "HIGH" : "LOW");
  Serial.println(")");
}

void sendState() {
  StaticJsonDocument<256> doc;
  
  // Información del dispositivo
  doc["name"] = "Relay Luz";
  doc["type"] = "relay";
  doc["category"] = "Control";
  
  // Datos del dispositivo
  JsonObject data = doc.createNestedObject("data");
  data["relayState"] = relayState;
  data["cpuFreq"] = ESP.getCpuFreqMHz();
  data["wifiStrength"] = WiFi.RSSI();
  data["uptime"] = millis() / 1000;
  data["ipAddress"] = WiFi.localIP().toString();

  String message;
  serializeJson(doc, message);
  
  Serial.print("Enviando estado: ");
  Serial.println(message);
  
  client.publish(stateTopic, message.c_str(), false);
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("Mensaje recibido en topic: ");
  Serial.println(topic);
  Serial.print("Mensaje: ");
  Serial.println(message);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if (error) {
    Serial.print("Error deserializando JSON: ");
    Serial.println(error.c_str());
    return;
  }

  if (!doc.containsKey("command") || !doc.containsKey("value")) {
    Serial.println("Error: Mensaje no contiene 'command' o 'value'");
    return;
  }

  String command = doc["command"].as<String>();
  if (command == "setState") {
    bool newState = doc["value"].as<bool>();
    Serial.print("Cambiando relay a: ");
    Serial.println(newState ? "ON" : "OFF");
    
    // Cambiar el estado del relay
    setRelayState(newState);
    
    // Enviar el nuevo estado
    sendState();
  } else {
    Serial.print("Comando desconocido: ");
    Serial.println(command);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_RELAY_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {
      Serial.println("conectado");
      
      // Volver a publicar el mensaje de discovery
      StaticJsonDocument<200> discovery;
      discovery["deviceId"] = deviceId;
      discovery["type"] = "relay";
      discovery["stateTopic"] = stateTopic;
      discovery["commandTopic"] = commandTopic;

      String discoveryMessage;
      serializeJson(discovery, discoveryMessage);
      client.publish(discoveryTopic, discoveryMessage.c_str(), true);

      // Volver a suscribirse al topic de comandos
      client.subscribe(commandTopic);
      Serial.print("Suscrito al topic de comandos: ");
      Serial.println(commandTopic);
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Configuración del pin
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW); // Asegurarse que empiece apagado
  Serial.println("Pin configurado como salida");
  
  // Prueba inicial del pin
  Serial.println("Probando pin del relay...");
  digitalWrite(relayPin, HIGH);
  delay(1000);
  digitalWrite(relayPin, LOW);
  Serial.println("Prueba de pin completada");
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Generar un ID de cliente único
  String clientId = "ESP32_RELAY_" + String(random(0xffff), HEX);

  if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {
    Serial.println("Conectado al broker MQTT");
    
    // Publicar mensaje de discovery
    StaticJsonDocument<200> discovery;
    discovery["deviceId"] = deviceId;
    discovery["type"] = "relay";
    discovery["stateTopic"] = stateTopic;
    discovery["commandTopic"] = commandTopic;

    String discoveryMessage;
    serializeJson(discovery, discoveryMessage);
    client.publish(discoveryTopic, discoveryMessage.c_str(), true);

    // Suscribirse al topic de comandos
    client.subscribe(commandTopic);
    Serial.print("Suscrito al topic de comandos: ");
    Serial.println(commandTopic);
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  static unsigned long lastTime = 0;
  if (millis() - lastTime > 2000) {
    sendState();
    lastTime = millis();
  }
}