/**
 * Script de inicialización de la base de datos
 * Crea datos iniciales necesarios para el funcionamiento del sistema
 * Incluye datos de ejemplo para pruebas y desarrollo
 */

require('dotenv').config();
const connectDB = require('../config/database');
const {
  User,
  ArtistProfile,
  Artwork,
  Order,
  CommissionRequest,
  PlatformSettings,
} = require('../models');

/**
 * Limpia la base de datos (opcional, solo para desarrollo)
 */
const clearDatabase = async () => {
  try {
    await CommissionRequest.deleteMany({});
    await Order.deleteMany({});
    await Artwork.deleteMany({});
    await ArtistProfile.deleteMany({});
    await User.deleteMany({});
    await PlatformSettings.deleteMany({});
    console.log('🗑️  Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error.message);
    throw error;
  }
};

/**
 * Crea el usuario administrador inicial
 */
const createAdminUser = async () => {
  try {
    let admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      console.log('✅ Usuario administrador ya existe');
      return admin;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@marketplace.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Usuario administrador creado:', admin.email);
    return admin;
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    throw error;
  }
};

/**
 * Crea la configuración inicial de la plataforma
 */
const createPlatformSettings = async () => {
  try {
    const settings = await PlatformSettings.getSettings();
    console.log('✅ Configuración de plataforma inicializada');
    return settings;
  } catch (error) {
    console.error('❌ Error al crear configuración de plataforma:', error.message);
    throw error;
  }
};

/**
 * Crea usuarios de ejemplo (compradores y artistas)
 */
const createSampleUsers = async () => {
  try {
    const users = [];

    // Compradores
    const buyers = [
      {
        email: 'maria.garcia@email.com',
        password: 'Password123!',
        role: 'buyer',
      },
      {
        email: 'juan.rodriguez@email.com',
        password: 'Password123!',
        role: 'buyer',
      },
      {
        email: 'ana.martinez@email.com',
        password: 'Password123!',
        role: 'buyer',
      },
      {
        email: 'carlos.lopez@email.com',
        password: 'Password123!',
        role: 'buyer',
      },
    ];

    // Artistas
    const artists = [
      {
        email: 'sofia.artista@email.com',
        password: 'Password123!',
        role: 'artist',
      },
      {
        email: 'diego.pintor@email.com',
        password: 'Password123!',
        role: 'artist',
      },
      {
        email: 'laura.creativa@email.com',
        password: 'Password123!',
        role: 'artist',
      },
      {
        email: 'miguel.art@email.com',
        password: 'Password123!',
        role: 'artist',
      },
      {
        email: 'elena.diseno@email.com',
        password: 'Password123!',
        role: 'artist',
      },
    ];

    // Crear compradores
    for (const buyerData of buyers) {
      let user = await User.findOne({ email: buyerData.email });
      if (!user) {
        user = await User.create(buyerData);
        users.push(user);
      } else {
        users.push(user);
      }
    }

    // Crear artistas
    for (const artistData of artists) {
      let user = await User.findOne({ email: artistData.email });
      if (!user) {
        user = await User.create(artistData);
        users.push(user);
      } else {
        users.push(user);
      }
    }

    console.log(`✅ ${users.length} usuarios de ejemplo creados/verificados`);
    return users;
  } catch (error) {
    console.error('❌ Error al crear usuarios de ejemplo:', error.message);
    throw error;
  }
};

/**
 * Crea perfiles de artistas de ejemplo
 */
const createArtistProfiles = async (artistUsers) => {
  try {
    const profiles = [];

    const profilesData = [
      {
        userId: null, // Se asignará
        displayName: 'Sofía Martínez',
        bio: 'Artista contemporánea especializada en pintura abstracta y arte digital. Mi trabajo explora la relación entre color, forma y emoción.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        socialLinks: {
          instagram: 'https://instagram.com/sofiamartinez',
          web: 'https://sofiamartinez.art',
        },
        status: 'approved',
      },
      {
        userId: null,
        displayName: 'Diego Rivera Art',
        bio: 'Pintor realista con más de 15 años de experiencia. Especializado en retratos y paisajes urbanos. Obras en colecciones privadas internacionales.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        socialLinks: {
          instagram: 'https://instagram.com/diegoriveraart',
          web: 'https://diegorivera.art',
        },
        status: 'approved',
      },
      {
        userId: null,
        displayName: 'Laura Creativa',
        bio: 'Artista digital y diseñadora gráfica. Creo arte NFT y obras digitales únicas. Mi estilo combina elementos surrealistas con diseño moderno.',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        socialLinks: {
          instagram: 'https://instagram.com/lauracreativa',
          web: 'https://lauracreativa.com',
        },
        status: 'approved',
      },
      {
        userId: null,
        displayName: 'Miguel Escultor',
        bio: 'Escultor especializado en bronce y mármol. Mis obras exploran la figura humana y la naturaleza. Exposiciones en galerías de Madrid y Barcelona.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        socialLinks: {
          instagram: 'https://instagram.com/miguelescultor',
          web: 'https://miguelescultor.es',
        },
        status: 'approved',
      },
      {
        userId: null,
        displayName: 'Elena Diseño',
        bio: 'Ilustradora y artista gráfica. Especializada en ilustración editorial y arte conceptual. Trabajo con técnicas tradicionales y digitales.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        socialLinks: {
          instagram: 'https://instagram.com/elenadiseno',
          web: 'https://elenadiseno.com',
        },
        status: 'pending', // Uno pendiente para pruebas de moderación
      },
    ];

    const artistUsersList = artistUsers.filter(u => u.role === 'artist');

    for (let i = 0; i < profilesData.length && i < artistUsersList.length; i++) {
      const profileData = { ...profilesData[i] };
      profileData.userId = artistUsersList[i]._id;

      let profile = await ArtistProfile.findOne({ userId: profileData.userId });
      if (!profile) {
        profile = await ArtistProfile.create(profileData);
        profiles.push(profile);
      } else {
        profiles.push(profile);
      }
    }

    console.log(`✅ ${profiles.length} perfiles de artistas creados/verificados`);
    return profiles;
  } catch (error) {
    console.error('❌ Error al crear perfiles de artistas:', error.message);
    throw error;
  }
};

