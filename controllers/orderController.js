const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendOrderConfirmation } = require('../config/email');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, customerEmail, customerName, shippingAddress } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map(item => {
      totalAmount += item.price * item.quantity;
      return {
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price
      };
    });
    
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      customerEmail,
      customerName,
      shippingAddress
    });
    
    await order.save();
    const populatedOrder = await Order.findById(order._id).populate('items.product');
    
    // Clear user's cart after order is placed
    await Cart.findOneAndUpdate({ userId }, { items: [] });
    
    // Send email confirmation
    try {
      await sendOrderConfirmation(customerEmail, populatedOrder);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the order if email fails
    }
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

// Get orders by userId
exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};
