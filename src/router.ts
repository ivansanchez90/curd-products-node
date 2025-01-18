import { Router } from 'express'
import { createProduct, getProducts } from './handlers/product'
import { body, validationResult } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()
// Routing
router.get('/', getProducts)

router.post(
  '/',
  //Validación
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacío'),

  body('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacío')
    .custom((value) => value > 0)
    .withMessage('Precio no válido'),
  handleInputErrors,
  createProduct
  // (req, res) => {
  //   createProduct(req, res)
  // }
)

router.put('/', (req, res) => {
  res.json('Desde PUT')
})

router.patch('/', (req, res) => {
  res.json('Desde PATCH')
})

router.delete('/', (req, res) => {
  res.json('Desde DELETE')
})

export default router
