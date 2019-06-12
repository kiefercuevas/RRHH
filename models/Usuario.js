const mongoose = require('mongoose');
const { RolSchema } = require('./Rol');
const Joi = require('joi');

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
    unique: true,
  },
  Estado: {
    type: Boolean,
    default: true,
  },
  Clave: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 60,
  },
  Rol: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Rol'
  }
}));


function validate(usuario, isEdit = false) {
  let schema = null;
  if (!isEdit) {
    schema = {
      Nombre: Joi.string().min(3).max(60).required(),
      Clave: Joi.string().min(6).max(60).required(),
    };
  }
  else {
    schema = {
      Nombre: Joi.string().min(3).max(60).required(),
    };
  }
  return Joi.validate(usuario, schema);
}

module.exports.Usuario = Usuario;
module.exports.validate = validate;