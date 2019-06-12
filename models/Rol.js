const mongoose = require('mongoose');
const Joi = require('joi');

const rolSchema = new mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 60,
  },
  Estado: {
    type: Boolean,
    default: true,
  }
});
const Rol = mongoose.model('Rol', rolSchema);


function validate(rol) {
  const schema = {
    Nombre: Joi.string()
      .min(3)
      .max(60)
      .required(),
  };
  return Joi.validate(rol, schema);
}

module.exports.Rol = Rol;
module.exports.RolSchema = rolSchema;
module.exports.validate = validate;