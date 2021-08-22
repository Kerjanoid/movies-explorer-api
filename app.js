require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
const helmet = require("helmet");

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error");
const NotFoundError = require("./errors/not-found-err");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { limiter } = require("./utils/limiter");

const { MONGO_ADRESS, PORT = 3001 } = process.env;

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_ADRESS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(35),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use("/", require("./routes/users"));
app.use("/", require("./routes/movies"));

app.use("*", (req, res, next) => next(new NotFoundError("Ресурс не найден.")));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
