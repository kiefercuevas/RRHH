const express = require('express');
const { Idioma, validate } = require('../models/Idioma');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');
const IsRRHH = require('../middleware/isRRHH');


router.use(authMiddleware);
router.use(IsRRHH);

router.get('/', (req, res) => {
  res.render('idioma/index', { title: "idiomas", user: req.user });
})

//para cargar las vistas
router.get('/getIdiomas', async (req, res) => {
  const idiomas = await Idioma.find({ Estado: true });
  res.send(idiomas);
})

router.get('/create', (req, res) => {
  res.render('idioma/create', { title: "crear idiomas", user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const idioma = await Idioma.findOne({ _id: req.params.id, Estado: true })
  res.render('idioma/create', { title: "crear idiomas", idioma, user: req.user });
});

// router.get('/:id', async (req, res) => {
//   if (!IsvalidObjID(req.params.id)) return res.status(400).send('El id no es valido');
//   const idioma = await Idioma.findOne({ _id: req.params.id, Estado: true })
//   if (!idioma) return res.status(404).send('No hay un idioma con el id especificado');

//   res.send(idioma);
// })



router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  let idioma = new Idioma({ Nombre: req.body.Nombre });
  idioma = await idioma.save();

  res.send(idioma);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const idioma = await Idioma.findOneAndUpdate({ _id: req.params.id, Estado: true }, { Nombre: req.body.Nombre }, { new: true });

  if (!idioma) return res.status(404).send({ Errmessage: 'No hay un idioma con el id especificado' });

  res.send(idioma);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const idioma = await Idioma.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!idioma) return res.status(404).send({ Errmessage: 'No hay un idioma con el id especificado' });

  res.send(idioma);
})


module.exports = router;