const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const moment = require('moment')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
var favicon = require('serve-favicon')
const admin = require('./routes/admin')
const cabo = require('./routes/cabo')
const candidato = require('./routes/candidato')
const cookieParser = require('cookie-parser');
const passport = require("passport")

app.use(cookieParser('1234'))
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {

    res.locals.success_msg = req.flash('success_msg')
    res.locals.fail_msg = req.flash('fail_msg')
    res.locals.primary_msg = req.flash('primary_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()

})
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())

app.set("view engine", 'handlebars')

app.engine(
    "handlebars",
    handlebars({
      defaultLayout: "main",
    })
  )

app.get('/', function(req, res){
    res.send('home')
})

app.get('/termo-servico', (req, res)=>{
    res.render('public/termos')
})

app.use('/admin', admin)
app.use('/cabo', cabo)
app.use('/candidato', candidato)

                                
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Servidor rodando na porta: '+ port);
});
