/**
 * Configuración de conexión a MongoDB
 * Maneja la conexión a la base de datos con manejo de errores y reconexión automática
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketplace-arte';
    
    const options = {
      maxPoolSize: 10, // Mantener hasta 10 conexiones socket
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar servidor
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
    };

    await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB conectado exitosamente');

    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión a MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado. Intentando reconectar...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconectado');
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB conexión cerrada por terminación de aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
