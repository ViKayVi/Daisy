import express, { Express } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import serverless from 'serverless-http'
import petalController from '../src/controllers/petalController' // ajusta ruta si hace falta

dotenv.config()

const app: Express = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.get('/api/petals', petalController.getPetals)
app.post('/api/petals', petalController.createPetal)
app.get('/api/petals/:id', petalController.getPetalById)
app.delete('/api/petals/:id', petalController.deletePetal)
app.put('/api/petals/:id', petalController.updatePetal)

export const handler = serverless(app)
