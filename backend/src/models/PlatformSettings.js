/**
 * Modelo PlatformSettings - Configuración Global de la Plataforma
 * 
 * Representa la configuración global del sistema (singleton).
 * Solo debe existir un documento en esta colección.
 */

const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    minimumCommission: {
      type: Number,
      required: [true, 'La comisión mínima es requerida'],
      min: [0, 'La comisión mínima no puede ser negativa'],
      max: [100, 'La comisión mínima no puede exceder 100%'],
      default: 10, // 10% por defecto
      validate: {
        validator: function (v) {
          return v === Math.round(v * 100) / 100;
        },
        message: 'La comisión mínima no puede tener más de 2 decimales',
      },
    },
    supportedLanguages: {
      type: [String],
      required: [true, 'Los idiomas soportados son requeridos'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Debe haber al menos un idioma soportado',
      },
      default: ['es', 'en'],
    },
    // Configuraciones adicionales para futuras expansiones
    features: {
      commissionsEnabled: {
        type: Boolean,
        default: true,
      },
      digitalDownloadsEnabled: {
        type: Boolean,
        default: true,
      },
      physicalShippingEnabled: {
        type: Boolean,
        default: true,
      },
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: false,
    collection: 'platformsettings',
  }
);

// Middleware pre-save: Actualizar updatedAt
platformSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Método estático: Obtener o crear configuración (singleton)
platformSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  if (!settings) {
    // Crear configuración por defecto si no existe
    settings = await this.create({
      minimumCommission: 10,
      supportedLanguages: ['es', 'en'],
    });
  }
  
  return settings;
};

// Método estático: Actualizar configuración
platformSettingsSchema.statics.updateSettings = async function (updates, updatedBy = null) {
  const settings = await this.getSettings();
  
  Object.keys(updates).forEach(key => {
    if (settings.schema.paths[key]) {
      settings[key] = updates[key];
    }
  });
  
  if (updatedBy) {
    settings.updatedBy = updatedBy;
  }
  
  return await settings.save();
};

// Método de instancia: Verificar si un idioma está soportado
platformSettingsSchema.methods.isLanguageSupported = function (language) {
  return this.supportedLanguages.includes(language);
};

// Método de instancia: Agregar idioma soportado
platformSettingsSchema.methods.addSupportedLanguage = function (language) {
  if (!this.supportedLanguages.includes(language)) {
    this.supportedLanguages.push(language);
    return this.save();
  }
  return Promise.resolve(this);
};

// Método de instancia: Remover idioma soportado
platformSettingsSchema.methods.removeSupportedLanguage = function (language) {
  if (this.supportedLanguages.length <= 1) {
    throw new Error('Debe haber al menos un idioma soportado');
  }
  this.supportedLanguages = this.supportedLanguages.filter(lang => lang !== language);
  return this.save();
};

// Virtual: Obtener comisión como decimal (ej: 10 -> 0.10)
platformSettingsSchema.virtual('commissionDecimal').get(function () {
  return this.minimumCommission / 100;
});

platformSettingsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);

module.exports = PlatformSettings;
