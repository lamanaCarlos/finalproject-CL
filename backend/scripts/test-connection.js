/**
 * Script para probar la conexión a MongoDB
 * Ejecutar: node scripts/test-connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Intentando conectar a MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI?.replace(/:[^:@]+@/, ':****@')); // Ocultar contraseña en logs
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Conexión exitosa a MongoDB Atlas!');
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Colecciones existentes:');
    if (collections.length === 0) {
      console.log('   (ninguna - base de datos vacía)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Prueba de conexión completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Verifica que la contraseña en .env sea correcta');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Verifica tu conexión a internet');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Verifica que tu IP esté en la lista de acceso de MongoDB Atlas');
    }
    
    process.exit(1);
  }
}

testConnection();