/**
 * Crea obras de arte de ejemplo
 */
const createArtworks = async (artistProfiles) => {
  try {
    const artworks = [];

    const artworksData = [
      // Obras de Sofía Martínez
      {
        artistId: null,
        title: 'Aurora Abstracta',
        description: 'Pintura abstracta que captura la esencia del amanecer. Técnica mixta sobre lienzo, combinando acrílicos y óleos. Obra única, lista para colgar.',
        type: 'physical',
        price: 450,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
        ],
        technique: 'Acrílico y óleo sobre lienzo',
        dimensions: '60x80 cm',
        weight: 2.5,
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Digital Dreams',
        description: 'Arte digital surrealista. Archivo de alta resolución (3000x4000px) en formato PNG. Incluye licencia de uso personal.',
        type: 'digital',
        price: 120,
        images: [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
        ],
        technique: 'Arte digital, Photoshop',
        digitalFormat: 'PNG',
        resolution: '3000x4000px',
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Noche Estrellada Moderna',
        description: 'Reinterpretación contemporánea del clásico. Pintura al óleo sobre lienzo de algodón. Enmarcado disponible bajo pedido.',
        type: 'physical',
        price: 680,
        images: [
          'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
        ],
        technique: 'Óleo sobre lienzo',
        dimensions: '80x100 cm',
        weight: 3.2,
        language: 'es',
        status: 'draft',
      },
      // Obras de Diego Rivera
      {
        artistId: null,
        title: 'Retrato Urbano',
        description: 'Retrato realista de un músico callejero. Técnica de carboncillo y grafito sobre papel de alta calidad. Firmado y fechado.',
        type: 'physical',
        price: 320,
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        ],
        technique: 'Carboncillo y grafito',
        dimensions: '50x70 cm',
        weight: 0.8,
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Paisaje de Montaña',
        description: 'Paisaje realista de los Pirineos. Pintura al óleo con técnica clásica. Obra única, lista para enmarcar.',
        type: 'physical',
        price: 550,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ],
        technique: 'Óleo sobre lienzo',
        dimensions: '70x90 cm',
        weight: 2.8,
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Ciudad al Atardecer',
        description: 'Vista panorámica de una ciudad al atardecer. Técnica de acuarela sobre papel de algodón. Obra original firmada.',
        type: 'physical',
        price: 280,
        images: [
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
        ],
        technique: 'Acuarela',
        dimensions: '40x60 cm',
        weight: 0.5,
        language: 'es',
        status: 'sold',
      },
      // Obras de Laura Creativa
      {
        artistId: null,
        title: 'NFT Collection: Cosmic Dreams',
        description: 'Serie de 5 obras digitales NFT únicas. Formato PNG 4K. Incluye certificado de autenticidad digital. Licencia comercial incluida.',
        type: 'digital',
        price: 250,
        images: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
        ],
        technique: 'Arte digital, Procreate',
        digitalFormat: 'PNG',
        resolution: '4K (3840x2160px)',
        language: 'en',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Surreal Landscape',
        description: 'Paisaje surrealista digital. Archivo de alta resolución listo para impresión. Formato JPG de máxima calidad.',
        type: 'digital',
        price: 95,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ],
        technique: 'Arte digital, Photoshop',
        digitalFormat: 'JPG',
        resolution: '5000x3000px',
        language: 'en',
        status: 'published',
      },
      // Obras de Miguel Escultor
      {
        artistId: null,
        title: 'Busto de Mujer',
        description: 'Escultura en bronce patinado. Altura 35cm. Base de mármol incluida. Obra única, firmada y numerada. Envío especial requerido.',
        type: 'physical',
        price: 1200,
        images: [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
        ],
        technique: 'Bronce patinado',
        dimensions: '35x25x20 cm',
        weight: 8.5,
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Forma Orgánica',
        description: 'Escultura abstracta en mármol de Carrara. Pieza única tallada a mano. Dimensiones: 40x30x25cm. Peso: 12kg.',
        type: 'physical',
        price: 1800,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        ],
        technique: 'Mármol de Carrara',
        dimensions: '40x30x25 cm',
        weight: 12,
        language: 'es',
        status: 'published',
      },
      // Obras de Elena Diseño
      {
        artistId: null,
        title: 'Ilustración Editorial: Naturaleza',
        description: 'Ilustración digital para uso editorial. Formato vectorial SVG y PNG de alta resolución. Licencia comercial incluida.',
        type: 'digital',
        price: 150,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        ],
        technique: 'Ilustración digital, Illustrator',
        digitalFormat: 'SVG, PNG',
        resolution: 'Vectorial + 3000x3000px',
        language: 'es',
        status: 'published',
      },
      {
        artistId: null,
        title: 'Serie de Retratos',
        description: 'Colección de 3 retratos digitales. Estilo realista con toques artísticos. Archivos PNG de alta calidad. Licencia personal.',
        type: 'digital',
        price: 200,
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        ],
        technique: 'Ilustración digital, Procreate',
        digitalFormat: 'PNG',
        resolution: '3000x3000px cada uno',
        language: 'es',
        status: 'draft',
      },
    ];

    // Asignar artistId a cada obra
    let artistIndex = 0;
    for (const artworkData of artworksData) {
      if (!artworkData.artistId) {
        artworkData.artistId = artistProfiles[artistIndex % artistProfiles.length]._id;
        // Avanzar al siguiente artista cada 3 obras aproximadamente
        if (artworks.length > 0 && artworks.length % 3 === 0) {
          artistIndex++;
        }
      }

      let artwork = await Artwork.findOne({
        title: artworkData.title,
        artistId: artworkData.artistId,
      });

      if (!artwork) {
        artwork = await Artwork.create(artworkData);
        artworks.push(artwork);
      } else {
        artworks.push(artwork);
      }
    }

    console.log(`✅ ${artworks.length} obras de arte creadas/verificadas`);
    return artworks;
  } catch (error) {
    console.error('❌ Error al crear obras de arte:', error.message);
    throw error;
  }
};

