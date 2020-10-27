const express = require('express')
const Usuario = require('../db/Usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Cabo = require('../db/Cabo')
const Intencao = require('../db/Intencao')
const { text } = require('body-parser')
const Candidato = require('../db/Candidato')
const {isCabo} = require('../helpers/isCabo')
const localStrategy = require('passport-local').Strategy
const router = express.Router()


router.get('/', (req, res)=>{
    res.redirect('/cabo/cad')
})

router.get('/login', (req, res)=>{
    passport.use(new localStrategy({usernameField: "email", passwordField: 'senha'}, (email, senha, done)=>{
        Cabo.findOne({where: {email: email}}).then((usuario)=>{
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
        successRedirect: '/cabo/cad',
        failureRedirect: '/cabo/login',
        failureFlash: true
    })(req, res, next)
    
})

router.get('/cad', (req, res)=>{
    res.render('cabo/cad')

})

router.get('/lista/intencao_voto', function(req, res){
    Intencao.findAll({order: [['id', 'DESC']]}).then(function(intecao){
        res.render('cabo/lista-intencao', {
            intecao: intecao
         })
    })
})


router.post("/login", (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: '/cabo/cad',
        failureRedirect: '/cabo/login',
        failureFlash: true
    })(req, res, next)
    
})

router.get('/cad/intencao_votos', (req, res) =>{
    res.render('cabo/cad-intencao_votos')
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
        res.render('cabo/cad-intencao_votos', {fails: fails})
    } else {

        Intencao.create({
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

router.post('/intencao/delete', (req,  res) =>{
    var id = req.body.id

    if(id != undefined){
        Intencao.destroy({
            where:{
                id: id
            }
        }).then(()=>{
            req.flash('primary_msg', 'Apagado com sucesso.')
            res.redirect('/cabo/lista/intencao_voto')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/cabo/lista/intencao_voto')
    }
})

router.get('/intencao/edit/:id', (req, res) =>{
    var id = req.params.id 
    Intencao.findByPk(id).then(intencao =>{
        if(intencao != undefined){

            res.render('cabo/edit-intencao', {intencao: intencao})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/cabo/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/cabo/cad')
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
        res.redirect('/cabo/lista/intencao_voto')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/cabo/lista/intencao_voto')
    })
})

module.exports = router