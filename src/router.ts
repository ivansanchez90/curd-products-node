import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvilability,
  updateProduct,
} from './handlers/product'
import { body, validationResult, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 *
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The Product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The Product name
 *          example: 'Cemento Holcim'
 *        price:
 *          type: number
 *          description: The Product price
 *          example: 5900
 *        availability:
 *          type: bollean
 *          description: The Product availability
 *          example: true
 */

/**
 * @swagger
 * /api/products:
 *      get:
 *        summary: Get a list of products
 *        tags:
 *          - Products
 *        description: Return a list of products
 *        responses:
 *          200:
 *            description: Successful response
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Product'
 *
 *
 *
 *
 *
 *
 *
 *
 */

// Routing
router.get('/', getProducts)
router.get(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  (req, res) => {
    getProductById(req, res)
  }
)

router.put(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
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
  body('availability')
    .isBoolean()
    .withMessage('Valor de disponibilidad no válido'),
  handleInputErrors,
  (req, res) => {
    updateProduct(req, res)
  }
)
router.patch(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  (req, res) => {
    updateAvilability(req, res)
  }
)

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

router.delete(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  (req, res) => {
    deleteProduct(req, res)
  }
)

export default router
