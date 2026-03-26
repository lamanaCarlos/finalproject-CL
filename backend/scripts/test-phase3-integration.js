/**
 * Pruebas de integración Fase 3 (sin pasarela de pago real).
 *
 * Ejecutar con backend corriendo:
 *   node scripts/test-phase3-integration.js
 *
 * Cubre:
 * - Notificaciones: listado, contador, marcado como leído.
 * - Reseñas: creación con compra verificada y bloqueo de duplicados.
 * - Certificados: acceso por pedido (si existe en DB).
 */

require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Order, Certificate, Review, User } = require('../src/models');

const BASE_URL = 'http://localhost:4000';

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
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function login(email, password) {
  const response = await makeRequest('POST', '/api/auth/login', { email, password });
  if (response.status !== 200 || !response.body?.data?.token) {
    throw new Error(`No se pudo hacer login con ${email}`);
  }
  return response.body.data.token;
}

async function ensureTestOrderForBuyer(buyerEmail) {
  const buyer = await User.findOne({ email: buyerEmail });
  if (!buyer) throw new Error('Buyer de pruebas no encontrado');

  let order = await Order.findOne({ buyerId: buyer._id }).sort({ createdAt: -1 });
  if (!order) throw new Error('No hay pedidos para el buyer de pruebas');

  order.paymentStatus = 'payment_succeeded';
  order.paymentConfirmedAt = new Date();
  await order.save();

  const existingCertificate = await Certificate.findOne({ orderId: order._id });
  if (!existingCertificate) {
    await Certificate.create({
      orderId: order._id,
      artworkId: order.artworkId,
      artistId: order.artistId,
      buyerId: order.buyerId,
      type: 'authenticity',
      terms: 'Certificado de pruebas de integración',
      version: 1,
    });
  }

  return order;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    log('\n🧪 Iniciando pruebas de integración Fase 3...\n', 'cyan');

    const buyerEmail = 'maria.garcia@email.com';
    const buyerPassword = 'Password123!';
    const artistEmail = 'sofia.artista@email.com';
    const artistPassword = 'Password123!';

    log('1) Login buyer/artist', 'yellow');
    const buyerToken = await login(buyerEmail, buyerPassword);
    const artistToken = await login(artistEmail, artistPassword);
    log('   ✅ Login OK', 'green');

    log('2) Preparar pedido de prueba (payment_succeeded + certificate)', 'yellow');
    const testOrder = await ensureTestOrderForBuyer(buyerEmail);
    log(`   ✅ Pedido preparado: ${testOrder._id}`, 'green');

    log('3) Reseña: crear y bloquear duplicado', 'yellow');
    await Review.deleteMany({ orderId: testOrder._id, buyerId: testOrder.buyerId });
    const createReview = await makeRequest(
      'POST',
      '/api/reviews',
      { orderId: String(testOrder._id), rating: 5, comment: 'Prueba integración Fase 3' },
      buyerToken
    );
    if (createReview.status !== 201) {
      throw new Error(`Crear reseña falló: ${createReview.status}`);
    }
    const duplicateReview = await makeRequest(
      'POST',
      '/api/reviews',
      { orderId: String(testOrder._id), rating: 4, comment: 'Duplicada' },
      buyerToken
    );
    if (duplicateReview.status !== 409) {
      throw new Error(`Duplicado reseña no bloqueado: ${duplicateReview.status}`);
    }
    log('   ✅ Reseñas OK', 'green');

    log('4) Certificado: acceso buyer por order', 'yellow');
    const certResponse = await makeRequest(
      'GET',
      `/api/certificates/order/${testOrder._id}`,
      null,
      buyerToken
    );
    if (certResponse.status !== 200) {
      throw new Error(`Certificado no accesible: ${certResponse.status}`);
    }
    log('   ✅ Certificado OK', 'green');

    log('5) Notificaciones: generar por actualización de envío y marcar leída', 'yellow');
    const orderForArtist = await Order.findOne({ artistId: (await User.findOne({ email: artistEmail }))._id, shippingRequired: true });
    if (orderForArtist) {
      await makeRequest(
        'PATCH',
        `/api/orders/${orderForArtist._id}/shipping`,
        { shippingStatus: 'agreed', shippingInfo: { shippingMethod: 'Test Carrier' } },
        artistToken
      );
    }

    const unreadBefore = await makeRequest('GET', '/api/notifications/unread-count', null, buyerToken);
    if (unreadBefore.status !== 200) {
      throw new Error(`Unread-count falló: ${unreadBefore.status}`);
    }

    const notifications = await makeRequest('GET', '/api/notifications', null, buyerToken);
    if (notifications.status !== 200 || !Array.isArray(notifications.body?.data)) {
      throw new Error(`Listado notificaciones falló: ${notifications.status}`);
    }

    const firstUnread = notifications.body.data.find((n) => !n.isRead);
    if (firstUnread) {
      const markRead = await makeRequest(
        'PATCH',
        `/api/notifications/${firstUnread._id}/read`,
        {},
        buyerToken
      );
      if (markRead.status !== 200) {
        throw new Error(`Marcar leída falló: ${markRead.status}`);
      }
    }

    log('   ✅ Notificaciones OK', 'green');

    log('\n✅ Pruebas de integración Fase 3 completadas\n', 'green');
  } catch (error) {
    log(`\n❌ Fallo en pruebas Fase 3: ${error.message}\n`, 'red');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();

