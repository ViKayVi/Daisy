import express, { Express } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import { petalController } from './controllers/petalController'

dotenv.config()

const app: Express = express()
const port = process.env.VITE_BACKEND_PORT

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.get('/api/petals', petalController.getPetals)

app.listen(port, () => {
  console.log(`🌼 Server is running at http://localhost:${port}`)
})
