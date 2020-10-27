const db = require('./db')

const Cabo = db.seq.define('tb_cabo', {

    nome:{
        type: db.Sequelize.STRING,
        require: true,
        allowNull: false
    },

    endereco:{
        type: db.Sequelize.STRING,
        require: true,
        allowNull: false
    },

    numero:{
        type: db.Sequelize.INTEGER,
        require: true,
        allowNull: false
    },

    email:{
        type: db.Sequelize.STRING,
        require: true,
        allowNull: false
    },

    quantidade_votos:{
        type: db.Sequelize.INTEGER,
        require: true,
        allowNull: false
    },
    senha:{
        type: db.Sequelize.STRING,
        required: true
    },
    ig:{
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'não informado'
    },
    fc:{
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'não informado'
    },
    tt:{
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'não informado'
    },

    regiao_que_atua1:{
        type: db.Sequelize.STRING,
        allowNull: false,
        require: true
    },
    regiao_que_atua2:{
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'não informado'
    },
    regiao_que_atua3:{
        type: db.Sequelize.STRING,
        allowNull: false,
        defaultValue: 'não informado'
    },
    regiao_que_atua4:{
        type: db.Sequelize.STRING,
        defaultValue: 'não informado'
    },
    isCabo:{
        type: db.Sequelize.INTEGER,
        defaultValue: 2
    }

})

//Cabo.sync({force: true})

module.exports = Cabo

