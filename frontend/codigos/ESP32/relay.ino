// Código para Relay - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "HOLA";  // Cambia esto por el SSID de tu red WiFi
const char* password = "12345678";  // Cambia esto por la contraseña de tu red WiFi
const char* mqtt_server = "192.168.10.122";  // Cambiado a la IP del broker
const int mqtt_port = 1883;
const int relayPin = 13;  // Pin donde está conectado el relay

WiFiClient espClient;
PubSubClient client(espClient);
String deviceId = "relay_esp32_001";  // ID único para este dispositivo
bool relayState = false;

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);  // Asegúrate de que el relay esté apagado al inicio
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Procesar el mensaje recibido
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (message == "ON") {
    digitalWrite(relayPin, HIGH);  // Encender el relay
    Serial.println("Relay encendido");
    relayState = true;
    sendState();
  } else if (message == "OFF") {
    digitalWrite(relayPin, LOW);  // Apagar el relay
    Serial.println("Relay apagado");
    relayState = false;
    sendState();
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_RELAY_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {  // Agregar credenciales
      Serial.println("conectado");
      client.subscribe(("iot/device/" + deviceId + "/command").c_str());  // Suscribirse al topic de comandos
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void sendState() {
  StaticJsonDocument<200> doc;
  doc["name"] = "Relay Luz";
  doc["type"] = "relay";
  doc["category"] = "Control";
  JsonObject data = doc.createNestedObject("data");
  data["relayState"] = relayState;
  data["cpuFreq"] = ESP.getCpuFreqMHz();
  data["wifiStrength"] = WiFi.RSSI();
  data["uptime"] = millis() / 1000;
  data["ipAddress"] = WiFi.localIP().toString();

  String message;
  serializeJson(doc, message);
  client.publish(("iot/device/" + deviceId + "/state").c_str(), message.c_str(), true);
}