/**
 * Crea órdenes de ejemplo
 */
const createOrders = async (users, artworks) => {
  try {
    const orders = [];
    const buyers = users.filter(u => u.role === 'buyer');
    const publishedArtworks = artworks.filter(a => a.status === 'published' || a.status === 'sold');
    const soldArtwork = artworks.find(a => a.status === 'sold');

    // Obtener configuración para calcular comisiones
    const settings = await PlatformSettings.getSettings();
    const commissionPercentage = settings.minimumCommission;

    // Crear orden para la obra vendida
    if (soldArtwork && buyers.length > 0) {
      const buyer = buyers[0];
      // Obtener el ArtistProfile y luego el User
      const artistProfile = await ArtistProfile.findById(soldArtwork.artistId);
      const artistUser = artistProfile ? await User.findById(artistProfile.userId) : null;
      
      if (artistUser) {
        const commission = Math.round((soldArtwork.price * commissionPercentage / 100) * 100) / 100;
        const artistEarnings = Math.round((soldArtwork.price - commission) * 100) / 100;

        let order = await Order.findOne({ artworkId: soldArtwork._id });
        if (!order) {
          order = await Order.create({
            buyerId: buyer._id,
            artworkId: soldArtwork._id,
            artistId: artistUser._id,
            price: soldArtwork.price,
            commission,
            artistEarnings,
            shippingRequired: soldArtwork.type === 'physical',
            shippingStatus: soldArtwork.type === 'physical' ? 'agreed' : 'pending',
            shippingInfo: soldArtwork.type === 'physical' ? {
              address: 'Calle Ejemplo 123, Madrid, España',
              shippingMethod: 'Correos Express',
              shippingCost: 15,
            } : {},
          });
          orders.push(order);
        } else {
          orders.push(order);
        }
      }
    }

    // Crear algunas órdenes adicionales de ejemplo
    const additionalArtworks = publishedArtworks.filter(a => a.status === 'published').slice(0, 2);
    
    for (let i = 0; i < additionalArtworks.length && i < buyers.length - 1; i++) {
      const artwork = additionalArtworks[i];
      const buyer = buyers[i + 1];
      // Obtener el ArtistProfile y luego el User
      const artistProfile = await ArtistProfile.findById(artwork.artistId);
      const artistUser = artistProfile ? await User.findById(artistProfile.userId) : null;

      if (artistUser) {
        const commission = Math.round((artwork.price * commissionPercentage / 100) * 100) / 100;
        const artistEarnings = Math.round((artwork.price - commission) * 100) / 100;

        let order = await Order.findOne({
          buyerId: buyer._id,
          artworkId: artwork._id,
        });

        if (!order) {
          order = await Order.create({
            buyerId: buyer._id,
            artworkId: artwork._id,
            artistId: artistUser._id,
            price: artwork.price,
            commission,
            artistEarnings,
            shippingRequired: artwork.type === 'physical',
            shippingStatus: 'pending',
          });
          orders.push(order);
        } else {
          orders.push(order);
        }
      }
    }

    console.log(`✅ ${orders.length} órdenes de ejemplo creadas/verificadas`);
    return orders;
  } catch (error) {
    console.error('❌ Error al crear órdenes:', error.message);
    throw error;
  }
};

