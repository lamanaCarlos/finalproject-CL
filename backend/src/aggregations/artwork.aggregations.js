/**
 * Pipelines de agregación para consultas de obras
 * Optimiza consultas complejas de la galería y búsquedas
 */

const mongoose = require('mongoose');

/**
 * Pipeline para obtener galería pública con filtros
 * @param {Object} filters - Filtros: { artistId, type, minPrice, maxPrice, language, status }
 * @param {Object} options - Opciones: { page, limit, sortBy }
 * @returns {Array} - Pipeline de agregación
 */
const getPublicGalleryPipeline = (filters = {}, options = {}) => {
  const {
    artistId,
    type,
    minPrice,
    maxPrice,
    language,
    status = 'published', // Solo obras publicadas por defecto
    search,
  } = filters;

  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1,
  } = options;

  const matchStage = {
    status, // Solo obras publicadas
  };

  // Aplicar filtros
  if (artistId && mongoose.Types.ObjectId.isValid(artistId)) {
    matchStage.artistId = new mongoose.Types.ObjectId(artistId);
  }

  if (type && ['digital', 'physical'].includes(type)) {
    matchStage.type = type;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    matchStage.price = {};
    if (minPrice !== undefined) matchStage.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) matchStage.price.$lte = Number(maxPrice);
  }

  if (language && ['es', 'en'].includes(language)) {
    matchStage.language = language;
  }

  // Búsqueda de texto
  if (search && search.trim()) {
    matchStage.$text = { $search: search };
  }

  const pipeline = [
    // Match inicial
    { $match: matchStage },

    // Lookup para obtener información del artista
    {
      $lookup: {
        from: 'artistprofiles',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artist',
      },
    },

    // Unwind del artista (solo obras con artista aprobado)
    {
      $match: {
        'artist.status': 'approved',
      },
    },
    {
      $unwind: {
        path: '$artist',
        preserveNullAndEmptyArrays: false,
      },
    },

    // Proyección de campos necesarios
    {
      $project: {
        title: 1,
        description: 1,
        type: 1,
        price: 1,
        images: 1,
        technique: 1,
        dimensions: 1,
        weight: 1,
        digitalFormat: 1,
        resolution: 1,
        language: 1,
        createdAt: 1,
        'artist._id': 1,
        'artist.displayName': 1,
        'artist.profileImage': 1,
        // Agregar score de búsqueda si hay búsqueda de texto
        ...(search ? { score: { $meta: 'textScore' } } : {}),
      },
    },

    // Ordenar
    {
      $sort: search
        ? { score: { $meta: 'textScore' } }
        : { [sortBy]: sortOrder === 1 ? 1 : -1 },
    },

    // Paginación
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];

  return pipeline;
};

/**
 * Pipeline para obtener estadísticas de obras de un artista
 * @param {string} artistId - ID del artista
 * @returns {Array} - Pipeline de agregación
 */
const getArtistArtworkStatsPipeline = (artistId) => {
  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    throw new Error('ID de artista inválido');
  }

  return [
    {
      $match: {
        artistId: new mongoose.Types.ObjectId(artistId),
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    {
      $group: {
        _id: null,
        stats: {
          $push: {
            status: '$_id',
            count: '$count',
            totalValue: '$totalValue',
            avgPrice: '$avgPrice',
          },
        },
        totalObras: { $sum: '$count' },
        totalValue: { $sum: '$totalValue' },
      },
    },
  ];
};

/**
 * Pipeline para obtener obras más vendidas
 * @param {Object} options - Opciones: { limit, startDate, endDate }
 * @returns {Array} - Pipeline de agregación
 */
const getTopSellingArtworksPipeline = (options = {}) => {
  const { limit = 10, startDate, endDate } = options;

  const matchStage = {
    status: 'sold',
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  return [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'artworkId',
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        artistId: { $first: '$artistId' },
        price: { $first: '$price' },
        images: { $first: '$images' },
        timesSold: { $sum: 1 },
        totalRevenue: { $sum: '$orders.price' },
      },
    },
    {
      $sort: { timesSold: -1, totalRevenue: -1 },
    },
    {
      $limit: limit,
    },
  ];
};

module.exports = {
  getPublicGalleryPipeline,
  getArtistArtworkStatsPipeline,
  getTopSellingArtworksPipeline,
};
