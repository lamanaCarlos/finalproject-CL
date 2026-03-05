/**
 * Script para probar endpoints del API
 * Ejecutar: node scripts/test-endpoints.js
 * 
 * Requiere que el servidor esté corriendo en http://localhost:4000
 */

const http = require('http');

const BASE_URL = 'http://localhost:4000';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
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

async function testEndpoints() {
  log('\n🧪 Iniciando pruebas de endpoints...\n', 'cyan');

  let adminToken = null;
  let buyerToken = null;
  let artistToken = null;

  try {
    // 1. Health Check
    log('1. Probando Health Check...', 'yellow');
    const health = await makeRequest('GET', '/health');
    if (health.status === 200) {
      log('   ✅ Health check OK', 'green');
    } else {
      log(`   ❌ Health check falló: ${health.status}`, 'red');
    }

    // 2. Registro de usuario comprador
    log('\n2. Probando registro de comprador...', 'yellow');
    const registerBuyer = await makeRequest('POST', '/api/auth/register', {
      email: 'test.buyer@example.com',
      password: 'Test123!',
      role: 'buyer',
    });
    if (registerBuyer.status === 201) {
      log('   ✅ Registro exitoso', 'green');
    } else {
      log(`   ⚠️  Registro: ${registerBuyer.status} - ${registerBuyer.body.message || 'Usuario puede que ya exista'}`, 'yellow');
    }

    // 3. Login de comprador
    log('\n3. Probando login de comprador...', 'yellow');
    const loginBuyer = await makeRequest('POST', '/api/auth/login', {
      email: 'test.buyer@example.com',
      password: 'Test123!',
    });
    if (loginBuyer.status === 200 && loginBuyer.body.data?.token) {
      buyerToken = loginBuyer.body.data.token;
      log('   ✅ Login exitoso', 'green');
    } else {
      log(`   ❌ Login falló: ${loginBuyer.status}`, 'red');
      log(`   Respuesta: ${JSON.stringify(loginBuyer.body)}`, 'red');
    }

    // 4. Obtener perfil propio
    if (buyerToken) {
      log('\n4. Probando obtener perfil propio...', 'yellow');
      const profile = await makeRequest('GET', '/api/users/me', null, buyerToken);
      if (profile.status === 200) {
        log('   ✅ Perfil obtenido correctamente', 'green');
      } else {
        log(`   ❌ Error: ${profile.status}`, 'red');
      }
    }

    // 5. Login de admin (usando datos del seed)
    log('\n5. Probando login de admin...', 'yellow');
    const loginAdmin = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@marketplace.com',
      password: 'Admin123!',
    });
    if (loginAdmin.status === 200 && loginAdmin.body.data?.token) {
      adminToken = loginAdmin.body.data.token;
      log('   ✅ Login admin exitoso', 'green');
    } else {
      log(`   ⚠️  Login admin: ${loginAdmin.status} - Puede que necesites ejecutar npm run seed primero`, 'yellow');
    }

    // 6. Galería pública de obras
    log('\n6. Probando galería pública de obras...', 'yellow');
    const gallery = await makeRequest('GET', '/api/artworks?page=1&limit=10');
    if (gallery.status === 200) {
      log(`   ✅ Galería obtenida: ${gallery.body.data?.length || 0} obras`, 'green');
    } else {
      log(`   ⚠️  Galería: ${gallery.status} - Puede que no haya obras aún`, 'yellow');
    }

    // 7. Métricas de admin (si hay token)
    if (adminToken) {
      log('\n7. Probando métricas de admin...', 'yellow');
      const metrics = await makeRequest('GET', '/api/admin/metrics', null, adminToken);
      if (metrics.status === 200) {
        log('   ✅ Métricas obtenidas correctamente', 'green');
      } else {
        log(`   ❌ Error: ${metrics.status}`, 'red');
      }
    }

    log('\n✅ Pruebas completadas!\n', 'green');
    log('📝 Resumen:', 'cyan');
    log(`   - Health Check: ${health.status === 200 ? 'OK' : 'FALLÓ'}`, health.status === 200 ? 'green' : 'red');
    log(`   - Autenticación: ${buyerToken ? 'OK' : 'FALLÓ'}`, buyerToken ? 'green' : 'red');
    log(`   - Endpoints probados: 7`, 'cyan');

  } catch (error) {
    log(`\n❌ Error durante las pruebas: ${error.message}`, 'red');
    log('💡 Asegúrate de que el servidor esté corriendo (npm run dev)', 'yellow');
    process.exit(1);
  }
}

// Verificar que el servidor esté corriendo
makeRequest('GET', '/health')
  .then(() => {
    testEndpoints();
  })
  .catch((error) => {
    log(`\n❌ No se puede conectar al servidor en ${BASE_URL}`, 'red');
    log('💡 Asegúrate de que el servidor esté corriendo: npm run dev', 'yellow');
    log(`   Error: ${error.message}`, 'red');
    process.exit(1);
  });
