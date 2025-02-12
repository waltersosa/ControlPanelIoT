// Código para Relé - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const int RELAY_PIN = 5;

WiFiClient espClient;
PubSubClient client(espClient);
String deviceId = "relay_001";
bool relayState = false;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
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
  String message = String((char*)payload).substring(0, length);
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, message);
  
  if (!error) {
    if (doc.containsKey("command") && doc["command"] == "setState") {
      relayState = doc["value"].as<bool>();
      digitalWrite(RELAY_PIN, relayState ? HIGH : LOW);
      sendState();
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_RELAY_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado");
      client.subscribe(("iot/device/" + deviceId + "/command").c_str());
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
  doc["name"] = "Relé Luz";
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
  client.publish(("iot/device/" + deviceId + "/state").c_str(), message.c_str());
}