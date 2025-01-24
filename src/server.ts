import express from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
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

// Leer datos de formulario
server.use(express.json())

server.use('/api/products', router)

// DOCS
server.use('/docs', swatterUI.serve, swatterUI.setup(swaggerSpec))

export default server
