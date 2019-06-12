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
  SalarioDeseado: {
    type: Number,
    required: true,
    default: 0,
  },
  Competencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competencia' }],
  Capacitaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Capacitacion' }],
  Experiencias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experiencia' }],
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
    PuestoDeseado: Joi.string().required(),
  };
  return Joi.validate(candidato, schema);
}

function validateIdentificationCard(identificationCard) {
  const excepcionesCedulas = ['00000000018', '11111111123', '00100759932', '00105606543', '00114272360', '00200123640',
  '00200409772', '00800106971', '01200004166', '01400074875', '01400000282', '03103749672', '03200066940',
  '03800032522', '03900192284', '04900026260', '05900072869', '07700009346', '00114532330', '03121982479',
  '40200700675', '40200639953', '00121581750', '00119161853', '22321581834', '00121581800', '09421581768',
  '22721581818', '90001200901', '00301200901', '40200452735', '40200401324', '10621581792'];

  if(excepcionesCedulas.includes(identificationCard)) return false;

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

