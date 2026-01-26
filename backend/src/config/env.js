/**
 * Configuración y validación de variables de entorno
 * Valida que todas las variables requeridas estén presentes
 */

require('dotenv').config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
];

const optionalEnvVars = {
  NODE_ENV: 'development',
  PORT: '4000',
  JWT_EXPIRE: '7d',
  CDN_URL: '',
  ADMIN_EMAIL: 'admin@marketplace.com',
  ADMIN_PASSWORD: 'Admin123!',
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 */
const validateEnv = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missing.join(', '));
    console.error('Por favor, configura estas variables en tu archivo .env');
    process.exit(1);
  }

  // Establecer valores por defecto para variables opcionales
  Object.keys(optionalEnvVars).forEach(key => {
    if (!process.env[key]) {
      process.env[key] = optionalEnvVars[key];
    }
  });
};

/**
 * Obtiene la configuración del entorno
 */
const getEnvConfig = () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    cdnUrl: process.env.CDN_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@marketplace.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'Admin123!',
  };
};

// Validar al cargar el módulo
validateEnv();

module.exports = {
  validateEnv,
  getEnvConfig,
  config: getEnvConfig(),
};
