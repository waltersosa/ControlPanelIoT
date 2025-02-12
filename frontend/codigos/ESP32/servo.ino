// Código para Servo - ESP32
#include <WiFi.h>
#include <PubSubClient.h>
#include <Servo.h>
#include <ArduinoJson.h>

const char* ssid = "HOLA";  // Cambia esto por el SSID de tu red WiFi
const char* password = "12345678";  // Cambia esto por la contraseña de tu red WiFi
const char* mqtt_server = "192.168.10.122";  // Cambiado a la IP del broker
const int mqtt_port = 1883;
const int servoPin = 14;  // Pin donde está conectado el servo

WiFiClient espClient;
PubSubClient client(espClient);
Servo myServo;
String deviceId = "servo_esp32_001";  // ID único para este dispositivo
int currentAngle = 0;

void setup() {
  Serial.begin(115200);
  myServo.attach(servoPin);
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

  // Suponiendo que el mensaje es un ángulo para el servo
  int angle = message.toInt();
  if (angle >= 0 && angle <= 180) {
    myServo.write(angle);  // Mover el servo al ángulo especificado
    currentAngle = angle;  // Actualizar el ángulo actual
    Serial.print("Servo movido a: ");
    Serial.println(angle);
    sendState();  // Enviar el estado actualizado
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando a MQTT...");
    String clientId = "ESP32_SERVO_" + String(random(0xffff), HEX);
    
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
  client.publish(("iot/device/" + deviceId + "/state").c_str(), message.c_str(), true);
}