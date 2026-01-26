/**
 * Pipelines de agregación para dashboard de administrador
 * Consultas complejas para métricas y estadísticas globales
 */

const mongoose = require('mongoose');

/**
 * Pipeline para obtener métricas globales de la plataforma
 * @returns {Array} - Pipeline de agregación
 */
const getPlatformMetricsPipeline = () => {
  return [
    // Estadísticas de usuarios
    {
      $facet: {
        users: [
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],
        activeUsers: [
          {
            $match: { isActive: true },
          },
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];
};

/**
 * Pipeline para obtener estadísticas de obras
 * @returns {Array} - Pipeline de agregación
 */
const getArtworkMetricsPipeline = () => {
  return [
    {
      $group: {
        _id: null,
        totalArtworks: { $sum: 1 },
        publishedArtworks: {
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
        },
        soldArtworks: {
          $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] },
        },
        draftArtworks: {
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] },
        },
        digitalArtworks: {
          $sum: { $cond: [{ $eq: ['$type', 'digital'] }, 1, 0] },
        },
        physicalArtworks: {
          $sum: { $cond: [{ $eq: ['$type', 'physical'] }, 1, 0] },
        },
        totalValue: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
  ];
};

/**
 * Pipeline para obtener estadísticas de ventas
 * @param {Object} options - Opciones: { startDate, endDate }
 * @returns {Array} - Pipeline de agregación
 */
const getSalesMetricsPipeline = (options = {}) => {
  const { startDate, endDate } = options;

  const matchStage = {};

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
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$price' },
        totalCommissions: { $sum: '$commission' },
        totalArtistEarnings: { $sum: '$artistEarnings' },
        avgOrderValue: { $avg: '$price' },
        ordersWithShipping: {
          $sum: { $cond: ['$shippingRequired', 1, 0] },
        },
      },
    },
  ];
};

/**
 * Pipeline para obtener estadísticas de encargos
 * @returns {Array} - Pipeline de agregación
 */
const getCommissionMetricsPipeline = () => {
  return [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
        totalAgreedPrice: { $sum: { $ifNull: ['$agreedPrice', 0] } },
      },
    },
    {
      $group: {
        _id: null,
        byStatus: {
          $push: {
            status: '$_id',
            count: '$count',
            totalBudget: '$totalBudget',
            totalAgreedPrice: '$totalAgreedPrice',
          },
        },
        totalCommissions: { $sum: '$count' },
        totalBudget: { $sum: '$totalBudget' },
      },
    },
  ];
};

/**
 * Pipeline para obtener artistas más exitosos
 * @param {Object} options - Opciones: { limit, startDate, endDate }
 * @returns {Array} - Pipeline de agregación
 */
const getTopArtistsPipeline = (options = {}) => {
  const { limit = 10, startDate, endDate } = options;

  const matchStage = {};

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
      $group: {
        _id: '$artistId',
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: '$price' },
        totalEarnings: { $sum: '$artistEarnings' },
      },
    },
    {
      $lookup: {
        from: 'artistprofiles',
        localField: '_id',
        foreignField: '_id',
        as: 'artist',
      },
    },
    {
      $unwind: {
        path: '$artist',
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        'artist.status': 'approved',
      },
    },
    {
      $project: {
        artistId: '$_id',
        displayName: '$artist.displayName',
        profileImage: '$artist.profileImage',
        totalSales: 1,
        totalRevenue: 1,
        totalEarnings: 1,
      },
    },
    {
      $sort: { totalSales: -1, totalRevenue: -1 },
    },
    {
      $limit: limit,
    },
  ];
};

module.exports = {
  getPlatformMetricsPipeline,
  getArtworkMetricsPipeline,
  getSalesMetricsPipeline,
  getCommissionMetricsPipeline,
  getTopArtistsPipeline,
};
