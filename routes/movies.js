const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getMovies, createMovie, deleteMovieByID } = require("../controllers/movies");
const { regExpURL, regExpYear } = require("../utils/regexp");

router.get("/movies", getMovies);
router.post("/movies", celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().length(4).pattern(regExpYear),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regExpURL),
    trailer: Joi.string().required().pattern(regExpURL),
    thumbnail: Joi.string().required().pattern(regExpURL),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete("/movies/:movieId", celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex(),
  }),
}), deleteMovieByID);

module.exports = router;
