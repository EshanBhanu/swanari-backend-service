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

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Swanari Shop <noreply@swanari.com>"
```

**For Local MongoDB:**
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

## MongoDB Atlas Setup

To use MongoDB Atlas (recommended for production):

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0 is sufficient for development)
3. Create a database user:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose authentication method (username/password recommended)
   - Set username and password
   - Grant "Read and write to any database" privileges
4. Whitelist your IP address:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: add your specific IP addresses
5. Get your connection string:
   - Go to "Database" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add your database name after the `/` (e.g., `swanari-shop`)
6. Update your `.env` file with the complete connection string

5. Start MongoDB service (only needed for local MongoDB):
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
  - Body: `{ "name": "string", "description": "string" }`
- `DELETE /api/categories/:id` - Delete a category

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create a new product
  - Body: `{ "name": "string", "description": "string", "price": number, "category": "categoryId", "imageUrl": "string", "stock": number, "sizes": ["XS", "S", "M"], "colors": ["red", "blue"] }`
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

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
- `name`: String (required, unique)
- `description`: String
- `timestamps`: createdAt, updatedAt

### Product
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: ObjectId (ref: Category)
- `imageUrl`: String
- `stock`: Number (default: 0)
- `sizes`: Array of Strings
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