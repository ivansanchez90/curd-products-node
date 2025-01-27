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
 */

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    tags:
 *      - Products
 *    description: Return a product based onj its unique ID
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The ID of the product to retrieve
 *      required: true
 *      squema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Succesful Response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Not found
 *      400:
 *        description: Bad Request - Invalid ID
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
/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Update a product with user input
 *    tags:
 *      - Products
 *    description: Return the updated product
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        squema:
 *          type: integer
 *    requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Ladrillo Ceramico de 12x18x25"
 *             price:
 *               type: number
 *               example: 399
 *             availability:
 *               type: boolean
 *               example: true
 *    responses:
 *       200:
 *         description: Succesful resposne
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid ID or Invalid input Data
 *       404:
 *         description: Product Not Found
 */

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
/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        squema:
 *          type: integer
 *    responses:
 *       200:
 *         description: Succesful resposne
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid ID or Invalid input Data
 *       404:
 *         description: Product Not Found
 *
 */

router.patch(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  (req, res) => {
    updateAvilability(req, res)
  }
)

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Create a new products
 *    tags:
 *      - Products
 *    description: Return a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Ladrillo Ceramico de 12x18x25"
 *              price:
 *                type: number
 *                example: 399
 *    responses:
 *      201:
 *          description: Succesful resposne
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - invalid input data
 * */

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

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Deletes a product by a given ID
 *    tags:
 *      - Products
 *    description: Returns a confirmation message
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to delete
 *        required: true
 *        squema:
 *          type: integer
 *    responses:
 *       200:
 *         description: Succesful resposne
 *         content:
 *           application/json:
 *             schema:
 *              type: string
 *              value: 'Producto Eliminado'
 *       400:
 *         description: Bad Request - Invalid ID or Invalid input Data
 *       404:
 *         description: Product Not Found
 */

router.delete(
  '/:id',
  param('id').isInt().withMessage('ID no válido'),
  handleInputErrors,
  (req, res) => {
    deleteProduct(req, res)
  }
)

export default router
