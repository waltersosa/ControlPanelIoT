import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Thermometer, RotateCcw, Download, Wifi, Cable } from 'lucide-react';
import { saveAs } from 'file-saver';

export const DeviceGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'esp32' | 'esp8266'>('esp32');

  const handleDownload = async (platform: string, sensor: string) => {
    try {
      const response = await fetch(`/codigos/${platform}/${sensor}.ino`);
      const code = await response.text();
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${platform}_${sensor}.ino`);
    } catch (error) {
      console.error('Error al descargar el código:', error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">¿Cómo agregar dispositivos?</h2>
        
        {/* Arduino Setup Guide */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Configuración del Entorno de Desarrollo</h3>
          
          {/* Arduino IDE Installation */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-6">
            <h4 className="text-lg font-medium text-white mb-4">1. Instalar Arduino IDE</h4>
            <ol className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-blue-400">1.1</span>
                <div>
                  <p>Descarga Arduino IDE 2.0 desde el sitio oficial:</p>
                  <a 
                    href="https://www.arduino.cc/en/software" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    https://www.arduino.cc/en/software
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-blue-400">1.2</span>
                <p>Ejecuta el instalador y sigue las instrucciones del asistente</p>
              </li>
            </ol>
          </div>

          {/* ESP Boards Installation */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-6">
            <h4 className="text-lg font-medium text-white mb-4">2. Instalar Soporte para ESP32/ESP8266</h4>
            <ol className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-blue-400">2.1</span>
                <div>
                  <p className="mb-2">Abre Arduino IDE y ve a:</p>
                  <p className="font-mono bg-black/30 p-2 rounded">
                    Archivo → Preferencias
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-blue-400">2.2</span>
                <div>
                  <p className="mb-2">En "URLs Adicionales de Gestor de Placas", agrega:</p>
                  <div className="space-y-2">
                    <p className="font-mono bg-black/30 p-2 rounded text-xs">
                      https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
                    </p>
                    <p className="font-mono bg-black/30 p-2 rounded text-xs">
                      http://arduino.esp8266.com/stable/package_esp8266com_index.json
                    </p>
                  </div>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-blue-400">2.3</span>
                <div>
                  <p className="mb-2">Instala las placas:</p>
                  <p className="font-mono bg-black/30 p-2 rounded">
                    Herramientas → Placa → Gestor de tarjetas
                  </p>
                  <p className="mt-2">Busca e instala:</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>esp32 by Espressif Systems</li>
                    <li>esp8266 by ESP8266 Community</li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

          {/* USB Drivers */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-medium text-white mb-4">3. Instalar Drivers USB</h4>
            <div className="space-y-4 text-gray-400">
              <p>Dependiendo de tu placa, necesitarás instalar el driver CP210x o CH340:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 rounded-lg">
                  <h5 className="font-medium text-white mb-2">CP210x (ESP32 DevKit)</h5>
                  <a 
                    href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Descargar Driver CP210x
                  </a>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg">
                  <h5 className="font-medium text-white mb-2">CH340 (NodeMCU)</h5>
                  <a 
                    href="http://www.wch-ic.com/downloads/CH341SER_ZIP.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Descargar Driver CH340
                  </a>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400">
                  <strong>Nota:</strong> Después de instalar los drivers, puede ser necesario reiniciar tu computadora.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Microcontrollers Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ESP32 */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-white">ESP32</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Microcontrolador de alto rendimiento con WiFi y Bluetooth integrado.
              Ideal para proyectos IoT que requieren mayor potencia de procesamiento.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Wifi className="w-4 h-4" />
              <span>WiFi 2.4GHz</span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Diagrama de Pines</h4>
              <img 
                src="https://www.upesy.com/cdn/shop/files/doc-esp32-pinout-reference-wroom-devkit.png?width=1038"
                alt="ESP32 Pinout"
                className="w-full rounded-lg border border-gray-700"
              />
            </div>
          </div>

          {/* ESP8266 */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-white">ESP8266</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Solución económica y eficiente para proyectos IoT básicos.
              Excelente para sensores y actuadores simples.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Wifi className="w-4 h-4" />
              <span>WiFi 2.4GHz</span>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-400 mb-2">Diagrama de Pines</h4>
              <img 
                src="https://europe1.discourse-cdn.com/arduino/original/4X/2/a/4/2a4efa73fec94ad7ab5fe9eebb8cddfbabe21f82.png"
                alt="ESP8266 Pinout"
                className="w-full rounded-lg border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Sensors Section */}
        <h3 className="text-xl font-semibold text-white mb-4">Sensores Compatibles</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Relay */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h4 className="text-lg font-medium text-white">Relé</h4>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP32', 'relay')}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-500">ESP32</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP8266', 'relay')}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">ESP8266</span>
                </motion.button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Control de dispositivos eléctricos de alta potencia.</p>
            <div className="space-y-4 mt-4">
              <div>
                <h5 className="text-sm font-medium text-blue-400 mb-2">ESP32</h5>
                <img 
                  src="https://elosciloscopio.com/wp-content/uploads/2021/03/1616944649_426_Tutorial-de-reles-para-Arduino-ESP8266-y-ESP32.png"
                  alt="Conexión Relé ESP32"
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <h5 className="text-sm font-medium text-green-400 mb-2">ESP8266</h5>
                <img 
                  src="https://elosciloscopio.com/wp-content/uploads/2021/03/1616944648_456_Tutorial-de-reles-para-Arduino-ESP8266-y-ESP32.png"
                  alt="Conexión Relé ESP8266"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* DHT Sensor */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-6 h-6 text-red-500" />
                <h4 className="text-lg font-medium text-white">DHT22</h4>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP32', 'dht')}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-500">ESP32</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP8266', 'dht')}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">ESP8266</span>
                </motion.button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Sensor de temperatura y humedad de alta precisión.</p>
            <div className="space-y-4 mt-4">
              <div>
                <h5 className="text-sm font-medium text-blue-400 mb-2">ESP32</h5>
                <img 
                  src="https://i0.wp.com/www.profetolocka.com.ar/wp-content/uploads/2022/06/DHT22_ESP32-1.png?ssl=1"
                  alt="Conexión DHT22 ESP32"
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <h5 className="text-sm font-medium text-green-400 mb-2">ESP8266</h5>
                <img 
                  src="https://www.losant.com/hs-fs/hubfs/Blog/dht22/dht22_esp8266_wiring.png?width=960&name=dht22_esp8266_wiring.png"
                  alt="Conexión DHT22 ESP8266"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Servo */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-6 h-6 text-blue-500" />
                <h4 className="text-lg font-medium text-white">Servomotor</h4>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP32', 'servo')}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-500">ESP32</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload('ESP8266', 'servo')}
                  className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">ESP8266</span>
                </motion.button>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Control preciso de movimiento rotatorio.</p>
            <div className="space-y-4 mt-4">
              <div>
                <h5 className="text-sm font-medium text-blue-400 mb-2">ESP32</h5>
                <img 
                  src="https://esp32io.com/images/tutorial/esp32-servo-motor-wiring-diagram.jpg"
                  alt="Conexión Servo ESP32"
                  className="w-full rounded-lg"
                />
              </div>
              <div>
                <h5 className="text-sm font-medium text-green-400 mb-2">ESP8266</h5>
                <img 
                  src="https://hackster.imgix.net/uploads/attachments/1112787/annotation_2020-05-02_143939_EyjyIM6BVE.jpg"
                  alt="Conexión Servo ESP8266"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Cable className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Conexión al Servidor</span>
          </div>
          <p className="text-sm text-gray-400">
            Los dispositivos se conectan al servidor WebSocket en la dirección IP 192.168.10.100 
            y publican sus datos en tiempo real. La plataforma web automáticamente detectará 
            y mostrará los nuevos dispositivos.
          </p>
        </div>
      </motion.div>
    </div>
  );
};