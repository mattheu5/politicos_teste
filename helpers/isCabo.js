module.exports = {
    isCabo: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdm == 2){
            return next()
        } else {
            req.flash('fail_msg', 'Você precisa ser um Cabo Eleitoral para acessar essa página.')
            res.redirect('/')
        }
    }
}