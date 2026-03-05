/**
 * Sistema de logging con Winston
 * Configuración de logs para desarrollo y producción
 */

const winston = require('winston');
const { config } = require('../config/env');

// Definir niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato para desarrollo (con colores)
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para producción (JSON)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Determinar formato según entorno
const format = config.nodeEnv === 'production' 
  ? productionFormat 
  : developmentFormat;

// Transports
const transports = [
  // Console transport (siempre activo)
  new winston.transports.Console({
    format,
  }),
];

// En producción, agregar file transport para errores
if (config.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: productionFormat,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: productionFormat,
    })
  );
}

// Crear logger
const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
  // No salir del proceso en caso de error
  exitOnError: false,
});

module.exports = logger;
