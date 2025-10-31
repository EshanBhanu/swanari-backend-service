const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { body } = require('express-validator');

// GET /api/categories - Fetch all categories
router.get('/', categoryController.getAllCategories);

// POST /api/categories - Add new category
router.post('/', [
  body('name').notEmpty().trim().withMessage('Category name is required')
], categoryController.addCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