/**
 * Crea encargos de ejemplo
 */
const createCommissionRequests = async (users, artistProfiles) => {
  try {
    const commissions = [];
    const buyers = users.filter(u => u.role === 'buyer');
    const artists = users.filter(u => u.role === 'artist');

    const commissionsData = [
      {
        buyerId: null,
        artistId: null,
        title: 'Retrato Familiar',
        description: 'Necesito un retrato familiar de 3 personas. Estilo realista, tamaño 60x80cm. Presupuesto flexible según técnica.',
        budget: 500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        status: 'pending',
      },
      {
        buyerId: null,
        artistId: null,
        title: 'Ilustración para Libro',
        description: 'Busco ilustraciones para un libro infantil. Necesito 10 ilustraciones en estilo colorido y amigable. Presupuesto por ilustración.',
        budget: 1500,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
        status: 'accepted',
        agreedPrice: 1400,
      },
      {
        buyerId: null,
        artistId: null,
        title: 'Logo Personalizado',
        description: 'Diseño de logo para mi marca personal. Necesito versión vectorial y diferentes variaciones de color.',
        budget: 300,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        status: 'in_progress',
        agreedPrice: 280,
      },
      {
        buyerId: null,
        artistId: null,
        title: 'Mural Interior',
        description: 'Quiero un mural para mi sala de estar. Tema: naturaleza y tranquilidad. Tamaño aproximado 3x2 metros.',
        budget: 2000,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
        status: 'completed',
        agreedPrice: 1900,
      },
    ];

    for (let i = 0; i < commissionsData.length; i++) {
      const commissionData = { ...commissionsData[i] };
      commissionData.buyerId = buyers[i % buyers.length]._id;
      commissionData.artistId = artists[i % artists.length]._id;

      let commission = await CommissionRequest.findOne({
        buyerId: commissionData.buyerId,
        artistId: commissionData.artistId,
        title: commissionData.title,
      });

      if (!commission) {
        commission = await CommissionRequest.create(commissionData);
        commissions.push(commission);
      } else {
        commissions.push(commission);
      }
    }

    console.log(`✅ ${commissions.length} encargos de ejemplo creados/verificados`);
    return commissions;
  } catch (error) {
    console.error('❌ Error al crear encargos:', error.message);
    throw error;
  }
};

