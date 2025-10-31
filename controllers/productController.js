const Product = require('../models/Product');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get product by productId
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
};

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verify category exists
    const { category } = req.body;
    const categoryExists = await Category.findOne({ categoryId: category });
    if (!categoryExists) {
      return res.status(400).json({ message: `Category '${category}' not found` });
    }
    
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    // handle duplicate key error
    if (error.name === 'MongoError' && error.code === 11000) {
      const dupKey = Object.keys(error.keyValue || {})[0];
      return res.status(400).json({ message: `Duplicate ${dupKey}: ${error.keyValue[dupKey]}` });
    }
    
    res.status(400).json({ message: 'Error adding product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // If updating category, verify it exists
    if (req.body.category) {
      const categoryExists = await Category.findOne({ categoryId: req.body.category });
      if (!categoryExists) {
        return res.status(400).json({ message: `Category '${req.body.category}' not found` });
      }
    }
    
    const product = await Product.findOneAndUpdate(
      { productId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOneAndDelete({ productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
