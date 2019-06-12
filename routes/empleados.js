const express = require('express');
const { Usuario } = require('../models/Usuario');
const { Empleado, validate } = require('../models/Empleado');
const { Puesto } = require('../models/Puesto');
const { Departamento } = require('../models/Departamento');
const { validateIDC } = require('../models/Candidato');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const IsRRHH = require('../middleware/isRRHH');
const notRRHH = require('../middleware/notRRHH');
const IsvalidObjID = require('../helpers/validateObjectId');

router.use(authMiddleware);
router.use(IsRRHH);

router.get('/', (req, res) => {
  res.render('empleado/index', { title: "empleados", user: req.user });
})

//para cargar las vistas
router.get('/getEmpleados', async (req, res) => {
  const empleados = await Empleado
    .find({ Estado: true })
    .populate('Puesto')
    .populate('Departamento')

  res.send(empleados)
})

// router.get('/create', notRRHH, async (req, res) => {
//   const puestos = await Puesto.find({ Estado: true, EstaDisponible: true });
//   const departamentos = await Departamento.find({ Estado: true });
//   res.render('empleado/create', { title: "crear empleado", puestos, departamentos, user: req.user });
// });

router.get('/editar/:id', async (req, res) => {
  const puestos = await Puesto.find({ Estado: true});
  const departamentos = await Departamento.find({ Estado: true });

  const empleado = await Empleado.findOne({ Estado: true, _id: req.params.id })
  res.render('empleado/create', { title: "editar empleado", puestos, empleado, departamentos, user: req.user });
});


// router.post('/', async (req, res) => {
//   const empleado = req.body;
//   //validar empleado
//   const { error } = validate(empleado);
//   if (error) return res.status(400).send({ Errmessage: error.details[0].message });

//   //validar body request Empleado
//   const errEmpleado = validate(empleado).error;
//   if (errEmpleado) return res.status(400).send({ Errmessage: errEmpleado.details[0].message });

//   //validar cedula
//   if (!validateIDC(empleado.Cedula)) return res.status(400).send({ Errmessage: "La cedula no es valida" });
//   if (await Empleado.countDocuments({ Cedula: empleado.Cedula }) > 0) return res.status(400).send({ Errmessage: "Ya existe un empleado con esa cedula" });

//   //validar puesto
//   if (!IsvalidObjID(empleado.Puesto)) return res.status(400).send({ Errmessage: 'El puesto elegido no es valido' });
//   const puesto = await Puesto.countDocuments({ _id: empleado.Puesto });
//   if (!puesto) return res.status(400).send({ Errmessage: "El puesto elegido no existe" });

//   //validar departamento
//   if (!IsvalidObjID(empleado.Departamento)) return res.status(400).send({ Errmessage: 'El departamento elegido no es valido' });
//   const departamento = await Departamento.findOne({ _id: empleado.Departamento });
//   if (!departamento) return res.status(400).send({ Errmessage: "El departamento elegido no existe" });

//   const user = await empleado.findOne({ Nombre: empleado.Nombre, Estado: true })
//   if (user) return res.status(400).send({ Errmessage: "Ya existe un empleado con ese nombre" });


//   let newempleado = new Empleado({
//     Cedula: empleado.Cedula,
//     Nombre: empleado.Nombre,
//     Puesto: empleado.Puesto,
//     Departamento: departamento,
//     Salario: empleado.Salario,
//     FechaIngreso: empleado.FechaIngreso,
//     Usuario: req.user._id,
//   });
//   newempleado = await newempleado.save();
//   res.send(newempleado);
// });


router.put('/:id', async (req, res) => {
  const empleado = req.body;

  //validar empleado
  const { error } = validate(empleado, true);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  //validar body request Empleado
  const errEmpleado = validate(empleado).error;
  if (errEmpleado) return res.status(400).send({ Errmessage: errEmpleado.details[0].message });

  //validar cedula
  if (!validateIDC(empleado.Cedula)) return res.status(400).send({ Errmessage: "La cedula no es valida" });
  if (await Empleado.countDocuments({ Cedula: empleado.Cedula, _id: { $ne: req.params.id } }) > 0) return res.status(400).send({ Errmessage: "Ya existe un empleado con esa cedula" });

  //validar puesto
  if (!IsvalidObjID(empleado.Puesto)) return res.status(400).send({ Errmessage: 'El puesto elegido no es valido' });
  const puesto = await Puesto.findOne({ _id: empleado.Puesto });
  if (!puesto) return res.status(400).send({ Errmessage: "El puesto elegido no existe" });

  //validar departamento
  if (!IsvalidObjID(empleado.Departamento)) return res.status(400).send({ Errmessage: 'El departamento elegido no es valido' });
  // const departamento = await Departamento.findOne({ _id:  });
  // if (!departamento) return res.status(400).send({ Errmessage: "El departamento elegido no existe" });

  // const user = await Empleado.findOne({ Nombre: empleado.Nombre, Estado: true, _id: { $ne: req.params.id } })
  // if (user) return res.status(400).send({ Errmessage: "Ya existe un empleado con ese nombre" });
  const empleadoSinEditar = await Empleado.findOne({ _id: req.params.id, Estado: true });
  await Puesto.findOneAndUpdate({_id:empleadoSinEditar.Puesto},{EstaDisponible:true});

  const EditarEmpleado = await Empleado.findOneAndUpdate({ _id: req.params.id, Estado: true }, {
    Cedula: empleado.Cedula,
    Nombre: empleado.Nombre,
    Puesto: empleado.Puesto,
    Departamento: empleado.Departamento,
    Salario: empleado.Salario,
    FechaIngreso: empleado.FechaIngreso,
  }, { new: true });

  await Puesto.findOneAndUpdate({ _id: puesto._id, Estado: true }, {EstaDisponible: false}, { new: true });
  res.send(EditarEmpleado);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const empleado = await Empleado.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!empleado) return res.status(404).send({ Errmessage: 'No hay un empleado con el id especificado' });

  res.send(empleado);
});

module.exports = router;