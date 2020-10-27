const express = require('express')
const Usuario = require('../db/Usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Cabo = require('../db/Cabo')
const Intencao = require('../db/Intencao')
const { text } = require('body-parser')
const Candidato = require('../db/Candidato')
const localStrategy = require('passport-local').Strategy
const router = express.Router()
const multer = require('multer')
const path = require('path')
const moment = require('moment')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + moment().format("DD-MM-YYYY-h-mm-ss") + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
})

const upload = multer({
    storage: storage, 
    fileFilter:  function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(null, false, {error: '13'})
        }
        cb(null, true)
    }
})

router.get('/',  function(req, res){
    res.redirect('/admin/cad')
})

router.get('/login', (req, res)=>{
    passport.use(new localStrategy({usernameField: "email", passwordField: 'senha'}, (email, senha, done)=>{
        Usuario.findOne({where: {email: email}}).then((usuario)=>{
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
        successRedirect: '/admin/cad',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next)
    
})

router.post('/admin/cabo/delete', (req, res)=>{

    var id = req.body.id

    if(id != undefined){
            Cabo.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect('cabo')
            })
        }else{
            res.redirect('cabo')
        }
})

router.get('/lista/candidato', function(req, res){
    Candidato.findAll({order: [['id', 'DESC']]}).then(function(candidato){
        res.render('admin/lista-candidato', {
            candidato: candidato
         })
    })
})

router.get('/lista/cabo', function(req, res){
    Cabo.findAll({order: [['id', 'DESC']]}).then(function(cabo){
        res.render('admin/lista-cabo', {
            cabo: cabo
         })
    })
})

router.get('/lista/intencao_voto', function(req, res){
    Intencao.findAll({order: [['id', 'DESC']]}).then(function(intecao){
        res.render('admin/lista-intencao', {
            intecao: intecao
         })
    })
})


router.get('/usuario', (req, res) =>{
    res.render('admin/cad-usuario')
})

router.post('/usuario', (req, res) =>{

    var {nome, email, senha, senha1} = req.body

    var fails = []

    if(!nome){
        fails.push({text: 'Tem algo de errado com o nome'})
    }
    if(!email){
        fails.push({text: 'Tem algo de errado com o email'})
    }
    if(!senha){
        fails.push({text: 'Tem algo de errado com o senha'})
    } 
    if(senha.length < 4){
        fails.push({text: 'Senha muito curta'})
    } 
    if(senha != senha1){
        fails.push({text: 'As senhas são diferentes'})
    } if(fails.length > 0){
        res.render('admin/cad-usuario', {fails: fails})
    } else {
        Usuario.findOne({where: {email: email}}).then((usuario)=>{
            if(usuario){
                req.flash('fail_msg', 'Ja existe uma conta com esse email.')
                res.redirect('usuario')
            } else {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(senha, salt);
               
                Usuario.create({
                    nome: nome,
                    email: email,
                    senha: hash,
                }).then((senha)=>{
                    console.log(senha)
                    req.flash('success_msg', 'Cadastro realizado com sucesso!')
                    res.redirect('usuario')
                }).catch((err)=>{
                    req.flash('fail_msg', 'Cadastro não realizado, tente novamente')
                    res.redirect('usuario')
                })
            }
        })
    }

})


router.get('/cad',(req, res) =>{
    res.render('admin/cad')
})

router.get('/cad/candidato', (req, res)=>{
    res.render('admin/cad-candidato')
})

router.post('/cad/candidato', upload.single('file'), (req, res)=>{

    var fails = []

    if(!req.body.nome || req.body.name < 3){
        fails.push({text: "Algo errado com o nome."})
    } if(!req.body.partido){
        fails.push({text: 'Algo de errado com o partido.'})
    } if(!req.body.cidade){
        fails.push({text: 'Algo de errado com a cidade.'})
    } if(!req.body.votos){
        fails.push({text: 'Algo de errado com os votos.'})
    } if(!req.body.email){
        fails.push({text: 'Algo de errado com o email.'})
    } if(!req.body.numero){
        fails.push({text: 'Algo de errado com o numero de telefone.'})
    } if(!req.body.senha){
        fails.push({text: 'Algo de errado com a senha.'})
    } if(!req.body.email){
        fails.push({text: 'Algo de errado com o email.'})
    } if(fails.length > 100){
        res.render('admin/cad-candidato', {fails: fails})
    }
     else {

        Candidato.findOne({where:{email: req.body.email}}).then((usuario)=>{
            if(usuario){
                req.flash('fail_msg', 'Ja existe uma conta com esse email.')
                res.redirect('candidato')
            } else{

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);

        Candidato.create({
            nome: req.body.nome,
            partido: req.body.partido,
            cidade: req.body.cidade,
            votos: req.body.votos,
            email: req.body.email,
            numero: req.body.numero,
            senha: hash,
            ig: req.body.ig,
            fc: req.body.fc,
            tt: req.body.tt,
            foto: req.body.foto
        }).then(function(){
            req.flash('success_msg', 'Cadastro realizado com sucesso!')
            res.redirect('candidato')
        }).catch(function(err){
            req.flash('fail_msg', 'Cadastro não realizado, tente novamente.')
            res.redirect('candidato')
            console.log(err)
        })
    }
})
    }

})

router.get('/cad/cabo', (req, res)=>{
    res.render('admin/cad-cabo_eleitoral')
})

router.post('/cad/cabo',(req, res) =>{

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
        res.render('admin/cad-cabo_eleitoral', {fails: fails})
    } else {
        
        Cabo.findOne({where:{email: req.body.email}}).then((usuario)=>{
            if(usuario){
                req.flash('fail_msg', 'Ja existe uma conta com esse email.')
                res.redirect('cabo')
                console.log(usuario)
            } else {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);

        Cabo.create({
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
            res.redirect('cabo')
        }).catch(function(err){
            req.flash('fail_msg', 'Cadastro não realizado, tente novamente.')
            res.redirect('cabo')
            console.log(err)
        })

        }
    })

}


})

