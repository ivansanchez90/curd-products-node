import express from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerSpec from './config/swagger'
import swatterUI from 'swagger-ui-express'

// Conectar a base de datos

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    // console.log(colors.blue('Conexión exitosa a la BD'))
  } catch (error) {
    console.log(error)
    console.log(colors.red('Hubo un error al conectar a la BD'))
  }
}

connectDB()

//Instancia express
const server = express()

//Permitir Conexión
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'))
    }
  },
}
server.use(cors(corsOptions))

// Leer datos de formulario
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// DOCS
server.use('/docs', swatterUI.serve, swatterUI.setup(swaggerSpec))

export default server
