const express = require('express')
const Usuario = require('../db/Usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Cabo = require('../db/Cabo')
const Intencao = require('../db/Intencao')
const { text } = require('body-parser')
const Candidato = require('../db/Candidato')
const {isCandidato} = require('../helpers/isCandidato')
const localStrategy = require('passport-local').Strategy
const router = express.Router()

router.get('/', (req, res)=>{
    res.redirect('/candidato/cad')
})

router.get('/login', (req, res)=>{
    passport.use(new localStrategy({usernameField: "email", passwordField: 'senha'}, (email, senha, done)=>{
        Candidato.findOne({where: {email: email}}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message: 'Essa conta não existe'})
            }

            bcrypt.compare(senha, usuario.senha, (err, succ)=>{
                if(succ){
                    return done(null, usuario)
                } else {
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })

        })
        passport.serializeUser((usuario, done)=>{

            done(null, usuario.id)
    
        })
    
        passport.deserializeUser((id, done)=>{
            Usuario.findByPk(id).then((usuario)=>{
                done(null , usuario)
            })
    
        })
        
    }))

    res.render('public/login')
})

router.post("/login",  (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: '/candidato/cad',
        failureRedirect: '/candidato/login',
        failureFlash: true
    })(req, res, next)
    
})

router.get('/cad', (req, res)=>{
    res.render('candidato/cad')
})

router.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: '/candidato/cad',
        failureRedirect: '/candidato/login',
        failureFlash: true
    })(req, res, next)
    
})

router.get('/lista/cabo', function(req, res){
    Cabo.findAll({order: [['id', 'DESC']]}).then(function(cabo){
        res.render('candidato/lista-cabo', {
            cabo: cabo
         })
    })
})

router.get('/lista/intencao_voto', function(req, res){
    Intencao.findAll({order: [['id', 'DESC']]}).then(function(intecao){
        res.render('candidato/lista-intencao', {
            intecao: intecao
         })
    })
})

router.get('/cad/cabo_eleitoral', (req, res)=>{
    res.render('candidato/cad-cabo_eleitoral')
})

router.post('/cad/cabo_eleitoral', (req, res) =>{

    var fails = []

    if(!req.body.nome){
        fails.push({text: 'Algo de errado com o nome'})
    } if(!req.body.endereco){
        fails.push({text: 'Algo de errado con o endereço'})
    } if(!req.body.numero){
        fails.push({text: 'Algo de errado com o telefone'})
    } if(!req.body.email){
        fails.push({text: 'Algo de errado com email'})
    } if(!req.body.senha){
        fails.push({text: 'Algo de errado con a senha'})
    } if(!req.body.quantidade_votos){
        fails.push({text: 'Algo de errado com a quantidade de votos'})
    } if(!req.body.regiao_que_atua1){
        fails.push({text: 'Algo de errado com a região que atua'})
    } if(fails.length > 0){
        res.render('candidato/cad-cabo_eleitoral', {fails: fails})
    } else {
        
        Candidato.findOne({where:{email: req.body.email}}).then((usuario)=>{
            if(usuario){
                req.flash('fail_msg', 'Ja existe uma conta com esse email.')
                res.redirect('cabo_eleitoral')
                console.log(usuario)
            } else {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);

            Candidato.create({
            nome: req.body.nome,
            endereco: req.body.endereco,
            numero: req.body.numero,
            ig: req.body.ig,
            fc: req.body.fc,
            tt: req.body.tt,
            email: req.body.email,
            senha: hash,
            quantidade_votos: req.body.quantidade_votos,
            regiao_que_atua1: req.body.regiao_que_atua1,
            regiao_que_atua2: req.body.regiao_que_atua2,
            regiao_que_atua3: req.body.regiao_que_atua3,
            regiao_que_atua4: req.body.regiao_que_atua4,
        }).then(function(){
            req.flash('success_msg', 'Cadastro realizado com sucesso!')
            res.redirect('cabo_eleitoral')
        }).catch(function(err){
            req.flash('fail_msg', 'Cadastro não realizado, tente novamente.')
            res.redirect('cabo_eleitoral')
            console.log(err)
        })

        }
    })

}
    

})

