import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')))

app.use('/api', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})

export default app
