const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const connection = "mongodb://localhost:27017/Recursos_humanos";
const Port = process.env.PORT || 3000;
const path = require('path');
const authMiddleware = require('./middleware/auth');

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());

//routes
const idiomas = require('./routes/Idioma');
const capacitaciones = require('./routes/Capacitacion');
const departamentos = require('./routes/Departamento');
const candidatos = require('./routes/Candidato');
const puestos = require('./routes/Puesto');
const competencias = require('./routes/Competencia');
const empleados = require('./routes/empleados');
const usuarios = require('./routes/usuario');
const experiencias = require('./routes/ExperienciaLaboral');
const auth = require('./routes/auth');

//add routes
app.use('/api/idiomas', idiomas);
app.use('/api/capacitaciones', capacitaciones);
app.use('/api/departamentos', departamentos);
app.use('/api/candidatos', candidatos);
app.use('/api/puestos', puestos);
app.use('/api/competencias', competencias);
app.use('/api/empleados', empleados);
app.use('/api/usuarios', usuarios);
app.use('/api/experiencias', experiencias);
app.use('/api/auth', auth);


//add view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//default
app.get('/api/', authMiddleware, (req, res) => {
  res.render('index', { title: 'index', user: req.user });
})

mongoose.connect(connection, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.log('Connection to mongodb failed', err));


app.listen(Port, () => console.log(`Connected to port ${Port}`));


/*
//exercise 1
  // return await Course
  //   .find({ isPublished: true, tags: 'backend' })
  //   .sort({ name: 1 })
  //   .select({ name: 1, author: 1 });

  //exercise 2
  // return await Course
  //   .find({ isPublished: true })
  //   .or([{ tags: 'frontend' }, { tags: 'backend' }])
  //   .sort({ price: -1 })
  //   .select({ name: 1, author: 1, price: 1 })

  exercise 3
  return await Course
    .find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*///i //}]);
