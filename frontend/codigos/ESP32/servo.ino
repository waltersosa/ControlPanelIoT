// Código para Servo - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

const char* ssid = "HOLA";
const char* password = "12345678";
const char* mqtt_server = "192.168.10.122";
const int mqtt_port = 1883;
const int servoPin = 14;  // Pin GPIO para el servo

Servo myservo;
WiFiClient espClient;
PubSubClient client(espClient);
const char* deviceId = "servo_esp32_001";
const char* stateTopic = "iot/device/servo_esp32_001/state";
const char* commandTopic = "iot/device/servo_esp32_001/command";
const char* discoveryTopic = "iot/discovery";
int currentAngle = 0;

void setServoAngle(int angle) {
  if (angle >= 0 && angle <= 180) {
    currentAngle = angle;
    myservo.write(angle);
    Serial.print("Servo movido a ángulo: ");
    Serial.println(angle);
  }
}

void sendState() {
  StaticJsonDocument<256> doc;
  
  // Información del dispositivo
  doc["name"] = "Servo Persiana";
  doc["type"] = "servo";
  doc["category"] = "Control";
  
  // Datos del dispositivo
  JsonObject data = doc.createNestedObject("data");
  data["servoAngle"] = currentAngle;
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
  if (command == "setAngle") {
    int angle = doc["value"].as<int>();
    if (angle >= 0 && angle <= 180) {
      Serial.print("Moviendo servo a ángulo: ");
      Serial.println(angle);
      setServoAngle(angle);
      sendState();
    } else {
      Serial.println("Ángulo fuera de rango (0-180)");
    }
  } else {
    Serial.print("Comando desconocido: ");
    Serial.println(command);
  }
}

void setup() {
  Serial.begin(115200);
  
  // Configurar el servo
  ESP32PWM::allocateTimer(0);
  myservo.setPeriodHertz(50);  // PWM frecuencia estándar para servos
  myservo.attach(servoPin, 500, 2400); // min/max pulso en microsegundos
  
  // Inicializar en posición 0
  setServoAngle(0);
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  String clientId = "ESP32_SERVO_" + String(random(0xffff), HEX);

  if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {
    Serial.println("Conectado al broker MQTT");
    
    StaticJsonDocument<200> discovery;
    discovery["deviceId"] = deviceId;
    discovery["type"] = "servo";
    discovery["stateTopic"] = stateTopic;
    discovery["commandTopic"] = commandTopic;

    String discoveryMessage;
    serializeJson(discovery, discoveryMessage);
    client.publish(discoveryTopic, discoveryMessage.c_str(), true);

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

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_SERVO_" + String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), "santiago", "sosamejia")) {
      Serial.println("conectado");
      
      StaticJsonDocument<200> discovery;
      discovery["deviceId"] = deviceId;
      discovery["type"] = "servo";
      discovery["stateTopic"] = stateTopic;
      discovery["commandTopic"] = commandTopic;

      String discoveryMessage;
      serializeJson(discovery, discoveryMessage);
      client.publish(discoveryTopic, discoveryMessage.c_str(), true);

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