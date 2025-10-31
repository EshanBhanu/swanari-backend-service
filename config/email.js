const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (customerEmail, order) => {
  const transporter = createTransporter();
  
  // Build order items list
  const itemsList = order.items.map(item => 
    `- ${item.product.name} (x${item.quantity}) - $${item.price * item.quantity}`
  ).join('\n');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Order Confirmation - Swanari #${order._id}`,
    text: `
Dear ${order.customerName},

Thank you for your order at Swanari Women's Clothing Shop!

Order ID: ${order._id}
Order Date: ${new Date(order.createdAt).toLocaleDateString()}

Order Items:
${itemsList}

Total Amount: $${order.totalAmount.toFixed(2)}

Shipping Address:
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

We will send you another email when your order ships.

Thank you for shopping with us!

Best regards,
Swanari Team
    `,
    html: `
      <h2>Dear ${order.customerName},</h2>
      <p>Thank you for your order at Swanari Women's Clothing Shop!</p>
      
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      
      <h3>Order Items</h3>
      <ul>
        ${order.items.map(item => 
          `<li>${item.product.name} (x${item.quantity}) - $${item.price * item.quantity}</li>`
        ).join('')}
      </ul>
      
      <p><strong>Total Amount: $${order.totalAmount.toFixed(2)}</strong></p>
      
      <h3>Shipping Address</h3>
      <p>
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}
      </p>
      
      <p>We will send you another email when your order ships.</p>
      <p>Thank you for shopping with us!</p>
      
      <p>Best regards,<br>Swanari Team</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmation };
