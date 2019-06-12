const express = require('express');
const { ExperienciaLaboral, validate } = require('../models/ExperienciaLaboral');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.render('experiencialaboral/index', { title: "experiencia laboral", user: req.user });
})

//para cargar las vistas
router.get('/getExperiencias', async (req, res) => {
  const experiencias = await ExperienciaLaboral.find({ Usuario: req.user._id });
  res.send(experiencias);
})

router.get('/create', (req, res) => {
  res.render('experiencialaboral/create', { title: "crear experiencias laborales", user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const experiencia = await ExperienciaLaboral.findOne({ _id: req.params.id, Usuario: req.user._id })
  res.render('experiencialaboral/create', { title: "editar experiencias laborales", experiencia, user: req.user });
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

  let experiencia = new ExperienciaLaboral({
    Empresa: req.body.Empresa,
    PuestoOcupado: req.body.PuestoOcupado,
    FechaDesde: req.body.FechaDesde,
    FechaHasta: req.body.FechaHasta,
    Salario: req.body.Salario,
    Usuario: req.user._id
  });
  experiencia = await experiencia.save();

  res.send(experiencia);
});

router.put('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const experiencia = await ExperienciaLaboral.findOneAndUpdate({ _id: req.params.id }, {
    Empresa: req.body.Empresa,
    PuestoOcupado: req.body.PuestoOcupado,
    FechaDesde: req.body.FechaDesde,
    FechaHasta: req.body.FechaHasta,
    Salario: req.body.Salario,
  }, { new: true });

  if (!experiencia) return res.status(404).send({ Errmessage: 'No hay una experiencia con el id especificado' });

  res.send(experiencia);
});

// router.delete('/:id', async (req, res) => {

//   if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
//   const idioma = await ExperienciaLaboral.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
//   if (!idioma) return res.status(404).send({ Errmessage: 'No hay un idioma con el id especificado' });

//   res.send(idioma);
// })


module.exports = router;