const Sequelize = require('sequelize')

const seq = new Sequelize('www2', 'www2', 'mt1233211233mt', {
    host: 'www2.c8fpb19iwz53.sa-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    }
}) 
module.exports={
    Sequelize: Sequelize,
    seq: seq
}