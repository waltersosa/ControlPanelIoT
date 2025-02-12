import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Play, Save, Folder, X, RefreshCw } from 'lucide-react';

interface TerminalProps {
  show: boolean;
  onClose: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ show, onClose }) => {
  const [output, setOutput] = useState<string[]>([
    '> Iniciando IoT Command Center...',
    '> Servidor WebSocket iniciado en puerto 8080',
    '> Esperando conexiones...'
  ]);

  const [selectedPort, setSelectedPort] = useState('/dev/ttyUSB0');

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-4 bottom-4 h-96 bg-[#1E1E1E] rounded-xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between p-2 bg-[#2D2D2D] border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Monitor Serie</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Port Selection */}
              <select 
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                className="px-2 py-1 text-sm bg-[#3D3D3D] text-gray-300 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="/dev/ttyUSB0">/dev/ttyUSB0</option>
                <option value="/dev/ttyUSB1">/dev/ttyUSB1</option>
                <option value="COM3">COM3</option>
                <option value="COM4">COM4</option>
              </select>
              
              {/* Baud Rate */}
              <select 
                className="px-2 py-1 text-sm bg-[#3D3D3D] text-gray-300 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                defaultValue="115200"
              >
                <option value="9600">9600</option>
                <option value="115200">115200</option>
                <option value="921600">921600</option>
              </select>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Folder className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>

              <button
                onClick={onClose}
                className="p-1 hover:bg-red-500/10 rounded"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="p-4 font-mono text-sm text-green-400 h-[calc(100%-4rem)] overflow-y-auto">
            {output.map((line, index) => (
              <div key={index} className="mb-1">
                {line}
              </div>
            ))}
            <div className="flex items-center space-x-2 text-yellow-500">
              <span>{'>'}</span>
              <div className="w-2 h-4 bg-yellow-500 animate-pulse" />
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#2D2D2D] border-t border-gray-800 flex items-center px-4">
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Conectado</span>
              </div>
              <span>{selectedPort}</span>
              <span>115200 baud</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};