router.get('/cad/intencao_votos',(req, res) =>{
    res.render('admin/cad-intencao_votos')
})

router.post('/cad/intencao_votos',(req, res) =>{

    var {
        nome, 
        cpf, 
        apelido, 
        datanasc, 
        genero, 
        grupo, 
        email, 
        telefone, 
        tipo,
        operadora,
        eleitor,
        escola,
        status,
        qntfilhos,
        estcivil,
        profissao,
        obs
    } = req.body

    var fails = []

    if(!nome){
        fails.push({text: 'Algo de errado com o nome.'})
    }
    /*if(!cpf){
        fails.push({text: 'Algo de errado com a residencia.'})
    }
    if(!datanasc){
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
    }*/if (fails.length > 0){
        res.render('admin/cad-intencao_votos', {fails: fails})
    } else {

        Intencao.create({
            nome: nome, 
            cpf: cpf, 
            apelido: apelido, 
            datanasc: datanasc, 
            genero: genero, 
            grupo: grupo, 
            email: email, 
            telefone: telefone, 
            tipo: tipo,
            operadora: operadora,
            eleitor: eleitor,
            escola: escola,
            status: status,
            qntfilhos: qntfilhos,
            estcivil: estcivil,
            profissao: profissao,
            obs: obs
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
            res.redirect('/admin/lista/intencao_voto')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/admin/lista/intencao_voto')
    }
})

router.post('/candidato/delete', (req, res) =>{
    var id = req.body.id

    if(id != undefined){
        Candidato.destroy({
            where:{
                id: id
            }
        }).then(()=>{
            req.flash('primary_msg', 'Apagado com sucesso.')
            res.redirect('/admin/lista/candidato')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/admin/lista/candidato')
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
            res.redirect('/admin/lista/cabo')
        })
    }else{
        req.flash('fail_msg', 'Não foi apagado, tente novamente.')
        res.redirect('/admin/lista/cabo')
    }
})

router.get('/intencao/edit/:id', (req, res) =>{
    var id = req.params.id 
    Intencao.findByPk(id).then(intencao =>{
        if(intencao != undefined){

            res.render('admin/edit-intencao', {intencao: intencao})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/admin/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/cad')
    })
})

router.get('/candidato/edit/:id', (req, res) =>{
    var id = req.params.id 
    Candidato.findByPk(id).then(candidato =>{
        if(candidato != undefined){

            res.render('admin/edit-candidato', {candidato: candidato})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/admin/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/cad')
    })
})

router.get('/cabo/edit/:id', (req, res) =>{
    var id = req.params.id 
    Cabo.findByPk(id).then(cabo =>{
        if(cabo != undefined){

            res.render('admin/edit-cabo_eleitoral', {cabo: cabo})

        } else{
            req.flash('fail_msg', 'Algo deu errado, tente novamente.')
            res.redirect('/admin/cad')
        }
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/cad')
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
        res.redirect('/admin/lista/intencao_voto')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/lista/intencao_voto')
    })
})

router.post('/candidato/update', (req, res)=>{
    var {
        id,
        nome,
        email,
    } = req.body

    Candidato.update({
        nome: nome,
        email: email
    },{
        where:{
            id: id
        }
    }).then(() =>{
        req.flash('primary_msg', 'Atualizado com sucesso.')
        res.redirect('/admin/lista/candidato')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/lista/candidato')
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
        res.redirect('/admin/lista/cabo')
    }).catch(err =>{
        req.flash('fail_msg', 'Algo deu errado, tente novamente.')
        res.redirect('/admin/lista/cabo')
    })
})

module.exports = router 