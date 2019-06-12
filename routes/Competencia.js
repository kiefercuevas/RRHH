const express = require('express');
const { Competencia, validate } = require('../models/Competencia');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.render('competencia/index', { title: "competencias", user: req.user });
})

//para cargar las vistas
router.get('/getCompetencias', async (req, res) => {
  const competencias = await Competencia.find({ Estado: true, Usuario: req.user._id });
  res.send(competencias)
})

router.get('/create', (req, res) => {
  res.render('competencia/create', { title: "crear competencia", user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const competencia = await Competencia.findOne({ _id: req.params.id, Estado: true, Usuario: req.user._id });

  if (!competencia) res.render('errPage', { Errmessage: "Error, no se encontro competencias para este usuario" });

  res.render('competencia/create', { title: "crear competencias", competencia, user: req.user });
});

// router.get('/:id', async (req, res) => {

//   if (!IsvalidObjID(req.params.id)) return res.status(400).send('El id no es valido');
//   const competencia = await Competencia.findOne({ _id: req.params.id, Estado: true })

//   if (!competencia) return res.status(404).send('No hay una competencia con el id especificado');

//   res.send(competencia);
// })

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  let competencia = new Competencia({
    Descripcion: req.body.Descripcion,
    Usuario: req.user._id
  });
  competencia = await competencia.save();

  res.send(competencia);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  if (await Competencia.countDocuments({ _id: req.params.id, Usuario: req.user._id }) <= 0) return res.status(400).send({ Errmessage: "La competencia no pertenece a este usuario" });

  const competencia = await Competencia.findOneAndUpdate({ _id: req.params.id, Estado: true }, { Descripcion: req.body.Descripcion }, { new: true });

  if (!competencia) return res.status(404).send({ Errmessage: 'No hay una competencia con el id especificado' });

  res.send(competencia);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });

  if (await Competencia.countDocuments({ _id: req.params.id, Usuario: req.user._id }) <= 0) return res.status(400).send({ Errmessage: "La competencia no pertenece a este usuario" });

  const competencia = await Competencia.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!competencia) return res.status(404).send({ Errmessage: 'No hay una competencia con el id especificado' });

  res.send(competencia);
})


module.exports = router;