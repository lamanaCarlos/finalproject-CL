/**
 * Configuración JWT
 * Centraliza la configuración de tokens JWT
 */

const { config } = require('./env');

const jwtConfig = {
  secret: config.jwtSecret,
  expiresIn: config.jwtExpire,
  algorithm: 'HS256',
};

/**
 * Opciones para generar tokens
 */
const getTokenOptions = () => {
  return {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm,
  };
};

/**
 * Opciones para verificar tokens
 */
const getVerifyOptions = () => {
  return {
    algorithms: [jwtConfig.algorithm],
  };
};

module.exports = {
  jwtConfig,
  getTokenOptions,
  getVerifyOptions,
};
