const mongoose = require('mongoose');
const Joi = require('joi');


const ExperienciaLaboralSchema = new mongoose.Schema({
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Empresa: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  PuestoOcupado: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  FechaDesde: {
    type: Date,
    required: true,
  },
  FechaHasta: {
    type: Date,
    required: true,
  },
  Salario: {
    type: Number,
    required: true,
    min: 0
  }
});

const ExperienciaLaboral = mongoose.model('Experiencia', ExperienciaLaboralSchema);
const schema = {
  Empresa: Joi.string().min(3).max(60).required(),
  PuestoOcupado: Joi.string().min(3).max(60).required(),
  Salario: Joi.number().min(0).required(),
  FechaDesde: Joi.date().required(),
  FechaHasta: Joi.date().required(),
};

function validate(experienciaLaboral) {
  return Joi.validate(experienciaLaboral, schema);
}

module.exports.ExperienciaLaboral = ExperienciaLaboral;
module.exports.ExperienciaLaboralSchema = ExperienciaLaboralSchema;
module.exports.validate = validate;
module.exports.ExperienciaJoiSchema = schema;