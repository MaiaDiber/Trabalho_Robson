import 'dotemv/config'
import express from 'express'
import cors from 'cors'

const servidor = express()
servidor.use(express.json())
servidor.use(cors())


servidor.listen(process.env.PORTA, () => console.log(`A porta subiu ${process.env.PORTA}`))