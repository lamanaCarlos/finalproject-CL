const { Certificate, Artwork } = require('../models');

const getCertificateTypeFromArtwork = async (artworkId) => {
  const artwork = await Artwork.findById(artworkId).select('type');
  if (!artwork) return 'authenticity';
  return artwork.type === 'digital' ? 'digital_license' : 'authenticity';
};

const issueCertificateFromOrder = async (order) => {
  const existing = await Certificate.findOne({ orderId: order._id });
  if (existing) return existing;

  const certificateType = await getCertificateTypeFromArtwork(order.artworkId);

  const certificate = await Certificate.create({
    orderId: order._id,
    artworkId: order.artworkId,
    artistId: order.artistId,
    buyerId: order.buyerId,
    type: certificateType,
  });

  return certificate;
};

module.exports = {
  issueCertificateFromOrder,
};

