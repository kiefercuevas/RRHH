const mongoose = require('mongoose');
const { DepartamentoSchema, DepartamentoJoiSchema } = require('./Departamento');
const { ExperienciaLaboralSchema, ExperienciaJoiSchema } = require('./ExperienciaLaboral');
const Joi = require('joi');

const pattern = /^\d{11}$|^\d{3}-\d{7}-\d{1}$/;
const Candidato = mongoose.model('Candidato', new mongoose.Schema({
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Cedula: {
    type: String,
    required: true,
    match: pattern,
  },
  Nombre: {
    type: String,
    required: true,
    min: 3,
    max: 60,
  },
  PuestoDeseado: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Puesto'
  },
  Departamento: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento'
  },
  SalarioDeseado: {
    type: Number,
    required: true,
    default: 0,
  },
  Competencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competencia' }],
  Capacitacion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Capacitacion' }],
  Usuario: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  ExperienciaLaboral: [ExperienciaLaboralSchema],
  RecomendadoPor: {
    type: String,
    min: 3,
    max: 60,
    default: '',
  },
}));


function validate(candidato) {
  const schema = {
    Nombre: Joi.string().min(3).max(60).required(),
    Cedula: Joi.string().regex(pattern).required(),
    SalarioDeseado: Joi.number().required().min(0),
    RecomendadoPor: Joi.string().min(3).max(60),
    ExperienciaLaboral: Joi.array().items(ExperienciaJoiSchema).required().min(1),
    PuestoDeseado: Joi.string().required(),
    Competencias: Joi.array().items(Joi.string().required().min(3).max(60)).required().min(1),
    Capacitacion: Joi.array().items(Joi.string().required().min(3).max(60)).required().min(1),
    Usuario: Joi.string().required(),
    Departamento: Joi.string().required(),
  };
  return Joi.validate(candidato, schema);
}

function validateIdentificationCard(identificationCard) {
  const newIDC = identificationCard.toString().replace("-", '').trim();
  const verificatorDigit = parseInt(newIDC.substring(newIDC.length - 1));
  const weight = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let total = 0;
  let division = 0;
  let result = 0;

  for (let i = 0; i < newIDC.length - 1; i++) {
    let mult = parseInt(newIDC.substr(i, 1)) * weight[i];

    if (mult < 10)
      total += mult;
    else
      total += parseInt(mult.toString().substr(0, 1)) + parseInt(mult.toString().substr(1, 1));
  }

  division = total % 10;
  if (division != 0)
    result = 10 - division;
  else
    result = 0;

  if (result === verificatorDigit)
    return true;
  else
    return false;
}


module.exports.Candidato = Candidato;
module.exports.validate = validate;
module.exports.validateIDC = validateIdentificationCard;

