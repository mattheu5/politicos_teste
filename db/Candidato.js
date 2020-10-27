const db = require("./db")

const Candidato = db.seq.define('tb_candidato', {

    nome:{
        type: db.Sequelize.STRING,
        
    },
    partido:{
        type: db.Sequelize.STRING,
        
    },
    cidade:{
        type: db.Sequelize.STRING,
        
    },
    votos:{
        type: db.Sequelize.INTEGER,
        
    },
    email:{
        type: db.Sequelize.STRING,
         
    },
    numero:{
        type: db.Sequelize.INTEGER,
        
    },
    ig:{
        type: db.Sequelize.STRING,
        defaultValue: 'não informado'
    },
    fc:{
        type: db.Sequelize.STRING,
        defaultValue: 'não informado'
    },
    tt:{
        type: db.Sequelize.STRING,
        defaultValue: 'não informado'
    },
    senha:{
        type: db.Sequelize.STRING,
        
    },
    foto:{
        type: db.Sequelize.BLOB,
        defaultValue: 'não informado',
    },
    isCandidato:{
        type: db.Sequelize.INTEGER,
        defaultValue: 3
    }
})

//Candidato.sync({force: true})

module.exports = Candidato