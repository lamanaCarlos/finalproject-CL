/**
 * Validadores reutilizables para el sistema
 * Funciones de validación que pueden usarse en múltiples contextos
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de URL
 * @param {string} url - URL a validar
 * @returns {boolean} - true si es válido
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida que un precio sea válido (positivo, máximo 2 decimales)
 * @param {number} price - Precio a validar
 * @returns {boolean} - true si es válido
 */
const isValidPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return false;
  if (price < 0) return false;
  // Verificar que tenga máximo 2 decimales
  return price === Math.round(price * 100) / 100;
};

/**
 * Valida que un porcentaje sea válido (0-100)
 * @param {number} percentage - Porcentaje a validar
 * @returns {boolean} - true si es válido
 */
const isValidPercentage = (percentage) => {
  if (typeof percentage !== 'number' || isNaN(percentage)) return false;
  return percentage >= 0 && percentage <= 100;
};

/**
 * Valida formato de ObjectId de MongoDB
 * @param {string} id - ID a validar
 * @returns {boolean} - true si es válido
 */
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Valida que un array de ObjectIds sea válido
 * @param {Array} ids - Array de IDs a validar
 * @returns {boolean} - true si todos son válidos
 */
const isValidObjectIdArray = (ids) => {
  if (!Array.isArray(ids)) return false;
  return ids.every(id => isValidObjectId(id));
};

/**
 * Sanitiza string (elimina espacios, caracteres especiales peligrosos)
 * @param {string} str - String a sanitizar
 * @returns {string} - String sanitizado
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Valida que una fecha sea futura
 * @param {Date} date - Fecha a validar
 * @returns {boolean} - true si es futura
 */
const isFutureDate = (date) => {
  if (!(date instanceof Date)) return false;
  return date > new Date();
};

/**
 * Valida que un idioma esté soportado
 * @param {string} language - Idioma a validar
 * @param {Array} supportedLanguages - Array de idiomas soportados
 * @returns {boolean} - true si está soportado
 */
const isValidLanguage = (language, supportedLanguages = ['es', 'en']) => {
  return supportedLanguages.includes(language);
};

module.exports = {
  isValidEmail,
  isValidUrl,
  isValidPrice,
  isValidPercentage,
  isValidObjectId,
  isValidObjectIdArray,
  sanitizeString,
  isFutureDate,
  isValidLanguage,
};
