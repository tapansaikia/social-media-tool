import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { readdir } from 'fs/promises';

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

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

     
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    }  
);