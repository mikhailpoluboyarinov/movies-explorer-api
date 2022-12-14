const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGULAR_URL } = require('../utils/constants');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGULAR_URL),
    trailerLink: Joi.string().required().pattern(REGULAR_URL),
    thumbnail: Joi.string().required().pattern(REGULAR_URL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = router;
