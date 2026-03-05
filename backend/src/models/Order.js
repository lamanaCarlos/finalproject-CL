/**
 * Modelo Order - Pedidos/Ventas
 * 
 * Representa las transacciones de compra de obras.
 * Incluye información de comisiones y gestión de envíos para obras físicas.
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del comprador es requerido'],
      index: true,
    },
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: [true, 'El ID de la obra es requerido'],
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del artista es requerido'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
      validate: {
        validator: function (v) {
          return v === Math.round(v * 100) / 100;
        },
        message: 'El precio no puede tener más de 2 decimales',
      },
    },
    commission: {
      type: Number,
      required: [true, 'La comisión es requerida'],
      min: [0, 'La comisión no puede ser negativa'],
      validate: {
        validator: function (v) {
          return v === Math.round(v * 100) / 100;
        },
        message: 'La comisión no puede tener más de 2 decimales',
      },
    },
    // Precio final que recibe el artista (precio - comisión)
    artistEarnings: {
      type: Number,
      required: true,
      min: [0, 'Las ganancias del artista no pueden ser negativas'],
      validate: {
        validator: function (v) {
          return v === Math.round(v * 100) / 100;
        },
        message: 'Las ganancias no pueden tener más de 2 decimales',
      },
    },
    shippingRequired: {
      type: Boolean,
      default: false,
      index: true,
    },
    shippingStatus: {
      type: String,
      enum: {
        values: ['pending', 'agreed', 'sent'],
        message: 'El estado de envío debe ser: pending, agreed o sent'
      },
      default: 'pending',
      index: true,
    },
    // Información adicional del envío (opcional)
    shippingInfo: {
      address: {
        type: String,
        trim: true,
        default: '',
      },
      trackingNumber: {
        type: String,
        trim: true,
        default: '',
      },
      shippingMethod: {
        type: String,
        trim: true,
        default: '',
      },
      shippingCost: {
        type: Number,
        min: [0, 'El costo de envío no puede ser negativo'],
        default: 0,
      },
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
    collection: 'orders',
  }
);

// Índices compuestos para consultas frecuentes
orderSchema.index({ buyerId: 1, createdAt: -1 }); // Historial de compras
orderSchema.index({ artistId: 1, createdAt: -1 }); // Ventas del artista
orderSchema.index({ artworkId: 1 }); // Órdenes de una obra específica
orderSchema.index({ shippingStatus: 1, shippingRequired: 1 }); // Envíos pendientes

// Middleware pre-save: Calcular ganancias del artista
orderSchema.pre('save', function (next) {
  // Calcular ganancias del artista (precio - comisión)
  if (this.isNew || this.isModified('price') || this.isModified('commission')) {
    this.artistEarnings = Math.round((this.price - this.commission) * 100) / 100;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Método estático: Crear orden con cálculo automático de comisión
orderSchema.statics.createOrder = async function (orderData, commissionPercentage) {
  const { price } = orderData;
  
  // Calcular comisión
  const commission = Math.round((price * commissionPercentage / 100) * 100) / 100;
  const artistEarnings = Math.round((price - commission) * 100) / 100;
  
  const order = new this({
    ...orderData,
    commission,
    artistEarnings,
  });
  
  return await order.save();
};

// Método de instancia: Verificar si requiere envío
orderSchema.methods.requiresShipping = function () {
  return this.shippingRequired;
};

// Método de instancia: Actualizar estado de envío
orderSchema.methods.updateShippingStatus = function (status, shippingInfo = {}) {
  this.shippingStatus = status;
  if (shippingInfo.address) this.shippingInfo.address = shippingInfo.address;
  if (shippingInfo.trackingNumber) this.shippingInfo.trackingNumber = shippingInfo.trackingNumber;
  if (shippingInfo.shippingMethod) this.shippingInfo.shippingMethod = shippingInfo.shippingMethod;
  if (shippingInfo.shippingCost !== undefined) this.shippingInfo.shippingCost = shippingInfo.shippingCost;
  return this.save();
};

// Virtual: Verificar si el envío está acordado
orderSchema.virtual('isShippingAgreed').get(function () {
  return this.shippingStatus === 'agreed' || this.shippingStatus === 'sent';
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
