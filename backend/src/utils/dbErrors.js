/**
 * Utilidades para manejo de errores de base de datos
 * Proporciona funciones para manejar y formatear errores de MongoDB/Mongoose
 */

/**
 * Maneja errores de validación de Mongoose
 * @param {Error} error - Error de Mongoose
 * @returns {Object} - Objeto con mensaje de error formateado
 */
const handleValidationError = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
    }));
    
    return {
      statusCode: 400,
      message: 'Error de validación',
      errors,
    };
  }
  return null;
};

/**
 * Maneja errores de duplicado (índices únicos)
 * @param {Error} error - Error de MongoDB
 * @returns {Object} - Objeto con mensaje de error formateado
 */
const handleDuplicateKeyError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      statusCode: 409,
      message: `${field} ya está en uso`,
      field,
    };
  }
  return null;
};

/**
 * Maneja errores de cast (ObjectId inválido, etc.)
 * @param {Error} error - Error de Mongoose
 * @returns {Object} - Objeto con mensaje de error formateado
 */
const handleCastError = (error) => {
  if (error.name === 'CastError') {
    return {
      statusCode: 400,
      message: `ID inválido: ${error.path}`,
      field: error.path,
    };
  }
  return null;
};

/**
 * Maneja errores de base de datos de forma genérica
 * @param {Error} error - Error de base de datos
 * @returns {Object} - Objeto con mensaje de error formateado
 */
const handleDatabaseError = (error) => {
  // Intentar manejar errores específicos
  const validationError = handleValidationError(error);
  if (validationError) return validationError;

  const duplicateError = handleDuplicateKeyError(error);
  if (duplicateError) return duplicateError;

  const castError = handleCastError(error);
  if (castError) return castError;

  // Error genérico de base de datos
  return {
    statusCode: 500,
    message: 'Error de base de datos',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  };
};

/**
 * Formatea errores para respuesta HTTP
 * @param {Error} error - Error a formatear
 * @returns {Object} - Objeto formateado para respuesta
 */
const formatDatabaseError = (error) => {
  const formatted = handleDatabaseError(error);
  
  return {
    success: false,
    ...formatted,
  };
};

module.exports = {
  handleValidationError,
  handleDuplicateKeyError,
  handleCastError,
  handleDatabaseError,
  formatDatabaseError,
};
