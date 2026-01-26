/**
 * Controlador de Subida de Archivos
 * Maneja la subida de imágenes para obras y perfiles
 */

const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Subir una imagen
 * POST /api/upload/image
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo',
      });
    }

    // Construir URL de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${imageUrl}`;

    logger.info(`Imagen subida: ${req.file.filename} por usuario ${req.user?.id || 'anónimo'}`);

    res.status(200).json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fullUrl,
        path: imageUrl,
      },
    });
  } catch (error) {
    logger.error('Error al subir imagen:', error);
    next(error);
  }
};

/**
 * Subir múltiples imágenes
 * POST /api/upload/images
 */
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron archivos',
      });
    }

    const uploadedImages = req.files.map((file) => {
      const imageUrl = `/uploads/${file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${imageUrl}`;
      return {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fullUrl,
        path: imageUrl,
      };
    });

    logger.info(`${req.files.length} imágenes subidas por usuario ${req.user?.id || 'anónimo'}`);

    res.status(200).json({
      success: true,
      message: `${req.files.length} imagen(es) subida(s) exitosamente`,
      data: uploadedImages,
    });
  } catch (error) {
    logger.error('Error al subir imágenes:', error);
    next(error);
  }
};

/**
 * Eliminar imagen
 * DELETE /api/upload/:filename
 */
const deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado',
      });
    }

    // Eliminar archivo
    fs.unlinkSync(filePath);

    logger.info(`Imagen eliminada: ${filename} por usuario ${req.user?.id || 'anónimo'}`);

    res.status(200).json({
      success: true,
      message: 'Imagen eliminada exitosamente',
    });
  } catch (error) {
    logger.error('Error al eliminar imagen:', error);
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  deleteImage,
};
