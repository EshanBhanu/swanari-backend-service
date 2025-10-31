# Swanari Women's Clothing Shop - Backend Service

A RESTful API backend service for Swanari Women's Clothing Shop built with Node.js, Express.js, and MongoDB.

## Features

- **Category Management**: Create, read, and delete product categories
- **Product Management**: Full CRUD operations for products with category associations
- **Shopping Cart**: Add items to cart, view cart, and remove items
- **Order Management**: Place orders and view order history
- **Email Notifications**: Automatic order confirmation emails via Nodemailer
- **Data Validation**: Request validation using express-validator
- **HTTP Logging**: Request logging with Morgan
- **CORS Support**: Enable cross-origin requests for frontend integration

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Nodemailer** - Email sending
- **Express-Validator** - Request validation
- **Morgan** - HTTP request logger
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/EshanBhanu/swanari-backend-service.git
cd swanari-backend-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/swanari-shop
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Swanari Shop <noreply@swanari.com>"
```

5. Start MongoDB service:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux with systemd
sudo systemctl start mongod

# Or run MongoDB directly
mongod --dbpath /path/to/data/directory
```

6. Start the server:
```bash
# Production mode
npm start

# Development mode (with nodemon, requires installation)
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
  - Body: `{ "categoryId": "string", "name": "string", "description": "string" }`
  - Note: `categoryId` is required and must be unique (e.g., "women-dresses", "casual-tops")
- `DELETE /api/categories/:categoryId` - Delete a category by categoryId

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:productId` - Get a specific product by productId
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create a new product
  - Body: `{ "productId": "string", "name": "string", "description": "string", "price": number, "category": "categoryId", "imageUrl": "string", "stock": number, "sizes": ["XS", "S", "M"], "colors": ["red", "blue"] }`
  - Note: `productId` and `category` must match existing categoryId (e.g., "Tops")
- `PUT /api/products/:productId` - Update a product by productId
- `DELETE /api/products/:productId` - Delete a product by productId

### Cart

- `POST /api/cart/add` - Add item to cart
  - Body: `{ "userId": "string", "product": "productId", "quantity": number, "size": "string", "color": "string" }`
- `GET /api/cart/:userId` - Get user's cart
- `DELETE /api/cart/:userId/:itemId` - Remove item from cart

### Orders

- `POST /api/orders` - Create a new order
  - Body: `{ "userId": "string", "items": [{ "product": "productId", "quantity": number, "size": "string", "color": "string", "price": number }], "customerEmail": "email", "customerName": "string", "shippingAddress": { "street": "string", "city": "string", "state": "string", "zipCode": "string", "country": "string" } }`
- `GET /api/orders/:userId` - Get user's order history

## Database Collections

### Category
- `categoryId`: String (required, unique) - Client-provided unique identifier
- `name`: String (required, unique)
- `description`: String
- `timestamps`: createdAt, updatedAt

### Product
- `productId`: String (required, unique) - Client-provided unique identifier
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: String (required) - Must match an existing categoryId
- `imageUrl`: String
- `stock`: Number (default: 0)
- `sizes`: Array of Strings (enum: XS, S, M, L, XL, XXL)
- `colors`: Array of Strings
- `timestamps`: createdAt, updatedAt

### Cart
- `userId`: String (required, unique)
- `items`: Array of CartItems
  - `product`: ObjectId (ref: Product)
  - `quantity`: Number (default: 1)
  - `size`: String
  - `color`: String
- `timestamps`: createdAt, updatedAt

### Order
- `userId`: String (required)
- `items`: Array of OrderItems
  - `product`: ObjectId (ref: Product)
  - `quantity`: Number
  - `size`: String
  - `color`: String
  - `price`: Number
- `totalAmount`: Number (required)
- `customerEmail`: String (required)
- `customerName`: String (required)
- `shippingAddress`: Object
  - `street`: String
  - `city`: String
  - `state`: String
  - `zipCode`: String
  - `country`: String
- `status`: String (enum: pending, processing, shipped, delivered, cancelled)
- `timestamps`: createdAt, updatedAt

## Email Configuration

For Gmail users:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in your `.env` file as `EMAIL_PASSWORD`

For other email providers, adjust `EMAIL_HOST`, `EMAIL_PORT`, and `EMAIL_SECURE` accordingly.

## Project Structure

```
swanari-backend-service/
├── config/
│   ├── database.js      # MongoDB connection
│   └── email.js         # Nodemailer configuration
├── controllers/
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── models/
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── .env.example
├── .gitignore
├── package.json
├── server.js            # Main application entry point
└── ReadMe.md
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a `message` field with details about the error.

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

ISC