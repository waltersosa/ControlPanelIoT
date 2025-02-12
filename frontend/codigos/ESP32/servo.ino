// Código para Servomotor - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const int SERVO_PIN = 13;

Servo myservo;
WiFiClient espClient;
PubSubClient client(espClient);
String deviceId = "servo_001";
int currentAngle = 0;

void setup() {
  Serial.begin(115200);
  myservo.attach(SERVO_PIN);
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
    if (doc.containsKey("command") && doc["command"] == "setAngle") {
      int angle = doc["value"].as<int>();
      if (angle >= 0 && angle <= 180) {
        currentAngle = angle;
        myservo.write(angle);
        sendState();
      }
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_SERVO_" + String(random(0xffff), HEX);
    
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
  doc["name"] = "Servo Persiana";
  doc["type"] = "servo";
  doc["category"] = "Actuador";
  JsonObject data = doc.createNestedObject("data");
  data["servoAngle"] = currentAngle;
  data["cpuFreq"] = ESP.getCpuFreqMHz();
  data["wifiStrength"] = WiFi.RSSI();
  data["uptime"] = millis() / 1000;
  data["ipAddress"] = WiFi.localIP().toString();

  String message;
  serializeJson(doc, message);
  client.publish(("iot/device/" + deviceId + "/state").c_str(), message.c_str());
}