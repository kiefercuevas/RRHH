const express = require('express');
const { Usuario, validate } = require('../models/Usuario');
const { Empleado } = require('../models/Empleado');
const validateEmpleado = require('../models/Empleado').validate;
const { Rol } = require('../models/Rol');
const router = express.Router();
const IsvalidObjID = require('../helpers/validateObjectId');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/isAdmin')


router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', (req, res) => {
  res.render('usuario/index', { title: "usuarios", user: req.user });
})

//para cargar las vistas
router.get('/getUsuarios', async (req, res) => {
  const rol = await Rol.find({ Nombre: "ADMIN" })

  const usuarios = await Usuario
    .find({ Estado: true, Nombre: { $ne: "ADMIN" } })
    .populate('Rol');

  for (usuario of usuarios) {
    usuario.Clave = null;
  }
  res.send(usuarios)
})

router.get('/create', (req, res) => {
  const usuario = null;
  res.render('usuario/create', { title: "crear usuario", usuario, user: req.user });
});

router.get('/editar/:id', async (req, res) => {
  const usuario = await Usuario.findOne({ _id: req.params.id, Estado: true })
  usuario.Clave = null;
  res.render('usuario/create', { title: "crear usuario", usuario, user: req.user });
});

//para registrar internamente
router.post('/', async (req, res) => {

  const usuario = req.body;
  //validar usuario
  const { error } = validate(usuario);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const user = await Usuario.findOne({ Nombre: usuario.Nombre, Estado: true })
  if (user) return res.status(400).send({ Errmessage: "Ya existe un usuario con ese nombre" });

  let rolRRHH = await Rol.findOne({ Nombre: /^rrhh$/i, Estado: true })
  if (!rolRRHH) {
    const rol = new Rol({
      Nombre: "RRHH",
    });
    rolRRHH = await rol.save();
  }

  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(usuario.Clave, salt)
  let newUsuario = new Usuario({
    Nombre: usuario.Nombre,
    Clave: pass,
    Rol: rolRRHH._id
  });
  newUsuario = await newUsuario.save();
  res.send(newUsuario);
});


router.put('/:id', async (req, res) => {
  const usuario = req.body;
  //validar usuario
  const { error } = validate(usuario, true);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const user = await Usuario.findOne({ Nombre: usuario.Nombre, Estado: true, _id: { $ne: req.params.id } })
  if (user) return res.status(400).send({ Errmessage: "Ya existe un usuario con ese nombre" });


  const Editarusuario = await Usuario.findOneAndUpdate({ _id: req.params.id, Estado: true }, {
    Nombre: usuario.Nombre,
  }, { new: true });

  if (!Editarusuario) return res.status(404).send({ Errmessage: 'No hay un usuario con el id especificado' });

  res.send(Editarusuario);
});

router.delete('/:id', async (req, res) => {

  if (!IsvalidObjID(req.params.id)) return res.status(400).send({ Errmessage: 'El id no es valido' });
  const usuario = await Usuario.findByIdAndUpdate(req.params.id, { Estado: false }, { new: true });
  if (!usuario) return res.status(404).send({ Errmessage: 'No hay un usuario con el id especificado' });

  res.send(usuario);
});


module.exports = router;