const mongoose = require('mongoose');
const Joi = require('joi');

const DepartamentoSchema = new mongoose.Schema({
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
});
const Departamento = mongoose.model('Departamento', DepartamentoSchema);

const schema = {
  Nombre: Joi.string()
    .min(3)
    .max(60)
    .required(),
};

function validate(departamento) {
  return Joi.validate(departamento, schema);
}

module.exports.Departamento = Departamento;
module.exports.DepartamentoSchema = DepartamentoSchema;
module.exports.validate = validate;
module.exports.DepartamentoJoiSchema = schema;