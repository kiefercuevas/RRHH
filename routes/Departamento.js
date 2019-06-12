const express = require('express');
const { Departamento, validate } = require('../models/Departamento');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');
const IsRRHH = require('../middleware/isRRHH');

router.use(authMiddleware);
router.use(IsRRHH);

router.get('/', (req, res) => {
  res.render('departamento/index', { title: "departamentos", user: req.user });
})

//para cargar las vistas
router.get('/getDepartamentos', async (req, res) => {
  const departamento = await Departamento.find({ Estado: true });
  res.send(departamento)
})

router.get('/create', (req, res) => {
  res.render('departamento/create', { title: "crear departamento", user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const departamento = await Departamento.findOne({ _id: req.params.id, Estado: true })
  res.render('departamento/create', { title: "crear departamentos", departamento, user: req.user });
});


// router.get('/:id', async (req, res) => {

//   if (!IsvalidObjID(req.params.id)) return res.status(400).send('El id no es valido');
//   const departamento = await Departamento.findOne({ _id: req.params.id, Estado: true })

//   if (!departamento) return res.status(404).send('No hay un departamento con el id especificado');
//   res.send(departamento);
// })

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  let departamento = new Departamento({ Nombre: req.body.Nombre });
  departamento = await departamento.save();

  res.send(departamento);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const departamento = await Departamento.findOneAndUpdate({ _id: req.params.id, Estado: true }, { Nombre: req.body.Nombre }, { new: true });

  if (!departamento) return res.status(404).send({ Errmessage: 'No hay un departamento con el id especificado' });

  res.send(departamento);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const departamento = await Departamento.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!departamento) return res.status(404).send({ Errmessage: 'No hay un departamento con el id especificado' });

  res.send(departamento);
})


module.exports = router;