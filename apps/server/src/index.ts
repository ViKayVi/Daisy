import express, { Express } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import petalController from './controllers/petalController'

dotenv.config()

const app: Express = express()
const port = process.env.VITE_BACKEND_PORT

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.get('/api/petals', async (req, res) => {
  try {
    await petalController.getPetals(req, res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/petals', async (req, res) => {
  try {
    await petalController.createPetal(req, res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/api/petals/:id', async (req, res) => {
  try {
    await petalController.getPetalById(req, res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/api/petals/:id', async (req, res) => {
  try {
    await petalController.deletePetal(req, res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/petals', (req, res) => {
  petalController.createPetal(req, res).catch((err: any) => {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  })
})

app.get('/api/petals/:id', (req, res) => {
  petalController.getPetalById(req, res).catch((err: any) => {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  })
})

app.listen(port, () => {
  console.log(`🌼 Server is running at http://localhost:${port}`)
})
