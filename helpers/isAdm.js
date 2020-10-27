module.exports = {
    isAdm: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdm == 1){
            return next()
        } else {
            req.flash('fail_msg', 'Você precisa ser um ADM para acessar essa página.')
            res.redirect('/')
        }
    }
}