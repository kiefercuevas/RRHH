function IsAdmin(req, res, next) {
  if (req.user.Rol !== "ADMIN") return res.status(403).render('errPage', { ErrMessage: "Acceso denegado", user: req.user });
  next();
}

module.exports = IsAdmin;