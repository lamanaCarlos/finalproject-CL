/**
 * Controlador de Artistas
 * Maneja operaciones relacionadas con perfiles de artistas
 */

const { ArtistProfile, User } = require('../models');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');

/**
 * Crear o actualizar perfil de artista
 * POST /api/artists/profile
 */
const createOrUpdateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { displayName, bio, profileImage, socialLinks } = req.body;

    // Verificar que el usuario tiene rol de artista
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los artistas pueden crear perfiles',
      });
    }

    // Buscar si ya existe un perfil
    let profile = await ArtistProfile.findOne({ userId });

    if (profile) {
      // Actualizar perfil existente
      profile.displayName = displayName;
      if (bio !== undefined) profile.bio = bio;
      if (profileImage !== undefined) profile.profileImage = profileImage;
      if (socialLinks) {
        if (socialLinks.instagram !== undefined) {
          profile.socialLinks.instagram = socialLinks.instagram;
        }
        if (socialLinks.web !== undefined) {
          profile.socialLinks.web = socialLinks.web;
        }
      }

      await profile.save();

      logger.info(`Perfil de artista actualizado: ${userId}`);

      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: profile,
      });
    } else {
      // Crear nuevo perfil
      profile = new ArtistProfile({
        userId,
        displayName,
        bio: bio || '',
        profileImage: profileImage || '',
        socialLinks: {
          instagram: socialLinks?.instagram || '',
          web: socialLinks?.web || '',
        },
        status: 'pending', // Estado inicial: pendiente de aprobación
      });

      await profile.save();

      logger.info(`Nuevo perfil de artista creado: ${userId}`);

      return res.status(201).json({
        success: true,
        message: 'Perfil creado exitosamente',
        data: profile,
      });
    }
  } catch (error) {
    logger.error('Error al crear/actualizar perfil:', error);

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
 * Obtener perfil público de artista
 * GET /api/artists/:id
 */
const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscar perfil por ID
    const profile = await ArtistProfile.findById(id).populate('userId', 'email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de artista no encontrado',
      });
    }

    // Si el usuario es admin, puede ver cualquier perfil
    // Si no es admin, solo puede ver perfiles aprobados
    if (req.user?.role !== 'admin' && profile.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Perfil no disponible',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    logger.error('Error al obtener perfil público:', error);
    next(error);
  }
};

/**
 * Obtener mi perfil de artista
 * GET /api/artists/me/profile
 */
const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verificar que el usuario tiene rol de artista
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los artistas pueden acceder a su perfil',
      });
    }

    const profile = await ArtistProfile.findOne({ userId }).populate('userId', 'email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de artista no encontrado. Crea tu perfil primero.',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    logger.error('Error al obtener mi perfil:', error);
    next(error);
  }
};

module.exports = {
  createOrUpdateProfile,
  getPublicProfile,
  getMyProfile,
};
