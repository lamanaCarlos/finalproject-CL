/**
 * Controlador de Obras
 * Maneja operaciones relacionadas con obras de arte
 */

const { Artwork, ArtistProfile } = require('../models');
const { getPublicGalleryPipeline } = require('../aggregations/artwork.aggregations');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');

/**
 * Crear nueva obra
 * POST /api/artworks
 */
const createArtwork = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verificar que el usuario tiene rol de artista
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los artistas pueden crear obras',
      });
    }

    // Verificar que el artista tiene perfil aprobado
    const profile = await ArtistProfile.findOne({ userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: 'Debes crear tu perfil de artista primero',
      });
    }

    if (profile.status !== 'approved' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Tu perfil de artista debe estar aprobado para crear obras',
      });
    }

    // Crear obra
    const artwork = new Artwork({
      artistId: profile._id,
      ...req.body,
      status: 'draft', // Estado inicial: borrador
    });

    await artwork.save();

    logger.info(`Obra creada: ${artwork._id} por artista ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Obra creada exitosamente',
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al crear obra:', error);

    const dbError = formatDatabaseError(error);
    if (dbError.statusCode) {
      return res.status(dbError.statusCode).json({
        success: false,
        ...dbError,
      });
    }

    next(error);
  }
};

/**
 * Obtener galería pública de obras
 * GET /api/artworks
 */
const getPublicGallery = async (req, res, next) => {
  try {
    const {
      artistId,
      type,
      minPrice,
      maxPrice,
      language,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = '-1',
    } = req.query;

    // Convertir sortOrder
    const sortOrderNum = sortOrder === '1' || sortOrder === 'asc' ? 1 : -1;

    // Construir pipeline de agregación
    const pipeline = getPublicGalleryPipeline(
      {
        artistId,
        type,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        language,
        search,
        status: 'published',
      },
      {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        sortOrder: sortOrderNum,
      }
    );

    // Ejecutar agregación
    const artworks = await Artwork.aggregate(pipeline);

    // Contar total (sin paginación)
    const countPipeline = getPublicGalleryPipeline(
      {
        artistId,
        type,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        language,
        search,
        status: 'published',
      },
      {}
    ).filter(stage => stage.$skip === undefined && stage.$limit === undefined);

    countPipeline.push({ $count: 'total' });
    const countResult = await Artwork.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: artworks,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    logger.error('Error al obtener galería:', error);
    next(error);
  }
};

/**
 * Obtener detalle de obra
 * GET /api/artworks/:id
 */
const getArtworkDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const artwork = await Artwork.findById(id).populate({
      path: 'artistId',
      select: 'displayName profileImage status userId',
      populate: {
        path: 'userId',
        select: '_id'
      }
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    // Verificar permisos
    // Si la obra está publicada, cualquiera puede verla
    // Si está en borrador o vendida, solo el artista dueño o admin puede verla
    if (artwork.status !== 'published') {
      const artistUserId = artwork.artistId?.userId?._id?.toString() || artwork.artistId?.userId?.toString();
      if (!req.user || (req.user.role !== 'admin' && artistUserId !== req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver esta obra',
        });
      }
    }

    // Verificar que el artista está aprobado (si es público)
    if (artwork.status === 'published' && artwork.artistId.status !== 'approved') {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Obra no disponible',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al obtener detalle de obra:', error);
    next(error);
  }
};

/**
 * Actualizar obra
 * PUT /api/artworks/:id
 */
const updateArtwork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const artwork = await Artwork.findById(id).populate('artistId', 'userId');

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    // Verificar propiedad (solo el artista dueño o admin puede actualizar)
    if (artwork.artistId.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta obra',
      });
    }

    // No permitir actualizar si está vendida (excepto admin)
    if (artwork.status === 'sold' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No se puede actualizar una obra vendida',
      });
    }

    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      if (key !== '_id' && key !== 'artistId' && key !== 'createdAt') {
        artwork[key] = req.body[key];
      }
    });

    await artwork.save();

    logger.info(`Obra actualizada: ${id} por usuario ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Obra actualizada exitosamente',
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al actualizar obra:', error);

    const dbError = formatDatabaseError(error);
    if (dbError.statusCode) {
      return res.status(dbError.statusCode).json({
        success: false,
        ...dbError,
      });
    }

    next(error);
  }
};

/**
 * Publicar obra
 * PATCH /api/artworks/:id/publish
 */
const publishArtwork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const artwork = await Artwork.findById(id).populate('artistId', 'userId status');

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    // Verificar propiedad
    if (artwork.artistId.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para publicar esta obra',
      });
    }

    // Verificar que el artista está aprobado
    if (artwork.artistId.status !== 'approved' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Tu perfil de artista debe estar aprobado para publicar obras',
      });
    }

    // No permitir publicar si está vendida
    if (artwork.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'No se puede publicar una obra vendida',
      });
    }

    artwork.status = 'published';
    await artwork.save();

    logger.info(`Obra publicada: ${id} por usuario ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Obra publicada exitosamente',
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al publicar obra:', error);
    next(error);
  }
};

/**
 * Despublicar obra
 * PATCH /api/artworks/:id/unpublish
 */
const unpublishArtwork = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const artwork = await Artwork.findById(id).populate('artistId', 'userId');

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    // Verificar propiedad
    if (artwork.artistId.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para despublicar esta obra',
      });
    }

    // No permitir despublicar si está vendida
    if (artwork.status === 'sold') {
      return res.status(400).json({
        success: false,
        message: 'No se puede despublicar una obra vendida',
      });
    }

    artwork.status = 'draft';
    await artwork.save();

    logger.info(`Obra despublicada: ${id} por usuario ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Obra despublicada exitosamente',
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al despublicar obra:', error);
    next(error);
  }
};

/**
 * Obtener mis obras (artista)
 * GET /api/artworks/my/list
 */
const getMyArtworks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verificar que el usuario tiene rol de artista
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los artistas pueden ver sus obras',
      });
    }

    // Obtener perfil del artista
    const profile = await ArtistProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de artista no encontrado',
      });
    }

    // Parámetros de paginación
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const status = req.query.status; // Filtro opcional por estado

    // Construir query
    const query = { artistId: profile._id };
    if (status) {
      query.status = status;
    }

    // Obtener obras con paginación
    const artworks = await Artwork.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Artwork.countDocuments(query);

    res.status(200).json({
      success: true,
      data: artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener mis obras:', error);
    next(error);
  }
};

module.exports = {
  createArtwork,
  getPublicGallery,
  getArtworkDetail,
  updateArtwork,
  publishArtwork,
  unpublishArtwork,
  getMyArtworks,
};
