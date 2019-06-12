const express = require('express');
const { Puesto, validate } = require('../models/Puesto');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const { Empleado } = require("../models/Empleado");
const authMiddleware = require('../middleware/auth');
const IsRRHH = require('../middleware/isRRHH');
const {Departamento} = require('../models/Departamento');
router.use(authMiddleware);
router.use(IsRRHH);

router.get('/', (req, res) => {
  res.render('puesto/index', { title: "puestos", user: req.user });
})

//para cargar las vistas
router.get('/getPuestos', async (req, res) => {
  const puestos = await Puesto.find({ Estado: true, EstaDisponible: true }).populate('Departamento');
  res.send(puestos);
})

router.get('/create',async (req, res) => {
  const departamentos = await Departamento.find({Estado:true});
  res.render('puesto/create', { title: "crear puesto", user: req.user,departamentos });
});

router.get('/editar/:id', async (req, res) => {
  const puesto = await Puesto.findOne({ _id: req.params.id, Estado: true })
  const departamentos = await Departamento.find({Estado:true});
  res.render('puesto/create', { title: "editar puesto", puesto, user: req.user,departamentos });
});


// router.get('/:id', async (req, res) => {
//   if (!IsvalidObjID(req.params.id)) return res.status(400).send('El id no es valido');
//   const puesto = await Puesto.findOne({ _id: req.params.id, Estado: true })
//   if (!puesto) return res.status(404).send('No hay un puesto con el id especificado');

//   res.send(puesto);
// })

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  let puesto = new Puesto({
    Nombre: req.body.Nombre,
    NivelRiesgo: req.body.NivelRiesgo,
    SalarioMinimo: req.body.SalarioMinimo,
    SalarioMaximo: req.body.SalarioMaximo,
    Departamento: req.body.Departamento
  });
  puesto = await puesto.save();

  res.send(puesto);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const puesto = await Puesto.findOneAndUpdate({ _id: req.params.id, Estado: true }, {
    Nombre: req.body.Nombre,
    NivelRiesgo: req.body.NivelRiesgo,
    SalarioMinimo: req.body.SalarioMinimo,
    SalarioMaximo: req.body.SalarioMaximo,
    Departamento: req.body.Departamento
  }, { new: true });

  if (!puesto) return res.status(404).send({ Errmessage: 'No hay un puesto con el id especificado' });

  res.send(puesto);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const puesto = await Puesto.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!puesto) return res.status(404).send({ Errmessage: 'No hay un puesto con el id especificado' });

  res.send(puesto);
})


module.exports = router;