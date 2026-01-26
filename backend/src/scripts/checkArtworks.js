require('dotenv').config();
const connectDB = require('../config/database');
const Artwork = require('../models/Artwork');

(async () => {
  try {
    await connectDB();
    console.log('✅ Conectado a MongoDB\n');

    const artworks = await Artwork.find({}).select('title status type images');
    
    console.log(`📦 Total obras: ${artworks.length}\n`);
    
    console.log('📊 Obras por status:');
    const byStatus = artworks.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    console.log(JSON.stringify(byStatus, null, 2));
    
    console.log('\n✅ Obras publicadas:');
    const published = artworks.filter(a => a.status === 'published');
    console.log(`Total: ${published.length}`);
    published.forEach(a => {
      const imageCount = a.images?.length || 0;
      console.log(`  - ${a.title} (${a.type}) - ${imageCount} imagen(es)`);
    });
    
    console.log('\n❌ Obras NO publicadas:');
    const notPublished = artworks.filter(a => a.status !== 'published');
    console.log(`Total: ${notPublished.length}`);
    notPublished.forEach(a => {
      console.log(`  - ${a.title} (${a.type}) - Status: ${a.status}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
