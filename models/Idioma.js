const mongoose = require('mongoose');
const Joi = require('joi');

const Idioma = mongoose.model('Idioma', new mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  Estado: {
    type: Boolean,
    default: true,
  }
}));


function validate(idioma) {
  const schema = {
    Nombre: Joi.string()
      .min(3)
      .max(60)
      .required(),
  };
  return Joi.validate(idioma, schema);
}

module.exports.Idioma = Idioma;
module.exports.validate = validate;