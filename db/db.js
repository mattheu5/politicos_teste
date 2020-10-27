const Sequelize = require('sequelize')

const seq = new Sequelize('sincronisoluco', 'sincronisoluco', 'mt1233211233mt', {
    host: 'mysql.sincronisolucoes.com.br',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
}) 

module.exports={
    Sequelize: Sequelize,
    seq: seq
}