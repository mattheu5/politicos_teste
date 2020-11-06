const Sequelize = require('sequelize')

const seq = new Sequelize('politicos', 'admin', 'dev313233', {
    host: 'politicos.c8fpb19iwz53.sa-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    },
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    logging: console.log,
}) 

module.exports={
    Sequelize: Sequelize,
    seq: seq
}