import React from "react";
import { motion } from "framer-motion";

interface TemperatureGaugeProps {
  value: number;
  size?: number; // Tamaño configurable
}

export const TemperatureGauge: React.FC<TemperatureGaugeProps> = ({
  value,
  size = 100, // Valor por defecto
}) => {
  // Limitar valor entre -20 y 60
  const clampedValue = Math.min(Math.max(value, -20), 60);
  
  // Calcular porcentaje con 1 decimal
  const percentage = parseFloat((((clampedValue + 20) / 80) * 100).toFixed(1));

  // Función para cambiar color según temperatura
  const getColor = (temp: number) => {
    if (temp < 0) return "#3B82F6"; // Azul frío
    if (temp < 30) return "#FACC15"; // Amarillo templado
    return "#EF4444"; // Rojo caliente
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {/* Círculo de fondo */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            className="dark:stroke-gray-700"
          />
          {/* Círculo animado */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor(clampedValue)}
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * percentage) / 100}
          />
        </svg>
      </div>
      {/* Mostrar temperatura con 1 decimal */}
      <p className="mt-2 text-lg font-semibold">{clampedValue.toFixed(1)}°C</p>
    </div>
  );
};
