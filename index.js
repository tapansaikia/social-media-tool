import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDirectoryPath = path.join(__dirname, 'client/build')

// middlewares
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(cookieParser()) // parse cookies
app.use(express.static(publicDirectoryPath)) // serve static files
// Middleware to enable CORS [TODO: revisit this later for production]
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // Allow specified HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept') // Allow specified headers
  next()
})

// routes
const setupRoutes = async () => {
    try {
      const routeFiles = await readdir('./routes')
      await Promise.all(routeFiles.map(async (r) => {
        const routeModule = await import(`./routes/${r}`)
        app.use('/api/v1', routeModule.default || routeModule)
      }))
    } catch (error) {
      console.error('Error reading or importing routes:', error)
    }
}
setupRoutes()

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'))
})

     
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    }  
)