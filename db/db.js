const Sequelize = require('sequelize')

const seq = new Sequelize('database-1', 'admin', 'dev313233', {
    host: 'database-1.c8fpb19iwz53.sa-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
}) 

module.exports={
    Sequelize: Sequelize,
    seq: seq
}