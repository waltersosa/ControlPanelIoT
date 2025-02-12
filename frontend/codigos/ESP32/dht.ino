// Código para DHT22 - ESP32
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverIP = "192.168.10.100";
const int serverPort = 8080;
const int DHT_PIN = 4;

DHT dht(DHT_PIN, DHT22);
WebSocketsClient webSocket;
String deviceId = "dht_001";

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  webSocket.begin(serverIP, serverPort, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();
  
  static unsigned long lastTime = 0;
  if (millis() - lastTime > 2000) {
    sendSensorData();
    lastTime = millis();
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_CONNECTED) {
    registerDevice();
  }
}

void registerDevice() {
  StaticJsonDocument<200> doc;
  doc["type"] = "register";
  doc["deviceId"] = deviceId;
  doc["deviceType"] = "dht";

  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

void sendSensorData() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (!isnan(temp) && !isnan(hum)) {
    StaticJsonDocument<200> doc;
    doc["type"] = "dht";
    doc["temperature"] = temp;
    doc["humidity"] = hum;

    String message;
    serializeJson(doc, message);
    webSocket.sendTXT(message);
  }
}