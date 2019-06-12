const mongoose = require('mongoose');
const Joi = require('joi');

const CompetenciaSchema = new mongoose.Schema({
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
  Estado: {
    type: Boolean,
    default: true,
  }
});
const Competencia = mongoose.model('Competencia', CompetenciaSchema);


function validate(competencia) {
  const schema = {
    Descripcion: Joi.string()
      .min(3)
      .max(60)
      .required(),
  };
  return Joi.validate(competencia, schema);
}

module.exports.Competencia = Competencia;
module.exports.CompetenciaSchema = CompetenciaSchema;
module.exports.validate = validate;