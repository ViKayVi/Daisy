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

app.get('/api/petals', (req, res, next) => {
  petalController.getPetals(req, res).catch(next)
})
app.post('/api/petals', (req, res, next) => {
  petalController.createPetal(req, res).catch(next)
})
app.get('/api/petals/:id', (req, res, next) => {
  petalController.getPetalById(req, res).catch(next)
})
app.delete('/api/petals/:id', (req, res, next) => {
  petalController.deletePetal(req, res).catch(next)
})
app.put('/api/petals/:id', (req, res, next) => {
  petalController.updatePetal(req, res).catch(next)
})

export const handler = serverless(app)