/**
 * Función principal de inicialización
 */
const seed = async (clearData = false) => {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // Conectar a la base de datos
    await connectDB();

    // Limpiar base de datos si se solicita (solo desarrollo)
    if (clearData && process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Limpiando base de datos...');
      await clearDatabase();
    }

    // 1. Crear usuario administrador
    await createAdminUser();

    // 2. Crear configuración de plataforma
    await createPlatformSettings();

    // 3. Crear usuarios de ejemplo
    const users = await createSampleUsers();

    // 4. Crear perfiles de artistas
    const artistProfiles = await createArtistProfiles(users);

    // 5. Crear obras de arte
    const artworks = await createArtworks(artistProfiles);

    // 6. Crear órdenes de ejemplo
    const orders = await createOrders(users, artworks);

    // 7. Crear encargos de ejemplo
    const commissions = await createCommissionRequests(users, artistProfiles);

    console.log('\n📊 Resumen de datos creados:');
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Perfiles de artistas: ${artistProfiles.length}`);
    console.log(`   - Obras de arte: ${artworks.length}`);
    console.log(`   - Órdenes: ${orders.length}`);
    console.log(`   - Encargos: ${commissions.length}`);

    console.log('\n✅ Seed completado exitosamente');
    console.log('\n💡 Credenciales de prueba:');
    console.log('   Admin: admin@marketplace.com / Admin123!');
    console.log('   Comprador: maria.garcia@email.com / Password123!');
    console.log('   Artista: sofia.artista@email.com / Password123!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  // Verificar si se pasa --clear como argumento
  const clearData = process.argv.includes('--clear');
  seed(clearData);
}

module.exports = {
  seed,
  createAdminUser,
  createPlatformSettings,
  createSampleUsers,
  createArtistProfiles,
  createArtworks,
  createOrders,
  createCommissionRequests,
};
