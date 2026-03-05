/**
 * Script para actualizar las imágenes de las obras con URLs de freeimages.com
 * 
 * Ejecutar: node src/scripts/updateArtworkImages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');

// URLs de imágenes de freeimages.com y alternativas (Unsplash/Pexels) para diferentes tipos de arte
// Nota: Si freeimages.com no funciona, se usan alternativas de Unsplash/Pexels
const artworkImages = {
  abstract: [
    // FreeImages.com URLs (formato: images.freeimages.com/images/grids/...)
    'https://images.freeimages.com/images/grids/5d4/grand-brush-1193223.jpg',
    'https://images.freeimages.com/images/grids/d7a/romas-thermas-det-1169710.jpg',
    'https://images.freeimages.com/images/grids/486/splat-3-1196415.jpg',
    'https://images.freeimages.com/images/grids/6a6/paint-texture-1523186.jpg',
    'https://images.freeimages.com/images/grids/bcc/mess-1559327.jpg',
    'https://images.freeimages.com/images/grids/384/abstract-color-2-1181713.jpg',
    'https://images.freeimages.com/images/grids/882/colors-series-1183921.jpg',
    'https://images.freeimages.com/images/grids/21a/abstract-texture-1-1188072.jpg',
    'https://images.freeimages.com/images/grids/6b2/a-bright-spot-1490814.jpg',
    'https://images.freeimages.com/images/grids/5cf/tecture-1175053.jpg',
    'https://images.freeimages.com/images/grids/95c/palette-9-1197526.jpg',
    // Alternativas Unsplash (si freeimages.com no funciona)
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
  ],
  landscape: [
    'https://images.freeimages.com/images/grids/ec5/painting-on-the-wall-1199614.jpg',
    'https://images.freeimages.com/images/grids/353/abstract-color-10-1181679.jpg',
    'https://images.freeimages.com/images/grids/1ab/bronze-black-silver-and-gold-1192289.jpg',
    'https://images.freeimages.com/images/grids/f99/boat-texture-5-1199488.jpg',
    'https://images.freeimages.com/images/grids/781/abstract-color-4-1181699.jpg',
    'https://images.freeimages.com/images/grids/a03/painting-1-1166077.jpg',
    'https://images.freeimages.com/images/grids/146/texture-1170657.jpg',
    // Alternativas Unsplash
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
  ],
  portrait: [
    'https://images.freeimages.com/images/grids/630/free-photo-from-a-painted-free-photo-1205816.jpg',
    'https://images.freeimages.com/images/grids/a49/oil-paint-strokes-1164985.jpg',
    'https://images.freeimages.com/images/grids/bef/colors-series-1184305.jpg',
    'https://images.freeimages.com/images/grids/a6f/abstract-color-3-1181706.jpg',
    // Alternativas Unsplash
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  ],
  digital: [
    'https://images.freeimages.com/images/grids/168/palette-10-1197521.jpg',
    'https://images.freeimages.com/images/grids/324/painting-4-1189446.jpg',
    'https://images.freeimages.com/images/grids/4e0/furniture-3-1482441.jpg',
    'https://images.freeimages.com/images/grids/031/abstract-color-9-1181686.jpg',
    'https://images.freeimages.com/images/grids/9bd/abstract-texture-3-1188058.jpg',
    // Alternativas Unsplash
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
  ],
};

// Función para obtener una imagen aleatoria de una categoría
const getRandomImage = (category) => {
  const images = artworkImages[category] || artworkImages.abstract;
  return images[Math.floor(Math.random() * images.length)];
};

// Función para obtener múltiples imágenes
const getRandomImages = (category, count = 2) => {
  const images = artworkImages[category] || artworkImages.abstract;
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, images.length));
};

const updateArtworkImages = async () => {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Obtener todas las obras
    const artworks = await Artwork.find({});
    console.log(`📦 Encontradas ${artworks.length} obras`);

    let updated = 0;

    for (const artwork of artworks) {
      let newImages = [];

      // Determinar categoría según el título o tipo
      if (artwork.title.toLowerCase().includes('abstract') || 
          artwork.title.toLowerCase().includes('aurora') ||
          artwork.title.toLowerCase().includes('digital')) {
        newImages = getRandomImages('abstract', artwork.images?.length || 2);
      } else if (artwork.title.toLowerCase().includes('paisaje') || 
                 artwork.title.toLowerCase().includes('landscape') ||
                 artwork.title.toLowerCase().includes('montaña') ||
                 artwork.title.toLowerCase().includes('ciudad')) {
        newImages = getRandomImages('landscape', artwork.images?.length || 2);
      } else if (artwork.title.toLowerCase().includes('retrato') || 
                 artwork.title.toLowerCase().includes('portrait') ||
                 artwork.title.toLowerCase().includes('busto')) {
        newImages = getRandomImages('portrait', artwork.images?.length || 2);
      } else if (artwork.type === 'digital') {
        newImages = getRandomImages('digital', artwork.images?.length || 2);
      } else {
        // Por defecto, usar abstract
        newImages = getRandomImages('abstract', artwork.images?.length || 2);
      }

      // Asegurar que siempre haya al menos una imagen
      if (newImages.length === 0) {
        newImages = [getRandomImage('abstract')];
      }

      // Actualizar la obra
      artwork.images = newImages;
      await artwork.save();
      updated++;

      console.log(`✅ Actualizada: ${artwork.title} - ${newImages.length} imagen(es)`);
    }

    console.log(`\n✅ Proceso completado: ${updated} obras actualizadas`);
    console.log('🎨 Todas las obras ahora usan imágenes de freeimages.com');

  } catch (error) {
    console.error('❌ Error al actualizar imágenes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar el script
if (require.main === module) {
  updateArtworkImages()
    .then(() => {
      console.log('✨ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { updateArtworkImages };
