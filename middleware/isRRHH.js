function IsRRHH(req, res, next) {
  const ROL = req.user.Rol;
  const condition = ROL === "ADMIN" || ROL === "RRHH";

  if (!condition)
    return res.status(403).render('errPage', { ErrMessage: "Acceso denegado", user: req.user });

  next();
}

module.exports = IsRRHH;