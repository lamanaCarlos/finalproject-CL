/**
 * Configuración de la aplicación Express
 * Centraliza todos los middlewares y rutas
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { config } = require('./config/env');
const logger = require('./utils/logger');

// Importar middlewares de error
const errorMiddleware = require('./middlewares/error.middleware');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const artistRoutes = require('./routes/artist.routes');
const artworkRoutes = require('./routes/artwork.routes');
const orderRoutes = require('./routes/order.routes');
const commissionRoutes = require('./routes/commission.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// ============================================
// MIDDLEWARES DE SEGURIDAD
// ============================================

// Helmet - Headers de seguridad HTTP
app.use(helmet());

// CORS - Configuración de origen cruzado
const corsOptions = {
  origin: config.nodeEnv === 'production' 
    ? process.env.CORS_ORIGIN || '*' 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ============================================
// MIDDLEWARES DE PARSING
// ============================================

// Body parser para JSON
app.use(express.json({ limit: '10mb' }));

// Body parser para URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// MIDDLEWARES DE OPTIMIZACIÓN
// ============================================

// Compression - Comprimir respuestas
app.use(compression());

// ============================================
// MIDDLEWARES DE LOGGING
// ============================================

// Morgan - Logging HTTP
const morganFormat = config.nodeEnv === 'production' 
  ? 'combined' 
  : 'dev';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// ============================================
// RATE LIMITING
// ============================================

// Rate limiter general (100 requests por 15 minutos)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', generalLimiter);

// Rate limiter para autenticación se aplica en las rutas específicas

// ============================================
// RUTAS
// ============================================

// Ruta de salud (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Marketplace de Arte - API REST',
    version: '1.0.0',
    documentation: '/api',
  });
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Servir archivos estáticos de uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Middleware de manejo de errores
app.use(errorMiddleware);

// ============================================
// EXPORTAR APP
// ============================================

module.exports = app;
