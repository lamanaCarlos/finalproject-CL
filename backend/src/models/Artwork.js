/**
 * Modelo Artwork - Obras de arte
 * 
 * Representa las obras de arte (físicas y digitales) publicadas por los artistas.
 * Soporta multi-idioma y diferentes tipos de obras.
 */

const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArtistProfile',
      required: [true, 'El ID del artista es requerido'],
      index: true, // Índice para búsquedas por artista
    },
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'La descripción no puede exceder 5000 caracteres'],
      default: '',
    },
    type: {
      type: String,
      enum: {
        values: ['digital', 'physical'],
        message: 'El tipo debe ser: digital o physical'
      },
      required: [true, 'El tipo de obra es requerido'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
      validate: {
        validator: function (v) {
          // Precio debe tener máximo 2 decimales
          return v === Math.round(v * 100) / 100;
        },
        message: 'El precio no puede tener más de 2 decimales',
      },
      index: true, // Índice para búsquedas por rango de precio
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          // Máximo 10 imágenes por obra
          return v.length <= 10;
        },
        message: 'No se pueden agregar más de 10 imágenes',
      },
    },
    technique: {
      type: String,
      trim: true,
      maxlength: [200, 'La técnica no puede exceder 200 caracteres'],
      default: '',
    },
    // Campos específicos para obras físicas
    dimensions: {
      type: String,
      trim: true,
      maxlength: [100, 'Las dimensiones no pueden exceder 100 caracteres'],
      default: '',
      // Ejemplo: "30x40 cm" o "12x16 inches"
    },
    weight: {
      type: Number,
      min: [0, 'El peso no puede ser negativo'],
      default: null, // null para obras digitales
      // Peso en kilogramos
    },
    // Campos específicos para obras digitales
    digitalFormat: {
      type: String,
      trim: true,
      maxlength: [50, 'El formato digital no puede exceder 50 caracteres'],
      default: '',
      // Ejemplo: "JPG", "PNG", "PDF", "MP4"
    },
    resolution: {
      type: String,
      trim: true,
      default: '',
      // Ejemplo: "3000x2000px", "4K"
    },
    language: {
      type: String,
      enum: {
        values: ['es', 'en'],
        message: 'El idioma debe ser: es o en'
      },
      default: 'es',
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'sold'],
        message: 'El estado debe ser: draft, published o sold'
      },
      default: 'draft',
      index: true,
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
    collection: 'artworks',
  }
);

// Índices compuestos para consultas frecuentes de la galería
artworkSchema.index({ status: 1, type: 1, language: 1 });
artworkSchema.index({ status: 1, price: 1 }); // Para ordenar por precio
artworkSchema.index({ artistId: 1, status: 1 }); // Obras de un artista
artworkSchema.index({ createdAt: -1 }); // Obras más recientes

// Índice de texto para búsqueda full-text
artworkSchema.index({ 
  title: 'text', 
  description: 'text', 
  technique: 'text' 
});

// Índice compuesto para búsquedas por rango de precio
artworkSchema.index({ status: 1, price: 1, type: 1 });

// Middleware pre-save: Validaciones condicionales
artworkSchema.pre('save', function (next) {
  // Validar campos específicos según el tipo
  if (this.type === 'physical') {
    // Para obras físicas, dimensiones son recomendadas
    if (!this.dimensions) {
      // No es error, solo advertencia
      console.warn('Obra física sin dimensiones especificadas');
    }
  } else if (this.type === 'digital') {
    // Para obras digitales, formato es recomendado
    if (!this.digitalFormat) {
      console.warn('Obra digital sin formato especificado');
    }
  }

  this.updatedAt = Date.now();
  next();
});

// Método de instancia: Verificar si está publicada
artworkSchema.methods.isPublished = function () {
  return this.status === 'published';
};

// Método de instancia: Verificar si está vendida
artworkSchema.methods.isSold = function () {
  return this.status === 'sold';
};

// Método de instancia: Marcar como vendida
artworkSchema.methods.markAsSold = function () {
  this.status = 'sold';
  return this.save();
};

// Virtual: Obtener URL de imagen principal
artworkSchema.virtual('mainImage').get(function () {
  return this.images && this.images.length > 0 
    ? this.images[0] 
    : null;
});

// Virtual: Obtener URLs completas de imágenes
artworkSchema.virtual('imageUrls').get(function () {
  if (!this.images || this.images.length === 0) return [];
  const cdnUrl = process.env.CDN_URL || '';
  return this.images.map(img => 
    img.startsWith('http') ? img : `${cdnUrl}/${img}`
  );
});

artworkSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
