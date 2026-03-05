/**
 * Modelo ArtistProfile - Perfil público de artista
 * 
 * Representa el perfil artístico público de un usuario artista.
 * Relación 1:1 con User (un usuario puede tener un solo perfil de artista).
 */

const mongoose = require('mongoose');

const artistProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID de usuario es requerido'],
      unique: true, // Un usuario solo puede tener un perfil de artista
      index: true,
    },
    displayName: {
      type: String,
      required: [true, 'El nombre artístico es requerido'],
      trim: true,
      maxlength: [100, 'El nombre artístico no puede exceder 100 caracteres'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, 'La biografía no puede exceder 2000 caracteres'],
      default: '',
    },
    profileImage: {
      type: String,
      trim: true,
      default: '', // URL de la imagen de perfil
    },
    socialLinks: {
      instagram: {
        type: String,
        trim: true,
        default: '',
        validate: {
          validator: function (v) {
            // Validar URL de Instagram si se proporciona
            return !v || /^https?:\/\/(www\.)?instagram\.com\/[\w.]+/.test(v);
          },
          message: 'URL de Instagram inválida',
        },
      },
      web: {
        type: String,
        trim: true,
        default: '',
        validate: {
          validator: function (v) {
            // Validar URL si se proporciona
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: 'URL de sitio web inválida',
        },
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'blocked'],
        message: 'El estado debe ser: pending, approved o blocked'
      },
      default: 'pending',
      index: true, // Índice para filtrar por estado
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: 'artistprofiles',
  }
);

// Índice compuesto para consultas de moderación
artistProfileSchema.index({ status: 1, createdAt: -1 });

// Índice de texto para búsqueda de nombres artísticos
artistProfileSchema.index({ displayName: 'text', bio: 'text' });

// Middleware pre-save: Actualizar updatedAt
artistProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Método de instancia: Verificar si está aprobado
artistProfileSchema.methods.isApproved = function () {
  return this.status === 'approved';
};

// Método de instancia: Verificar si está bloqueado
artistProfileSchema.methods.isBlocked = function () {
  return this.status === 'blocked';
};

// Virtual: Obtener URL completa de imagen de perfil
artistProfileSchema.virtual('profileImageUrl').get(function () {
  if (!this.profileImage) return null;
  // Si es una URL completa, devolverla; si no, construirla
  return this.profileImage.startsWith('http') 
    ? this.profileImage 
    : `${process.env.CDN_URL || ''}/${this.profileImage}`;
});

artistProfileSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ArtistProfile = mongoose.model('ArtistProfile', artistProfileSchema);

module.exports = ArtistProfile;
