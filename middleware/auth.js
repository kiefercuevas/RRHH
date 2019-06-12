const jwt = require('jsonwebtoken');
const { secret } = require('../helpers/globalparams');

function auth(req, res, next) {

  let token = req.query.token;

  if (!token || token === 'null') token = req.header('x-auth-token');

  if (!token) return res.status(401).render('errPage', { ErrMessage: "Acceso denegado, no posee el token de autorizacion", clearToken: true });

  try {
    const payload = jwt.verify(token, secret);

    if (!payload.Estatus) return res.status(401).render('errPage', { ErrMessage: "Acceso denegado, usuario desactivado",user:req.user });

    req.user = payload;

    next();
  } catch (ex) {
    res.status(400).render('errPage', { ErrMessage: 'El token es invalido' });
  }
}


module.exports = auth;