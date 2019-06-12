const express = require('express');
const { Candidato, validate, validateIDC } = require('../models/Candidato');
const { Puesto } = require('../models/Puesto');
const { Departamento } = require('../models/Departamento');
const { Competencia } = require('../models/Competencia');
const { Capacitacion } = require('../models/Capacitacion');
const { ExperienciaLaboral } = require('../models/ExperienciaLaboral');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');
const IsnotRRHH = require('../middleware/notRRHH');
const isRRHH = require('../middleware/isRRHH');
const hasCandidato =require('../middleware/hasCandidato');

router.use(authMiddleware);


router.get('/',isRRHH, (req, res) => {
  res.render('candidato/index', { title: "candidatos", user: req.user });
})

//para cargar las vistas
router.get('/getCandidatos',isRRHH, async (req, res) => {
  const candidatos = await Candidato.find();
  res.send(candidatos);
})


router.get('/create',[IsnotRRHH,hasCandidato],async (req, res) => {
  const puestos = await Puesto.find({Estado:true});
  res.render('candidato/create', { title: "crear candidatos",puestos, user: req.user });
});

router.get('/editar/:id',IsnotRRHH, async (req, res) => {
  const candidato = await Candidato.findOne({ _id: req.params.id})
  res.render('candidato/create', { title: "crear candidato", candidato, user: req.user });
});

//para que el candidato vea su perfil
router.get('/:id',IsnotRRHH, async (req, res) => {
  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

  const candidato = await Candidato
      .findOne({Usuario:req.params.id})
      .populate('Capacitaciones')
      .populate('Competencias')
      .populate('Experiencias')
      .populate('PuestoDeseado')

  if (!candidato) return res.status(404).send({ Errmessage: 'El usuario no es un candidato' });

  res.render('candidato/verPerfil',{title:"ver perfil candidato",candidato,user:req.user});
})

router.post('/',[IsnotRRHH,hasCandidato], async (req, res) => {

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


  const competencias = await Competencia.find({Usuario:req.user._id,Estado:true})
  const capacitacion = await Capacitacion.find({Usuario:req.user._id})
  const experienciaLaborales = await ExperienciaLaboral.find({Usuario:req.user._id})

  const competenciasIds = competencias.map(c => c._id);
  const capacitacionIds = capacitacion.map(c => c._id);
  const experienciaLaboralesIds = experienciaLaborales.map(e => e._id)

  let candidato = new Candidato({
    Cedula: req.body.Cedula,
    Nombre: req.body.Nombre,
    PuestoDeseado: req.body.PuestoDeseado,
    SalarioDeseado: req.body.SalarioDeseado,
    Competencias: competenciasIds,
    Capacitacion: capacitacionIds,
    ExperienciaLaboral:experienciaLaboralesIds,
    RecomendadoPor: req.body.RecomendadoPor,
    Usuario: req.user._id,
  });
  candidato = await candidato.save();

  res.send(candidato);
});

router.put('/:id',IsnotRRHH, async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

  //validar body request
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  //validar cedula
  if (!validateIDC(req.body.Cedula)) return res.status(400).send({ Errmessage: "La cedula no es valida" });
  if (await Candidato.countDocuments({ Cedula: req.body.Cedula, Usuario:{$ne: req.user._id} }) > 0) return res.status(400).send({ Errmessage: "Ya existe un candidato con esa cedula" });

  //validar puesto
  if (!IsvalidObjID(req.body.PuestoDeseado)) return res.status(400).send({ Errmessage: 'El puesto elegido no es valido' });
  const puesto = await Puesto.countDocuments({ _id: req.body.PuestoDeseado });
  if (!puesto) return res.status(400).send({ Errmessage: "El puesto elegido no existe" });


  const candidato = await Candidato.findByIdAndUpdate(req.params.id, {
    Cedula: req.body.Cedula,
    Nombre: req.body.Nombre,
    PuestoDeseado: req.body.PuestoDeseado,
    SalarioDeseado: req.body.SalarioDeseado,
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


// async function IsValidCompetencia(id) {
//   const competencia = await Competencia.countDocuments({ _id: id });
//   return competencia > 0;
// }


// async function IsValidCapacitacion(id) {
//   const capacitacion = await Capacitacion.countDocuments({ _id: id });
//   return capacitacion > 0;
// }


module.exports = router;