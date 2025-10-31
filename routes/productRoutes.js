const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { body } = require('express-validator');

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/category/:categoryId - Get products under a category (must be before /:productId)
router.get('/category/:categoryId', productController.getProductsByCategory);

// GET /api/products/:productId - Get product by productId
router.get('/:productId', productController.getProductById);

// POST /api/products - Add new product
router.post('/', [
  body('productId').notEmpty().trim().withMessage('Product id is required'),
  body('name').notEmpty().trim().withMessage('Product name is required'),
  body('description').notEmpty().trim().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().trim().withMessage('Category is required')
], productController.addProduct);

// PUT /api/products/:productId - Update product
router.put('/:productId', productController.updateProduct);

// DELETE /api/products/:productId - Delete product
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
