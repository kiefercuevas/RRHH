const {Candidato} = require('../models/Candidato');

async function hasCandidato(req, res, next) {
    const candidato = await Candidato.findOne({Usuario:req.user._id})
    if (candidato) return res.status(403).render('errPage', { ErrMessage: "Ya aplico como candidato", user: req.user });
    next();
  }
  
  module.exports = hasCandidato;