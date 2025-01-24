import dotenv from 'dotenv'
import request from 'supertest'
import server, { connectDB } from '../../src/server'
import db from '../../src/config/db'
dotenv.config()

describe('POST /api/products', () => {
  test('should display validatin errors', async () => {
    const response = await request(server).post('/api/products').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(4)
  })

  test('should return error when price is different to 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Nuevo producto test',
      price: -500,
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Precio no válido')
  })

  test('should create a new product', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Cal común - test',
      price: 3900,
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(200)
    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('GET /api/products', () => {
  test('should check if api/products url exists', async () => {
    const response = await request(server).get('/api/products')
    expect(response.status).not.toBe(404)
  })
  test('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toHaveProperty('data')

    expect(response.body).not.toHaveProperty('errors')
    expect(response.status).not.toBe(404)
  })
})

describe('GET /api/products/:id', () => {
  test('should return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).get(`/api/products/${productId}`)
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Producto No Encontrado')
  })
  test('should check a valid ID in the URL', async () => {
    const response = await request(server).get('/api/products/not-valid-url')
    expect(response.status).not.toBe(200)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toMatch('ID no válido')
  })
  test('get a JSON response for a single product', async () => {
    const response = await request(server).get('/api/products/1')
    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('errors')
    expect(response.body).toHaveProperty('data')
  })
})

describe('PUT /api/products/:id', () => {
  test('should check a valid ID in the URL', async () => {
    const response = await request(server)
      .put('/api/products/not-valid-url')
      .send({
        name: 'Producto Prueba',
        availability: true,
        price: 300,
      })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID no válido')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })
  test('should return a 404 resoponse for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'test producto 2',
        availability: true,
        price: 300,
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto No Encontrado')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('should update an existing product with valid data', async () => {
    const productId = 1
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'test producto 2',
        availability: true,
        price: 300,
      })

    expect(response.status).toBe(200)
    expect(response.body.error).not.toBe('Producto No Encontrado')
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(404)
  })
  test('should display validation error messages when updating a product', async () => {
    const response = await request(server).put('/api/products/1').send({})
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(5)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  test('should validate that the price is greater than 0', async () => {
    const response = await request(server).put('/api/products/1').send({
      name: 'Producto Prueba',
      availability: true,
      price: 0,
    })
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Precio no válido')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })
})

describe('DELETE /api/products/:id', () => {
  test('Should check a valid ID', async () => {
    const response = await request(server).delete('/api/products/not-valid')
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].msg).toBe('ID no válido')
  })
  test('should return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).delete(`/api/products/${productId}`)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto No Encontrado')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })
  test('should delete a product', async () => {
    const productId = 1
    const response = await request(server).delete(`/api/products/${productId}`)
    expect(response.status).toBe(200)
    expect(response.body.data).toBe('Producto Eliminado')

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('PATCH /api/products/:id', () => {
  test('should return a 404 response for a non-existing product', async () => {
    const productId = 2000
    const response = await request(server).patch(`/api/products/${productId}`)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto No Encontrado')
    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })
  test('should update the prodcut availability', async () => {
    await request(server).post('/api/products').send({
      name: 'Cal común - test 2',
      price: 3900,
    })
    const productId = 2
    const response = await request(server).patch(`/api/products/${productId}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.availability).toBe(false)

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')
  })
})
