import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDirectoryPath = path.join(__dirname, 'client/build')

// middlewares
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(express.static(publicDirectoryPath))

// routes
app.use('/', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'))
})

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

     
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    }  
);