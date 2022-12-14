const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError404');
const ForbiddenError = require('../errors/forbiddenError403');
const BadRequestError = require('../errors/badRequestError400');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ ownerId: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const ownerId = req.user._id;

  Movie.findById({ _id: movieId })
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError('Передан несуществующий _id фильма.'));
      }
      if (movie.owner.toHexString() !== ownerId) {
        return next(new ForbiddenError('Вы не можете удалить этот фильм.'));
      }
      return movie.remove()
        .then(() => {
          res.send(movie);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректные Id.'));
      } else {
        next(err);
      }
    });
};
