const Movie = require("../models/movie");

const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(" ")}`));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieByID = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error("IncorrectMovieID"))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        movie.remove();
        res.status(200).send({ message: `Фильм c id: ${req.params.movieId} успешно удалена.` });
      } else {
        next(new ForbiddenError(`Фильм c id: ${req.params.movieId} создал другой пользователь. Невозможно удалить.`));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные."));
      } else if (err.message === "IncorrectMovieID") {
        next(new NotFoundError(`Фильм с id: ${req.params.movieId} не найдена.`));
      } else {
        next(err);
      }
    });
};
