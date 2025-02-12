import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Folder, RefreshCw, Upload, Download, Settings, HardDrive, Code, Terminal, ChevronDown } from 'lucide-react';

export const TerminalIDE = () => {
  const [selectedDevice, setSelectedDevice] = useState('ESP32');
  const [selectedPort, setSelectedPort] = useState('/dev/ttyUSB0');
  const [code, setCode] = useState(`// Código para ${selectedDevice}
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char* serverIP = "192.168.10.100";
const int serverPort = 8080;

void setup() {
  Serial.begin(115200);
  // Tu código aquí
}

void loop() {
  // Tu código aquí
}`);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '> Arduino IDE Iniciado',
    '> Selecciona un dispositivo y puerto para comenzar'
  ]);

  const handleCompile = () => {
    setConsoleOutput(prev => [...prev, '> Compilando código...']);
    // Aquí iría la lógica de compilación
  };

  const handleUpload = () => {
    setConsoleOutput(prev => [...prev, `> Subiendo código a ${selectedDevice}...`]);
    // Aquí iría la lógica de carga
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* IDE Header */}
        <div className="bg-black/60 border-b border-gray-800 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Device Selection */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="appearance-none bg-gray-900 text-white border border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="ESP32">ESP32</option>
                  <option value="ESP8266">ESP8266</option>
                </select>
                <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              <div className="relative">
                <select
                  value={selectedPort}
                  onChange={(e) => setSelectedPort(e.target.value)}
                  className="appearance-none bg-gray-900 text-white border border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="/dev/ttyUSB0">/dev/ttyUSB0</option>
                  <option value="/dev/ttyUSB1">/dev/ttyUSB1</option>
                  <option value="COM3">COM3</option>
                  <option value="COM4">COM4</option>
                </select>
                <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  defaultValue="115200"
                  className="appearance-none bg-gray-900 text-white border border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="9600">9600 baud</option>
                  <option value="115200">115200 baud</option>
                  <option value="921600">921600 baud</option>
                </select>
                <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCompile}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg shadow-lg transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                <span>Verificar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg shadow-lg transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                <span>Subir</span>
              </motion.button>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200"
                >
                  <Save className="w-4 h-4 text-gray-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200"
                >
                  <Folder className="w-4 h-4 text-gray-300" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* IDE Body */}
        <div className="grid md:grid-cols-2 h-[600px] bg-black/40">
          {/* Code Editor */}
          <div className="border-r border-gray-800">
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">sketch.ino</span>
              </div>
            </div>
            <div className="relative h-[calc(100%-2.5rem)]">
              <div className="absolute inset-0">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 focus:outline-none resize-none"
                  spellCheck="false"
                  style={{
                    lineHeight: '1.6',
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Serial Monitor */}
          <div className="border-t md:border-t-0 border-gray-800">
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-gray-800">
              <span className="text-sm font-medium text-gray-300">Monitor Serie</span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                >
                  <RefreshCw className="w-3 h-3 text-gray-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                >
                  <Download className="w-3 h-3 text-gray-300" />
                </motion.button>
              </div>
            </div>
            <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-4 font-mono text-sm bg-black/20">
              {consoleOutput.map((line, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-black/60 border-t border-gray-800 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>{selectedDevice}</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>{selectedPort}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>115200 baud</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Listo</span>
          </div>
        </div>
      </div>
    </div>
  );
};