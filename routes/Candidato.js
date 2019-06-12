const express = require('express');
const { Candidato, validate, validateIDC } = require('../models/Candidato');
const { Puesto } = require('../models/Puesto');
const { Departamento } = require('../models/Departamento');
const { Competencia } = require('../models/Competencia');
const { Capacitacion } = require('../models/Capacitacion');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {

  const candidatos = await Candidato.find();
  res.send(candidatos);

})

// router.get('/:id', async (req, res) => {


//   if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

//   const candidato = await Candidato.findById(req.params.id);
//   if (!candidato) return res.status(404).send({ Errmessage: 'No hay un Candidato con el id especificado' });

//   res.send(candidato);
// })

router.post('/', async (req, res) => {

  //validar body request
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  //validar cedula
  if (!validateIDC(req.body.Cedula)) return res.status(400).send({ Errmessage: "La cedula no es valida" });
  if (await Candidato.countDocuments({ Cedula: req.body.Cedula }) > 0) return res.status(400).send({ Errmessage: "Ya existe un candidato con esa cedula" });

  //validar puesto
  if (!IsvalidObjID(req.body.PuestoDeseado)) return res.status(400).send({ Errmessage: 'El puesto elegido no es valido' });
  const puesto = await Puesto.countDocuments({ _id: req.body.PuestoDeseado });
  if (!puesto) return res.status(400).send({ Errmessage: "El puesto elegido no existe" });

  //validar departamento
  if (!IsvalidObjID(req.body.Departamento)) return res.status(400).send({ Errmessage: 'El departamento elegido no es valido' });
  const departamento = await Departamento.findOne({ _id: req.body.Departamento });
  if (!departamento) return res.status(400).send({ Errmessage: "El departamento elegido no existe" });

  //validar competencias
  for (let competencia of req.body.Competencias) {
    if (!IsvalidObjID(competencia) || !await IsValidCompetencia(competencia))
      return res.status(400).send({ Errmessage: 'La competencia introducida no es valida' });
  }

  //validar capacitaciones
  for (let capacitacion of req.body.Capacitacion) {
    if (!IsvalidObjID(capacitacion) || !await IsValidCapacitacion(capacitacion))
      return res.status(400).send({ Errmessage: 'La capacitacion introducida no es valida' });
  }


  let candidato = new Candidato({
    Cedula: req.body.Cedula,
    Nombre: req.body.Nombre,
    PuestoDeseado: req.body.PuestoDeseado,
    Departamento: departamento,
    SalarioDeseado: req.body.SalarioDeseado,
    Competencias: req.body.Competencias,
    Capacitacion: req.body.Capacitacion,
    ExperienciaLaboral: req.body.ExperienciaLaboral,
    RecomendadoPor: req.body.RecomendadoPor,
  });
  candidato = await candidato.save();

  res.send(candidato);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

  ///validar body request
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  //validar cedula
  if (!validateIDC(req.body.Cedula)) return res.status(400).send({ Errmessage: "La cedula no es valida" });
  if (await Candidato.countDocuments({ Cedula: req.body.Cedula }) > 0) return res.status(400).send({ Errmessage: "Ya existe un candidato con esa cedula" });

  //validar puesto
  if (!IsvalidObjID(req.body.PuestoDeseado)) return res.status(400).send({ Errmessage: 'El puesto elegido no es valido' });
  const puesto = await Puesto.countDocuments({ _id: req.body.PuestoDeseado });
  if (!puesto) return res.status(400).send({ Errmessage: "El puesto elegido no existe" });

  //validar departamento
  if (!IsvalidObjID(req.body.Departamento)) return res.status(400).send({ Errmessage: 'El departamento elegido no es valido' });
  const departamento = await Departamento.findOne({ _id: req.body.Departamento });
  if (!departamento) return res.status(400).send({ Errmessage: "El departamento elegido no existe" });

  //validar competencias
  for (let competencia of req.body.Competencias) {
    if (!IsvalidObjID(competencia) || !await IsValidCompetencia(competencia))
      return res.status(400).send({ Errmessage: 'La competencia introducida no es valida' });
  }

  //validar capacitaciones
  for (let capacitacion of req.body.Capacitacion) {
    if (!IsvalidObjID(capacitacion) || !await IsValidCapacitacion(capacitacion))
      return res.status(400).send({ Errmessage: 'La capacitacion introducida no es valida' });
  }


  const candidato = await Candidato.findByIdAndUpdate(req.params.id, {
    Cedula: req.body.Cedula,
    Nombre: req.body.Nombre,
    PuestoDeseado: req.body.PuestoDeseado,
    Departamento: departamento,
    SalarioDeseado: req.body.SalarioDeseado,
    Competencias: req.body.Competencias,
    Capacitacion: req.body.Capacitacion,
    ExperienciaLaboral: req.body.ExperienciaLaboral,
    RecomendadoPor: req.body.RecomendadoPor,
  }, { new: true });

  if (!candidato) return res.status(404).send({ Errmessage: 'No hay un candidato con el id especificado' });

  res.send(candidato);
});

// router.delete('/:id', async (req, res) => {
//   const capacitacion = await Capacitacion.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
//   if (!capacitacion) return res.status(404).send('No hay una capacitacion con el id especificado');

//   res.send(capacitacion);
// })


async function IsValidCompetencia(id) {
  const competencia = await Competencia.countDocuments({ _id: id });
  return competencia > 0;
}


async function IsValidCapacitacion(id) {
  const capacitacion = await Capacitacion.countDocuments({ _id: id });
  return capacitacion > 0;
}


module.exports = router;