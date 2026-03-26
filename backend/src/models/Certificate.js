const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
      index: true,
    },
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
      index: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['authenticity', 'digital_license'],
      required: true,
      default: 'authenticity',
    },
    terms: {
      type: String,
      trim: true,
      default: 'Uso personal. La propiedad intelectual permanece en el artista salvo pacto explícito.',
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: false,
    collection: 'certificates',
  }
);

certificateSchema.index({ buyerId: 1, issuedAt: -1 });
certificateSchema.index({ artistId: 1, issuedAt: -1 });

certificateSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);

