const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { body } = require('express-validator');

// POST /api/cart/add - Add item to cart
router.post('/add', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('product').notEmpty().withMessage('Product ID is required')
], cartController.addToCart);

// GET /api/cart/:userId - Get all items in a user's cart
router.get('/:userId', cartController.getCart);

// DELETE /api/cart/:userId/:itemId - Remove item from cart
router.delete('/:userId/:itemId', cartController.removeFromCart);

module.exports = router;
