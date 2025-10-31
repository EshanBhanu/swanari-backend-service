const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { body } = require('express-validator');

// POST /api/orders - Create a new order
router.post('/', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerName').notEmpty().trim().withMessage('Customer name is required')
], orderController.createOrder);

// GET /api/orders/:userId - Fetch all orders for a user
router.get('/:userId', orderController.getOrders);

module.exports = router;
