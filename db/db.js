const Sequelize = require('sequelize')

const seq = new Sequelize('sincro56_politicos', 'sincro56_dev2', 'yD(siqc=.y-k', {
    host: '50.116.87.125',
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