router.get('/cad/intencao_votos', (req, res) =>{
    res.render('candidato/cad-intencao_votos')
})

router.post('/cad/intencao_votos', (req, res) =>{

    var fails = []

    if(!req.body.nome){
        fails.push({text: 'Algo de errado com o nome.'})
    }
    if(!req.body.residencia){
        fails.push({text: 'Algo de errado com a residencia.'})
    }
    if(!req.body.cep){
        fails.push({text: 'Algo de errado com o CEP.'})
    }
    if(!req.body.cidade){
        fails.push({text: 'Algo de errado com a cidade.'})
    }
    if(!req.body.rg){
        fails.push({text: 'Algo de errado com o RG.'})
    }
    if(!req.body.cpf){
        fails.push({text: 'Algo de errado com o CPF.'})
    }if (fails.length > 0){
        res.render('candidato/cad-intencao_votos', {fails: fails})
    } else {

        Candidato.create({
            nome: req.body.nome,
            residencia: req.body.residencia,
            cep: req.body.cep,
            cidade: req.body.cidade,
            rg: req.body.rg,
            cpf: req.body.cpf,
            obs: req.body.obs,
            ig: req.body.ig,
            tt: req.body.ig,
            fc: req.body.fc
        }).then(function(){
            req.flash('success_msg', 'Cadastro realizado com sucesso!')
            res.redirect('intencao_votos')
        }).catch(function(err){
            req.flash('fail_msg', 'Cadastro não realizado, tente novamente.')
            res.redirect('intencao_votos')
            console.log(err)
        })

    }

})

router.post('/cabo/delete', (req, res) =>{
    var id = req.body.id

    if(id != undefined){
        Cabo.destroy({
            where:{
                id: id
            }
        }).then(()=>{
            req.flash('primary_msg', 'Apagado com sucesso.')
            res.redirect('/candidato/lista/cabo')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/candidato/lista/cabo')
    }
})

router.post('/intencao/delete', (req,  res) =>{
    var id = req.body.id

    if(id != undefined){
        Intencao.destroy({
            where:{
                id: id
            }
        }).then(()=>{
            req.flash('primary_msg', 'Apagado com sucesso.')
            res.redirect('/candidato/lista/intencao_voto')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/candidato/lista/intencao_voto')
    }
})

router.get('/intencao/edit/:id', (req, res) =>{
    var id = req.params.id 
    Intencao.findByPk(id).then(intencao =>{
        if(intencao != undefined){

            res.render('candidato/edit-intencao', {intencao: intencao})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/candidato/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/candidato/cad')
    })
})

router.get('/cabo/edit/:id', (req, res) =>{
    var id = req.params.id 
    Cabo.findByPk(id).then(cabo =>{
        if(cabo != undefined){

            res.render('candidato/edit-intencao', {cabo: cabo})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/candidato/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/candidato/cad')
    })
})

router.post('/intencao/update', (req, res)=>{
    var {
        id,
        nome,
        email,
    } = req.body

    Intencao.update({
        nome: nome,
        email: email
    },{
        where:{
            id: id
        }
    }).then(() =>{
        req.flash('primary_msg', 'Atualizado com sucesso.')
        res.redirect('/candidato/lista/intencao_voto')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/candidato/lista/intencao_voto')
    })
})

router.post('/cabo/update', (req, res)=>{
    var {
        id,
        nome,
        email,
    } = req.body

    Cabo.update({
        nome: nome,
        email: email
    },{
        where:{
            id: id
        }
    }).then(() =>{
        req.flash('primary_msg', 'Atualizado com sucesso.')
        res.redirect('/candidato/lista/cabo')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/candidato/lista/cabo')
    })
})

module.exports = router