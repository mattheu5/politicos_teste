module.exports = {
    isCandidato: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdm == 3){
            return next()
        } else {
            req.flash('fail_msg', 'Você precisa ser um Candidato para acessar essa página.')
            res.redirect('/')
        }
    }
}