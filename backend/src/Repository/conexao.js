import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PWD,
    database: process.env.DB,
})

console.log('-- CONEXÃO SUCEDIDA COM O BANCO --')


export { connection }