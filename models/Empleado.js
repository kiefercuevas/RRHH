const mongoose = require('mongoose');
const { DepartamentoSchema } = require('./Departamento');
const Joi = require('joi');

const pattern = /^\d{11}$|^\d{3}-\d{7}-\d{1}$/;
const Empleado = mongoose.model('Empleado', new mongoose.Schema({
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Cedula: {
    type: String,
    required: true,
    match: pattern
  },
  Nombre: {
    type: String,
    required: true,
    min: 3,
    max: 60,
  },
  FechaIngreso: {
    type: Date,
    required: true,
  },
  Salario: {
    type: Number,
    required: true,
    min: 0
  },
  Puesto: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puesto'
  },
  Departamento: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento'
  },
  Estado: {
    type: Boolean,
    default: true,
  }
}));


function validate(empleado) {
  const schema = {
    Nombre: Joi.string().min(3).max(60).required(),
    Cedula: Joi.string().regex(pattern).required(),
    FechaIngreso: Joi.date().required(),
    Salario: Joi.number().required().min(0),
    Puesto: Joi.string().required(),
    Departamento: Joi.string().required(),
  };
  return Joi.validate(empleado, schema);
}

module.exports.Empleado = Empleado;
module.exports.validate = validate;