// Código para Relé - ESP32
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverIP = "192.168.10.100";
const int serverPort = 8080;
const int RELAY_PIN = 5;

WebSocketsClient webSocket;
String deviceId = "relay_001";

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(115200);
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
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    String message = String((char*)payload);
    StaticJsonDocument<200> doc;
    deserializeJson(doc, message);

    if (doc["type"] == "relay") {
      bool state = doc["state"];
      digitalWrite(RELAY_PIN, state ? HIGH : LOW);
      sendState(state);
    }
  } else if (type == WStype_CONNECTED) {
    registerDevice();
  }
}

void registerDevice() {
  StaticJsonDocument<200> doc;
  doc["type"] = "register";
  doc["deviceId"] = deviceId;
  doc["deviceType"] = "relay";

  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

void sendState(bool state) {
  StaticJsonDocument<200> doc;
  doc["type"] = "relay";
  doc["state"] = state;

  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}