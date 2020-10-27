const db = require('./db')
const Cabo = require('./Cabo')
const Candidato = require('./Candidato')
const Intencao = require('./Intencao');

const Usuario = db.seq.define('tb_usuarios',{
    id:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome:{
        type: db.Sequelize.STRING,
        required: true
    },
    email:{
        type: db.Sequelize.STRING,
        required: true
    },
    senha:{
        type: db.Sequelize.STRING,
        required: true
    },
    isAdm:{
        type: db.Sequelize.INTEGER,
        defaultValue: 1
    }
})


//Usuario.sync({force: true})

module.exports = Usuario