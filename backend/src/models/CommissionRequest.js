/**
 * Modelo CommissionRequest - Encargos Personalizados
 * 
 * Representa las solicitudes de encargos personalizados de compradores a artistas.
 * Permite negociación y seguimiento del estado del encargo.
 */

const mongoose = require('mongoose');

const commissionRequestSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del comprador es requerido'],
      index: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del artista es requerido'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'La descripción del encargo es requerida'],
      trim: true,
      maxlength: [5000, 'La descripción no puede exceder 5000 caracteres'],
    },
    budget: {
      type: Number,
      required: [true, 'El presupuesto es requerido'],
      min: [0, 'El presupuesto no puede ser negativo'],
      validate: {
        validator: function (v) {
          return v === Math.round(v * 100) / 100;
        },
        message: 'El presupuesto no puede tener más de 2 decimales',
      },
    },
    // Presupuesto acordado (puede diferir del inicial)
    agreedPrice: {
      type: Number,
      min: [0, 'El precio acordado no puede ser negativo'],
      default: null,
      validate: {
        validator: function (v) {
          return !v || v === Math.round(v * 100) / 100;
        },
        message: 'El precio acordado no puede tener más de 2 decimales',
      },
    },
    deadline: {
      type: Date,
      validate: {
        validator: function (v) {
          // Deadline debe ser una fecha futura
          return !v || v > new Date();
        },
        message: 'La fecha límite debe ser una fecha futura',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
        message: 'El estado debe ser: pending, accepted, rejected, in_progress, completed o cancelled'
      },
      default: 'pending',
      index: true,
    },
    // Mensajes de negociación entre comprador y artista
    messages: [{
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
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
    collection: 'commissionrequests',
  }
);

// Índices compuestos para consultas frecuentes
commissionRequestSchema.index({ artistId: 1, status: 1 }); // Encargos pendientes por artista
commissionRequestSchema.index({ buyerId: 1, status: 1 }); // Encargos del comprador
commissionRequestSchema.index({ artistId: 1, createdAt: -1 }); // Encargos recientes del artista
commissionRequestSchema.index({ status: 1, createdAt: -1 }); // Encargos por estado

// Middleware pre-save: Actualizar updatedAt
commissionRequestSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Método de instancia: Aceptar encargo
commissionRequestSchema.methods.accept = function (agreedPrice = null) {
  this.status = 'accepted';
  if (agreedPrice !== null) {
    this.agreedPrice = agreedPrice;
  } else {
    this.agreedPrice = this.budget;
  }
  return this.save();
};

// Método de instancia: Rechazar encargo
commissionRequestSchema.methods.reject = function () {
  this.status = 'rejected';
  return this.save();
};

// Método de instancia: Iniciar trabajo
commissionRequestSchema.methods.startWork = function () {
  if (this.status !== 'accepted') {
    throw new Error('Solo se puede iniciar trabajo en encargos aceptados');
  }
  this.status = 'in_progress';
  return this.save();
};

// Método de instancia: Completar encargo
commissionRequestSchema.methods.complete = function () {
  if (this.status !== 'in_progress') {
    throw new Error('Solo se puede completar un encargo en progreso');
  }
  this.status = 'completed';
  return this.save();
};

// Método de instancia: Cancelar encargo
commissionRequestSchema.methods.cancel = function () {
  if (['completed', 'rejected'].includes(this.status)) {
    throw new Error('No se puede cancelar un encargo completado o rechazado');
  }
  this.status = 'cancelled';
  return this.save();
};

// Método de instancia: Agregar mensaje
commissionRequestSchema.methods.addMessage = function (senderId, message) {
  this.messages.push({
    senderId,
    message,
    createdAt: new Date(),
  });
  return this.save();
};

// Virtual: Verificar si está pendiente
commissionRequestSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

// Virtual: Verificar si está activo (no completado, rechazado o cancelado)
commissionRequestSchema.virtual('isActive').get(function () {
  return !['completed', 'rejected', 'cancelled'].includes(this.status);
});

// Virtual: Obtener precio final (acordado o presupuesto inicial)
commissionRequestSchema.virtual('finalPrice').get(function () {
  return this.agreedPrice || this.budget;
});

commissionRequestSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const CommissionRequest = mongoose.model('CommissionRequest', commissionRequestSchema);

module.exports = CommissionRequest;
