const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validator.middleware');
const {
  validateCreateReview,
  validateArtworkIdParam,
  validateArtistIdParam,
} = require('../validators/review.validators');
const {
  createReview,
  getArtworkReviews,
  getArtistReviews,
} = require('../controllers/review.controller');

const router = express.Router();

router.post('/', authenticate, validateCreateReview, validate, createReview);
router.get('/artworks/:artworkId', validateArtworkIdParam, validate, getArtworkReviews);
router.get('/artists/:artistId', validateArtistIdParam, validate, getArtistReviews);

module.exports = router;

