/**
 * Script de prueba para verificar los endpoints de upload
 * Ejecutar: node src/scripts/testUpload.js
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { Readable } = require('stream');

const API_BASE_URL = 'http://localhost:4000/api';

// Credenciales de prueba (artista)
const TEST_EMAIL = 'sofia.artista@email.com';
const TEST_PASSWORD = 'Password123!';

let authToken = '';

async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      authToken = data.data.token;
      console.log('✅ Login exitoso');
      return true;
    }
    throw new Error('No se recibió token');
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    return false;
  }
}

async function testUploadImage() {
  try {
    console.log('\n📤 Probando subida de imagen...');

    // Crear una imagen de prueba simple (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, '../../test-image.png');
    
    // Si no existe, crear una imagen de prueba mínima
    if (!fs.existsSync(testImagePath)) {
      // Crear un PNG mínimo (1x1 pixel transparente)
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
        0x00, 0x00, 0x00, 0x0d, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
        0x1f, 0x15, 0xc4, 0x89, // CRC
        0x00, 0x00, 0x00, 0x0a, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // compressed data
        0x0d, 0x0a, 0x2d, 0xae, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4e, 0x44, // IEND
        0xae, 0x42, 0x60, 0x82, // CRC
      ]);
      fs.writeFileSync(testImagePath, pngBuffer);
      console.log('📝 Imagen de prueba creada');
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png',
    });

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Imagen subida exitosamente');
      console.log('   URL:', data.data.url);
      console.log('   Filename:', data.data.filename);
      return data.data;
    }
    throw new Error('Respuesta no exitosa');
  } catch (error) {
    console.error('❌ Error al subir imagen:', error.message);
    return null;
  }
}

async function testGetUploadedImage(imageData) {
  if (!imageData) return;

  try {
    console.log('\n📥 Probando acceso a imagen subida...');
    const imageUrl = imageData.url.replace('http://localhost:4000', '');
    const response = await fetch(`http://localhost:4000${imageUrl}`);

    if (response.status === 200) {
      const arrayBuffer = await response.arrayBuffer();
      console.log('✅ Imagen accesible correctamente');
      console.log('   Tamaño:', arrayBuffer.byteLength, 'bytes');
    }
  } catch (error) {
    console.error('❌ Error al acceder a imagen:', error.message);
  }
}

async function testDeleteImage(imageData) {
  if (!imageData) return;

  try {
    console.log('\n🗑️  Probando eliminación de imagen...');
    const response = await fetch(
      `${API_BASE_URL}/upload/${imageData.filename}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log('✅ Imagen eliminada exitosamente');
    }
  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Iniciando pruebas de endpoints de upload...\n');

  // 1. Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('❌ No se pudo iniciar sesión. Abortando pruebas.');
    process.exit(1);
  }

  // 2. Test upload
  const imageData = await testUploadImage();

  // 3. Test get image
  await testGetUploadedImage(imageData);

  // 4. Test delete image
  await testDeleteImage(imageData);

  console.log('\n✅ Pruebas completadas');
}

// Ejecutar pruebas
runTests().catch((error) => {
  console.error('❌ Error en pruebas:', error);
  process.exit(1);
});
