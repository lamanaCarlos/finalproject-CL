/**
 * Pipelines de agregación para consultas de artistas
 * Optimiza consultas complejas relacionadas con artistas
 */

const mongoose = require('mongoose');

/**
 * Pipeline para obtener perfil completo de artista con estadísticas
 * @param {string} artistId - ID del artista
 * @returns {Array} - Pipeline de agregación
 */
const getArtistProfileWithStatsPipeline = (artistId) => {
  if (!mongoose.Types.ObjectId.isValid(artistId)) {
    throw new Error('ID de artista inválido');
  }

  return [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(artistId),
        status: 'approved', // Solo artistas aprobados
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        'user.isActive': true,
      },
    },
    // Estadísticas de obras
    {
      $lookup: {
        from: 'artworks',
        localField: '_id',
        foreignField: 'artistId',
        as: 'artworks',
      },
    },
    {
      $addFields: {
        totalArtworks: { $size: '$artworks' },
        publishedArtworks: {
          $size: {
            $filter: {
              input: '$artworks',
              as: 'artwork',
              cond: { $eq: ['$$artwork.status', 'published'] },
            },
          },
        },
        soldArtworks: {
          $size: {
            $filter: {
              input: '$artworks',
              as: 'artwork',
              cond: { $eq: ['$$artwork.status', 'sold'] },
            },
          },
        },
      },
    },
    // Estadísticas de ventas
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'artistId',
        as: 'orders',
      },
    },
    {
      $addFields: {
        totalSales: { $size: '$orders' },
        totalRevenue: { $sum: '$orders.price' },
        totalEarnings: { $sum: '$orders.artistEarnings' },
        totalCommissions: { $sum: '$orders.commission' },
      },
    },
    // Proyección final
    {
      $project: {
        displayName: 1,
        bio: 1,
        profileImage: 1,
        socialLinks: 1,
        createdAt: 1,
        totalArtworks: 1,
        publishedArtworks: 1,
        soldArtworks: 1,
        totalSales: 1,
        totalRevenue: 1,
        totalEarnings: 1,
        totalCommissions: 1,
        'user.email': 1,
      },
    },
  ];
};

/**
 * Pipeline para obtener lista de artistas con estadísticas básicas
 * @param {Object} filters - Filtros: { status, search }
 * @param {Object} options - Opciones: { page, limit, sortBy }
 * @returns {Array} - Pipeline de agregación
 */
const getArtistsListPipeline = (filters = {}, options = {}) => {
  const { status = 'approved', search } = filters;
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = -1 } = options;

  const matchStage = { status };

  if (search) {
    matchStage.$text = { $search: search };
  }

  return [
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $match: {
        'user.isActive': true,
      },
    },
    {
      $lookup: {
        from: 'artworks',
        localField: '_id',
        foreignField: 'artistId',
        as: 'artworks',
      },
    },
    {
      $addFields: {
        publishedArtworks: {
          $size: {
            $filter: {
              input: '$artworks',
              as: 'artwork',
              cond: { $eq: ['$$artwork.status', 'published'] },
            },
          },
        },
      },
    },
    {
      $project: {
        displayName: 1,
        bio: 1,
        profileImage: 1,
        socialLinks: 1,
        publishedArtworks: 1,
        createdAt: 1,
        ...(search ? { score: { $meta: 'textScore' } } : {}),
      },
    },
    {
      $sort: search
        ? { score: { $meta: 'textScore' } }
        : { [sortBy]: sortOrder === 1 ? 1 : -1 },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];
};

module.exports = {
  getArtistProfileWithStatsPipeline,
  getArtistsListPipeline,
};
