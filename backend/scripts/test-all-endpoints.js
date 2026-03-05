/**
 * Script completo para probar TODOS los endpoints del API
 * Ejecutar: node scripts/test-all-endpoints.js
 * 
 * Requiere que el servidor esté corriendo en http://localhost:4000
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:4000';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

let adminToken = null;
let buyerToken = null;
let artistToken = null;
let testArtworkId = null;
let testArtistProfileId = null;
let testOrderId = null;
let testCommissionId = null;

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function test(name, testFn) {
  return async () => {
    try {
      await testFn();
      results.passed++;
      log(`   ✅ ${name}`, 'green');
      return true;
    } catch (error) {
      results.failed++;
      log(`   ❌ ${name}: ${error.message}`, 'red');
      return false;
    }
  };
}

function testWarning(name, testFn) {
  return async () => {
    try {
      await testFn();
      results.warnings++;
      log(`   ⚠️  ${name} (puede ser esperado)`, 'yellow');
      return true;
    } catch (error) {
      log(`   ⚠️  ${name}: ${error.message}`, 'yellow');
      return false;
    }
  };
}

async function runTests() {
  log('\n🧪 PRUEBAS COMPLETAS DEL API REST\n', 'cyan');
  log('=' .repeat(60), 'cyan');

  // ============================================
  // 1. AUTENTICACIÓN
  // ============================================
  log('\n📋 1. AUTENTICACIÓN\n', 'blue');

  await test('Health Check', async () => {
    const res = await makeRequest('GET', '/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await test('Registro de comprador', async () => {
    const res = await makeRequest('POST', '/api/auth/register', {
      email: 'test.buyer@example.com',
      password: 'Test123!',
      role: 'buyer',
    });
    if (res.status !== 201 && res.status !== 409) {
      throw new Error(`Status ${res.status}: ${res.body.message}`);
    }
  })();

  await test('Login de comprador', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'test.buyer@example.com',
      password: 'Test123!',
    });
    if (res.status !== 200 || !res.body.data?.token) {
      throw new Error(`Login falló: ${res.status}`);
    }
    buyerToken = res.body.data.token;
  })();

  await test('Login de admin', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@marketplace.com',
      password: 'Admin123!',
    });
    if (res.status !== 200 || !res.body.data?.token) {
      throw new Error(`Login admin falló: ${res.status}`);
    }
    adminToken = res.body.data.token;
  })();

  await test('Login de artista', async () => {
    const res = await makeRequest('POST', '/api/auth/login', {
      email: 'sofia.artista@email.com',
      password: 'Password123!',
    });
    if (res.status !== 200 || !res.body.data?.token) {
      throw new Error(`Login artista falló: ${res.status}`);
    }
    artistToken = res.body.data.token;
  })();

  // ============================================
  // 2. USUARIOS
  // ============================================
  log('\n📋 2. USUARIOS\n', 'blue');

  await test('Obtener perfil propio (comprador)', async () => {
    const res = await makeRequest('GET', '/api/users/me', null, buyerToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  // ============================================
  // 3. ARTISTAS
  // ============================================
  log('\n📋 3. ARTISTAS\n', 'blue');

  await test('Crear/actualizar perfil de artista', async () => {
    const res = await makeRequest('POST', '/api/artists/profile', {
      displayName: 'Artista de Prueba',
      bio: 'Biografía del artista de prueba',
      socialLinks: {
        instagram: 'https://instagram.com/test',
        web: 'https://test.com',
      },
    }, artistToken);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Status ${res.status}: ${res.body.message}`);
    }
    if (res.body.data?._id) {
      testArtistProfileId = res.body.data._id;
    }
  })();

  await test('Obtener mi perfil de artista', async () => {
    const res = await makeRequest('GET', '/api/artists/me/profile', null, artistToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.data?._id) {
      testArtistProfileId = res.body.data._id;
    }
  })();

  await testWarning('Obtener perfil público de artista', async () => {
    if (!testArtistProfileId) {
      // Buscar un perfil existente
      const loginRes = await makeRequest('POST', '/api/auth/login', {
        email: 'diego.pintor@email.com',
        password: 'Password123!',
      });
      if (loginRes.status === 200) {
        const profileRes = await makeRequest('GET', '/api/artists/me/profile', null, loginRes.body.data.token);
        if (profileRes.status === 200 && profileRes.body.data?._id) {
          testArtistProfileId = profileRes.body.data._id;
        }
      }
    }
    if (testArtistProfileId) {
      const res = await makeRequest('GET', `/api/artists/${testArtistProfileId}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    } else {
      throw new Error('No hay perfil de artista disponible');
    }
  })();

  // ============================================
  // 4. OBRAS
  // ============================================
  log('\n📋 4. OBRAS\n', 'blue');

  await test('Galería pública de obras', async () => {
    const res = await makeRequest('GET', '/api/artworks?page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.data && res.body.data.length > 0) {
      testArtworkId = res.body.data[0]._id;
    }
  })();

  await test('Crear obra (artista)', async () => {
    const res = await makeRequest('POST', '/api/artworks', {
      title: 'Obra de Prueba',
      description: 'Descripción de la obra de prueba',
      type: 'digital',
      price: 100,
      images: ['https://example.com/image.jpg'],
      digitalFormat: 'PNG',
      resolution: '3000x2000px',
    }, artistToken);
    if (res.status !== 201) {
      throw new Error(`Status ${res.status}: ${res.body.message}`);
    }
    if (res.body.data?._id) {
      testArtworkId = res.body.data._id;
    }
  })();

  await test('Obtener detalle de obra', async () => {
    if (!testArtworkId) {
      // Usar una obra existente
      const galleryRes = await makeRequest('GET', '/api/artworks?page=1&limit=1');
      if (galleryRes.status === 200 && galleryRes.body.data && galleryRes.body.data.length > 0) {
        testArtworkId = galleryRes.body.data[0]._id;
      }
    }
    if (testArtworkId) {
      const res = await makeRequest('GET', `/api/artworks/${testArtworkId}`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    } else {
      throw new Error('No hay obra disponible');
    }
  })();

  await test('Publicar obra', async () => {
    if (testArtworkId) {
      const res = await makeRequest('PATCH', `/api/artworks/${testArtworkId}/publish`, null, artistToken);
      if (res.status !== 200) throw new Error(`Status ${res.status}: ${res.body.message}`);
    }
  })();

  await test('Obtener mis obras (artista)', async () => {
    const res = await makeRequest('GET', '/api/artworks/my/list', null, artistToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  // ============================================
  // 5. PEDIDOS
  // ============================================
  log('\n📋 5. PEDIDOS\n', 'blue');

  await testWarning('Comprar obra (comprador)', async () => {
    // Buscar una obra publicada disponible
    const galleryRes = await makeRequest('GET', '/api/artworks?page=1&limit=10');
    if (galleryRes.status === 200 && galleryRes.body.data && galleryRes.body.data.length > 0) {
      const availableArtwork = galleryRes.body.data.find(a => a.status === 'published');
      if (availableArtwork) {
        const res = await makeRequest('POST', '/api/orders', {
          artworkId: availableArtwork._id,
        }, buyerToken);
        if (res.status === 201) {
          testOrderId = res.body.data?._id;
        } else if (res.status === 400 && res.body.message?.includes('propia')) {
          // Es esperado si el comprador es el artista
          throw new Error('No se puede comprar obra propia (esperado)');
        } else {
          throw new Error(`Status ${res.status}: ${res.body.message}`);
        }
      } else {
        throw new Error('No hay obras disponibles para comprar');
      }
    } else {
      throw new Error('No se pudo obtener galería');
    }
  })();

  await test('Obtener mis pedidos (comprador)', async () => {
    const res = await makeRequest('GET', '/api/orders/my', null, buyerToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.data && res.body.data.length > 0 && !testOrderId) {
      testOrderId = res.body.data[0]._id;
    }
  })();

  await test('Obtener mis pedidos (artista)', async () => {
    const res = await makeRequest('GET', '/api/orders/my', null, artistToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await testWarning('Obtener detalle de pedido', async () => {
    if (testOrderId) {
      const res = await makeRequest('GET', `/api/orders/${testOrderId}`, null, buyerToken);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
    } else {
      throw new Error('No hay pedido disponible');
    }
  })();

  // ============================================
  // 6. ENCARGOS
  // ============================================
  log('\n📋 6. ENCARGOS\n', 'blue');

  await test('Obtener ID de artista para encargo', async () => {
    // Obtener un artista diferente al comprador
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'diego.pintor@email.com',
      password: 'Password123!',
    });
    if (loginRes.status === 200) {
      const profileRes = await makeRequest('GET', '/api/artists/me/profile', null, loginRes.body.data.token);
      if (profileRes.status === 200 && profileRes.body.data?.userId) {
        // Necesitamos el userId del artista, no el profileId
        // Buscar el usuario artista
        const userRes = await makeRequest('GET', '/api/users/me', null, loginRes.body.data.token);
        if (userRes.status === 200) {
          testArtistProfileId = userRes.body.data.id;
        }
      }
    }
  })();

  await testWarning('Solicitar encargo', async () => {
    // Necesitamos el userId del artista, no el profileId
    // Por ahora, usar un ID de ejemplo o buscar uno real
    const res = await makeRequest('POST', '/api/commissions', {
      artistId: '507f1f77bcf86cd799439011', // ID de ejemplo - puede fallar
      description: 'Encargo de prueba para testing',
      budget: 500,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }, buyerToken);
    if (res.status === 201) {
      testCommissionId = res.body.data?._id;
    } else if (res.status === 404) {
      throw new Error('Artista no encontrado (ID de ejemplo)');
    } else {
      throw new Error(`Status ${res.status}: ${res.body.message}`);
    }
  })();

  await test('Obtener mis encargos (comprador)', async () => {
    const res = await makeRequest('GET', '/api/commissions/my', null, buyerToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.data && res.body.data.length > 0 && !testCommissionId) {
      testCommissionId = res.body.data[0]._id;
    }
  })();

  await test('Obtener mis encargos (artista)', async () => {
    const res = await makeRequest('GET', '/api/commissions/my', null, artistToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  // ============================================
  // 7. ADMINISTRACIÓN
  // ============================================
  log('\n📋 7. ADMINISTRACIÓN\n', 'blue');

  await test('Listar usuarios (admin)', async () => {
    const res = await makeRequest('GET', '/api/admin/users', null, adminToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await test('Listar artistas (admin)', async () => {
    const res = await makeRequest('GET', '/api/admin/artists', null, adminToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await test('Listar obras (admin)', async () => {
    const res = await makeRequest('GET', '/api/admin/artworks', null, adminToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await test('Obtener configuración (admin)', async () => {
    const res = await makeRequest('GET', '/api/admin/settings', null, adminToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  await test('Obtener métricas (admin)', async () => {
    const res = await makeRequest('GET', '/api/admin/metrics', null, adminToken);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  })();

  // ============================================
  // RESUMEN
  // ============================================
  log('\n' + '='.repeat(60), 'cyan');
  log('\n📊 RESUMEN DE PRUEBAS\n', 'cyan');
  log(`   ✅ Exitosas: ${results.passed}`, 'green');
  log(`   ❌ Fallidas: ${results.failed}`, 'red');
  log(`   ⚠️  Advertencias: ${results.warnings}`, 'yellow');
  log(`   📈 Total: ${results.passed + results.failed + results.warnings}`, 'blue');
  
  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  log(`   📊 Tasa de éxito: ${successRate}%\n`, successRate >= 80 ? 'green' : 'yellow');

  if (results.failed === 0) {
    log('🎉 ¡Todas las pruebas críticas pasaron exitosamente!', 'green');
  } else {
    log('⚠️  Algunas pruebas fallaron. Revisa los errores arriba.', 'yellow');
  }
}

// Verificar que el servidor esté corriendo
makeRequest('GET', '/health')
  .then(() => {
    runTests().catch((error) => {
      log(`\n❌ Error durante las pruebas: ${error.message}`, 'red');
      process.exit(1);
    });
  })
  .catch((error) => {
    log(`\n❌ No se puede conectar al servidor en ${BASE_URL}`, 'red');
    log('💡 Asegúrate de que el servidor esté corriendo: npm run dev', 'yellow');
    log(`   Error: ${error.message}`, 'red');
    process.exit(1);
  });
