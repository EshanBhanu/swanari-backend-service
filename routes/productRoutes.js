const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { body } = require('express-validator');

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProductById);

// GET /api/products/category/:categoryId - Get products under a category
router.get('/category/:categoryId', productController.getProductsByCategory);

// POST /api/products - Add new product
router.post('/', [
  body('name').notEmpty().trim().withMessage('Product name is required'),
  body('description').notEmpty().trim().withMessage('Product description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required')
], productController.addProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
