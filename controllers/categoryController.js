const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { categoryId, name, description } = req.body;
    const category = new Category({ categoryId, name, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    // handle duplicate key error (unique fields)
    if (error.name === 'MongoError' && error.code === 11000) {
      // determine which field caused duplicate
      const dupKey = Object.keys(error.keyValue || {})[0];
      return res.status(400).json({ message: `Duplicate ${dupKey}: ${error.keyValue[dupKey]}` });
    }

    res.status(400).json({ message: 'Error adding category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findOneAndDelete({ categoryId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
