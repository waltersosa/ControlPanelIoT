// Código para Servomotor - ESP8266
#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverIP = "192.168.10.100";
const int serverPort = 8080;
const int SERVO_PIN = 13;

Servo myservo;
WebSocketsClient webSocket;
String deviceId = "servo_001";

void setup() {
  Serial.begin(115200);
  myservo.attach(SERVO_PIN);
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

    if (doc["type"] == "servo") {
      int angle = doc["angle"];
      if (angle >= 0 && angle <= 180) {
        myservo.write(angle);
        sendAngle(angle);
      }
    }
  } else if (type == WStype_CONNECTED) {
    registerDevice();
  }
}

void registerDevice() {
  StaticJsonDocument<200> doc;
  doc["type"] = "register";
  doc["deviceId"] = deviceId;
  doc["deviceType"] = "servo";

  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}

void sendAngle(int angle) {
  StaticJsonDocument<200> doc;
  doc["type"] = "servo";
  doc["angle"] = angle;

  String message;
  serializeJson(doc, message);
  webSocket.sendTXT(message);
}