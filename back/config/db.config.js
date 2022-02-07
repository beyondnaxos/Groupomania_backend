module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: process.env.LENOM,
    DB: 'testdb',
    dialect: 'mysql',
    pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
}
