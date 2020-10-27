const db = require("./db")

const Intencao = db.seq.define('tb_intencao', {

    nome:{
        type: db.Sequelize.STRING,

    }, 
    cpf:{
        type: db.Sequelize.STRING,

    }, 
    apelido:{
        type: db.Sequelize.STRING,

    }, 
    datanasc:{
        type: db.Sequelize.DATE,

    }, 
    genero:{
        type: db.Sequelize.STRING,

    }, 
    grupo:{
        type: db.Sequelize.STRING,

    }, 
    email:{
        type: db.Sequelize.STRING,

    }, 
    telefone:{
        type: db.Sequelize.STRING,

    }, 
    tipo:{
        type: db.Sequelize.STRING,

    },
    operadora:{
        type: db.Sequelize.STRING,

    },
    eleitor:{
        type: db.Sequelize.STRING,

    },
    escola:{
        type: db.Sequelize.STRING,

    },
    status:{
        type: db.Sequelize.STRING,

    },
    qntfilhos:{
        type: db.Sequelize.STRING,

    },
    estcivil:{
        type: db.Sequelize.STRING,

    },
    profissao:{
        type: db.Sequelize.STRING,

    },
    obs:{
        type: db.Sequelize.STRING,

    }
})

//Intencao.sync({force: true})

module.exports = Intencao