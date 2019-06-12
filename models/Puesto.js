const mongoose = require('mongoose');
const Joi = require('joi');

const RiskLevel = ['Alto', 'Medio', 'Bajo'];

const Puesto = mongoose.model('Puesto', new mongoose.Schema({
  Nombre: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  NivelRiesgo: {
    type: String,
    enum: RiskLevel,
    required: true,
  },
  SalarioMinimo: {
    type: Number,
    required: true,
    default: 0,
  },
  SalarioMaximo: {
    type: Number,
    required: true,
    default: 0,
  },
  Estado: {
    type: Boolean,
    default: true,
  },
  EstaDisponible: {
    type: Boolean,
    default: true,
  },
  Departamento:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento',
    required: true
  }
}));


function validate(puesto) {
  const schema = {
    Nombre: Joi.string()
      .min(3)
      .max(60)
      .required(),
    NivelRiesgo: Joi
      .valid(RiskLevel)
      .required(),
    SalarioMinimo: Joi
      .number()
      .required()
      .min(0),
    SalarioMaximo: Joi
      .number()
      .required()
      .min(0),
    Departamento: Joi.string().required()
  };
  return Joi.validate(puesto, schema);
}

module.exports.Puesto = Puesto;
module.exports.validate = validate;