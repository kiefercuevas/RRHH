const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, validate } = require('../models/Usuario')
const { Rol } = require('../models/Rol')
const router = express.Router();
const { secret } = require('../helpers/globalparams');

router.get('/login', (req, res) => {
  res.render('usuario/login', { title: "Login", });
});

router.get('/register', (req, res) => {
  res.render('usuario/register', { title: "Registrarse" });
});


router.post('/login', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ Errmessage: error.details[0].message });

  const user = await Usuario.findOne({ Nombre: req.body.Nombre }).populate('Rol');
  if (!user) return res.status(400).send({ Errmessage: "El usuario no existe" });
  const IsUser = await bcrypt.compare(req.body.Clave, user.Clave);

  if (!IsUser) return res.status(400).send({ Errmessage: "El usuario es incorrecto" });

  const token = jwt.sign(
    {
      _id: user._id,
      Nombre: user.Nombre,
      Rol: user.Rol.Nombre,
      Estatus: user.Estado
    },
    secret
  )

  res.send({ token });

});

router.post('/register', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Usuario.findOne({ Nombre: req.body.Nombre, Estado: true })

  if (user) return res.status(400).send({ Errmessage: "Ya existe un usuario con ese nombre" });

  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(req.body.Clave, salt)
  const rolUsuario = await Rol.findOne({ Nombre: /^usuario$/i, Estado: true })

  if (!rolUsuario) {
    const rol = new Rol({
      Nombre: "usuario",
    });
    rolUsuario = await rol.save();
  }

  let usuario = new Usuario({
    Nombre: req.body.Nombre,
    Clave: pass,
    Rol: rolUsuario._id,
  });
  usuario = await usuario.save();

  const token = jwt.sign(
    {
      _id: usuario._id,
      Nombre: usuario.Nombre,
      Rol: rolUsuario.Nombre,
      Estatus: usuario.Estado
    },
    secret
  )

  res.send({ token });
});

module.exports = router;