/*const localStrategy = require('passport-local').Strategy
const passport = require('passport')
const db = require("../db/db")
const bcrypt = require("bcryptjs")
const Cabo = require("../db/Cabo")


module.exports = function(passport){
    
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
    }))

    passport.serializeUser((usuario, done)=>{

        done(null, usuario)

    })

    passport.deserializeUser((usuario, done)=>{

            done(null, usuario)

    })
 
    
}