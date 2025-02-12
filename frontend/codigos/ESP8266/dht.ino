// Código para DHT22 - ESP8266
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const int DHT_PIN = 4;

DHT dht(DHT_PIN, DHT22);
WiFiClient espClient;
PubSubClient client(espClient);
String deviceId = "dht_esp8266_001";  // ID único para este dispositivo

void setup() {
  Serial.begin(115200);
  dht.begin();
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
  
  static unsigned long lastTime = 0;
  if (millis() - lastTime > 2000) {
    sendSensorData();
    lastTime = millis();
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // No necesitamos callback para el DHT ya que solo envía datos
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP8266_DHT_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("conectado");
    } else {
      Serial.print("falló, rc=");
      Serial.print(client.state());
      Serial.println(" intentando de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void sendSensorData() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (!isnan(temp) && !isnan(hum)) {
    StaticJsonDocument<256> doc;
    
    // Información del dispositivo
    doc["name"] = "DHT Cocina";      // Nombre descriptivo
    doc["type"] = "dht";             // Tipo de dispositivo
    doc["category"] = "Sensor";      // Categoría
    
    // Datos del sensor y estado del dispositivo
    JsonObject data = doc.createNestedObject("data");
    data["temperature"] = temp;
    data["humidity"] = hum;
    data["cpuFreq"] = ESP.getCpuFreqMHz();
    data["wifiStrength"] = WiFi.RSSI();
    data["uptime"] = millis() / 1000;
    data["ipAddress"] = WiFi.localIP().toString();

    String message;
    serializeJson(doc, message);
    
    // Debug - Mostrar el mensaje que se va a enviar
    Serial.print("Enviando mensaje MQTT: ");
    Serial.println(message);
    
    // Publicar con QoS 1
    String topic = "iot/device/" + deviceId + "/state";
    client.publish(topic.c_str(), message.c_str(), true);
  }
}