/**
 * Exportación centralizada de todos los modelos
 * Facilita la importación de modelos en otras partes de la aplicación
 */

const User = require('./User');
const ArtistProfile = require('./ArtistProfile');
const Artwork = require('./Artwork');
const Order = require('./Order');
const CommissionRequest = require('./CommissionRequest');
const PlatformSettings = require('./PlatformSettings');

module.exports = {
  User,
  ArtistProfile,
  Artwork,
  Order,
  CommissionRequest,
  PlatformSettings,
};
