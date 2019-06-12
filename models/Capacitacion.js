const mongoose = require('mongoose');
const Joi = require('joi');

const levels = ['Grado', 'Post-grado', 'Maestria', 'Doctorado', 'Tecnico', 'Gestion'];
const CapacitacionSchema = new mongoose.Schema({
  Descripcion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  Usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  Nivel: {
    type: String,
    required: true,
    enum: levels,
  },
  FechaDesde: {
    type: Date,
    required: true,
  },
  FechaHasta: {
    type: Date,
    required: true,
  },
  Institucion: {
    type: String,
    required: true,
    min: 3,
    max: 60,
  },
});
const Capacitacion = mongoose.model('Capacitacion', CapacitacionSchema);


function validate(capacitacion) {
  const schema = {
    Descripcion: Joi.string()
      .min(3)
      .max(60)
      .required(),
    Nivel: Joi.string()
      .valid(levels)
      .required(),
    FechaDesde: Joi
      .date()
      .required(),
    FechaHasta: Joi
      .date()
      .required(),
    Institucion: Joi.string()
      .min(3)
      .max(60)
      .required(),
  };
  return Joi.validate(capacitacion, schema);
}

module.exports.Capacitacion = Capacitacion;
module.exports.CapacitacionSchema = CapacitacionSchema;
module.exports.validate = validate;