import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Rotas from './Rotas.js'

const servidor = express()
servidor.use(express.json())

servidor.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

Rotas(servidor)

servidor.listen(process.env.PORTA, () => 
    console.log(`A porta subiu ${process.env.PORTA}`)
)
