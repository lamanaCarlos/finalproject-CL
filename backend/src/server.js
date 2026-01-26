/**
 * Punto de entrada de la aplicación
 * Maneja la conexión a la base de datos y el inicio del servidor
 */

const { config } = require('./config/env');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const app = require('./app');

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Manejo de promesas rechazadas no capturadas
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Iniciar servidor
 */
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor HTTP
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Servidor iniciado en puerto ${config.port}`);
      logger.info(`📝 Entorno: ${config.nodeEnv}`);
      logger.info(`🌐 Health check: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} recibido. Cerrando servidor...`);
      
      server.close(() => {
        logger.info('Servidor HTTP cerrado');
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('Forzando cierre del servidor...');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();
