/**
 * Modelo User - Usuarios del sistema
 * 
 * Representa a todos los usuarios: compradores, artistas y administradores.
 * Un usuario puede tener múltiples roles (comprador y artista simultáneamente).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un email válido'
      ],
      index: true, // Índice para búsquedas rápidas
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No devolver password por defecto en consultas
    },
    role: {
      type: String,
      enum: {
        values: ['buyer', 'artist', 'admin'],
        message: 'El rol debe ser: buyer, artist o admin'
      },
      default: 'buyer',
      index: true, // Índice para filtros por rol
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // Índice para filtrar usuarios activos
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // No se puede modificar después de creado
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Usamos campos manuales para mayor control
    collection: 'users', // Nombre explícito de la colección
  }
);

// Índice compuesto para consultas frecuentes
userSchema.index({ role: 1, isActive: 1 });

// Middleware pre-save: Hash de password antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear si el password fue modificado
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash con salt rounds = 12 (balance entre seguridad y rendimiento)
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware pre-save: Actualizar updatedAt
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Método de instancia: Comparar password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método de instancia: Obtener datos públicos (sin password)
userSchema.methods.toPublicJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual: Verificar si es artista
userSchema.virtual('isArtist').get(function () {
  return this.role === 'artist' || this.role === 'admin';
});

// Virtual: Verificar si es administrador
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

// Configurar virtuals en JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
