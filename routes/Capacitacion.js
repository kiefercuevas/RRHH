const express = require('express');
const { Capacitacion, validate } = require('../models/Capacitacion');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);



router.get('/', (req, res) => {
  res.render('capacitacion/index', { title: "capacitaciones", user: req.user });
})

//para cargar las vistas
router.get('/getCapacitacion', async (req, res) => {
  const capacitaciones = await Capacitacion.find({ Usuario: req.user._id });
  res.send(capacitaciones);
})

router.get('/create', (req, res) => {
  res.render('capacitacion/create', { title: "crear capacitaciones", user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const capacitacion = await Capacitacion.findOne({ _id: req.params.id, Usuario: req.user._id });
  if (!capacitacion) res.render('errPage', { Errmessage: "Error, no se encontro capacitacion para este usuario" });

  res.render('capacitacion/create', { title: "crear capacitaciones", capacitacion, user: req.user });
});

// router.get('/:id', async (req, res) => {

//   if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
//   const capacitacion = await Capacitacion.findById(req.params.id);
//   if (!capacitacion) return res.status(404).send({ Errmessage: 'No hay una capacitacion con el id especificado' });

//   res.send(capacitacion);
// })

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  let capacitacion = new Capacitacion({
    Descripcion: req.body.Descripcion,
    Nivel: req.body.Nivel,
    FechaDesde: req.body.FechaDesde,
    FechaHasta: req.body.FechaHasta,
    Institucion: req.body.Institucion,
    Usuario: req.user._id,
  });
  capacitacion = await capacitacion.save();

  res.send(capacitacion);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });


  if (await Capacitacion.countDocuments({ _id: req.params.id, Usuario: req.user._id }) <= 0) return res.status(400).send({ Errmessage: "La capacitacion no pertenece a este usuario" });

  const capacitacion = await Capacitacion.findByIdAndUpdate(req.params.id, {
    Descripcion: req.body.Descripcion,
    Nivel: req.body.Nivel,
    FechaDesde: req.body.FechaDesde,
    FechaHasta: req.body.FechaHasta,
    Institucion: req.body.Institucion,
  }, { new: true });

  if (!capacitacion) return res.status(404).send({ Errmessage: 'No hay una capacitacion con el id especificado' });

  res.send(capacitacion);
});

// router.delete('/:id', async (req, res) => {
//   const capacitacion = await Capacitacion.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
//   if (!capacitacion) return res.status(404).send('No hay una capacitacion con el id especificado');

//   res.send(capacitacion);
// })


module.exports = router;