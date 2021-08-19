const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "Пользователь с таким 'email' уже существует."],
    required: [true, "Поле 'email' должно быть заполнено."],
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты.",
    },
  },
  password: {
    type: String,
    required: [true, "Поле 'password' должно быть заполнено."],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, "Минимальная длина поля 'name' - 2 символа."],
    maxlength: [30, "Максимальная длина поля 'name' - 30 символов."],
    required: [true, "Поле 'name' должно быть заполнено."],
  },
}, { versionKey: false });

module.exports = mongoose.model("user", userSchema);
