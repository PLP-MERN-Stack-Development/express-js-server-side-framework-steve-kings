# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

You will:
1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Endpoints

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete all the required API endpoints
2. Implement the middleware and error handling
3. Document your API in the # Product API - Week 2 Express.js Assignment

**Student:** Stephen - PLP Student

## Overview
A fully functional RESTful API built with Express.js that manages a product inventory system. This API implements CRUD operations, custom middleware, error handling, and advanced features like filtering, pagination, and search.

## Features
- ✅ Complete CRUD operations for products
- ✅ Custom middleware (logging, authentication, validation)
- ✅ Comprehensive error handling with custom error classes
- ✅ Product filtering by category
- ✅ Pagination support
- ✅ Search functionality
- ✅ Product statistics endpoint

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

2. Install dependencies:
```bash
npm install express body-parser uuid
```

3. (Optional) Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

## Running the Server

Start the server:
```bash
node server.js
```

The server will start on `http://localhost:3000`

## API Documentation

### Authentication
Most write operations (POST, PUT, DELETE) require an API key in the request headers:
```
x-api-key: plp-student-key
```

### Endpoints

#### 1. Root Endpoint
**GET** `/`

Returns welcome message and available endpoints.

**Response:**
```json
{
  "message": "Welcome to the Product API!",
  "student": "Stephen - PLP Student",
  "endpoints": {
    "products": "/api/products",
    "search": "/api/products/search?q=laptop",
    "stats": "/api/products/stats",
    "singleProduct": "/api/products/:id"
  }
}
```

---

#### 2. Get All Products
**GET** `/api/products`

Retrieve all products with optional filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category (e.g., electronics, kitchen, furniture)
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page

**Example Request:**
```bash
curl http://localhost:3000/api/products?category=electronics&page=1&limit=5
```

**Response:**
```json
{
  "total": 3,
  "page": 1,
  "limit": 5,
  "totalPages": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

#### 3. Get Single Product
**GET** `/api/products/:id`

Retrieve a specific product by ID.

**Example Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

---

#### 4. Search Products
**GET** `/api/products/search?q=<query>`

Search products by name or description.

**Query Parameters:**
- `q` (required): Search query string

**Example Request:**
```bash
curl http://localhost:3000/api/products/search?q=laptop
```

**Response:**
```json
{
  "query": "laptop",
  "count": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

#### 5. Get Product Statistics
**GET** `/api/products/stats`

Get statistics about products including counts by category.

**Example Request:**
```bash
curl http://localhost:3000/api/products/stats
```

**Response:**
```json
{
  "totalProducts": 5,
  "inStock": 4,
  "outOfStock": 1,
  "byCategory": {
    "electronics": 3,
    "kitchen": 1,
    "furniture": 1
  }
}
```

---

#### 6. Create Product
**POST** `/api/products`

Create a new product. Requires authentication.

**Headers:**
```
Content-Type: application/json
x-api-key: plp-student-key
```

**Request Body:**
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with USB receiver",
  "price": 25.99,
  "category": "electronics",
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: plp-student-key" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": 25.99,
    "category": "electronics",
    "inStock": true
  }'
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "generated-uuid",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "price": 25.99,
    "category": "electronics",
    "inStock": true
  }
}
```

---

#### 7. Update Product
**PUT** `/api/products/:id`

Update an existing product. Requires authentication.

**Headers:**
```
Content-Type: application/json
x-api-key: plp-student-key
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 99.99,
  "category": "electronics",
  "inStock": false
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: plp-student-key" \
  -d '{
    "name": "Updated Laptop",
    "description": "Updated high-performance laptop",
    "price": 1100,
    "category": "electronics",
    "inStock": true
  }'
```

**Response:**
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "1",
    "name": "Updated Laptop",
    "description": "Updated high-performance laptop",
    "price": 1100,
    "category": "electronics",
    "inStock": true
  }
}
```

---

#### 8. Delete Product
**DELETE** `/api/products/:id`

Delete a product. Requires authentication.

**Headers:**
```
x-api-key: plp-student-key
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: plp-student-key"
```

**Response:**
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

---

## Error Handling

The API implements comprehensive error handling with appropriate HTTP status codes:

### Error Response Format
```json
{
  "error": {
    "name": "ErrorType",
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Error Types
- **ValidationError (400)**: Invalid request data
- **AuthenticationError (401)**: Missing or invalid API key
- **NotFoundError (404)**: Resource not found
- **Internal Server Error (500)**: Unexpected server errors

### Example Error Responses

**Missing API Key:**
```json
{
  "error": {
    "name": "AuthenticationError",
    "message": "API key is required. Please provide x-api-key header.",
    "statusCode": 401
  }
}
```

**Product Not Found:**
```json
{
  "error": {
    "name": "NotFoundError",
    "message": "Product with ID 999 not found.",
    "statusCode": 404
  }
}
```

**Validation Error:**
```json
{
  "error": {
    "name": "ValidationError",
    "message": "Product name is required and must be a non-empty string.",
    "statusCode": 400
  }
}
```

---

## Middleware

### 1. Logger Middleware
Logs all incoming requests with timestamp, method, and URL.

### 2. Authentication Middleware
Validates API key in request headers for protected routes (POST, PUT, DELETE).

### 3. Validation Middleware
Validates product data structure and types before creating or updating products.

### 4. Error Handling Middleware
Catches and formats all errors with appropriate status codes and messages.

---

## Testing the API

### Using curl

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Create a product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: plp-student-key" \
  -d '{"name":"Test Product","description":"Test","price":10,"category":"test","inStock":true}'
```

### Using Postman or Insomnia
1. Import the endpoints listed above
2. Set the `x-api-key` header to `plp-student-key` for POST, PUT, DELETE requests
3. Use JSON format for request bodies

---

## Project Structure
```
.
├── server.js           # Main application file with all routes and middleware
├── README.md           # This file
├── .env.example        # Environment variables template
└── package.json        # Project dependencies
```

---

## Technologies Used
- **Express.js**: Web framework for Node.js
- **body-parser**: Middleware for parsing JSON request bodies
- **uuid**: For generating unique product IDs

---

## Assignment Completion Checklist

### Task 1: Express.js Setup ✅
- [x] Initialize Node.js project
- [x] Install Express.js and dependencies
- [x] Create basic Express server on port 3000
- [x] Implement "Hello World" route at root endpoint

### Task 2: RESTful API Routes ✅
- [x] Create products resource with all required fields
- [x] GET /api/products - List all products
- [x] GET /api/products/:id - Get specific product
- [x] POST /api/products - Create new product
- [x] PUT /api/products/:id - Update product
- [x] DELETE /api/products/:id - Delete product

### Task 3: Middleware Implementation ✅
- [x] Custom logger middleware
- [x] JSON body parser middleware
- [x] Authentication middleware with API key check
- [x] Validation middleware for product routes

### Task 4: Error Handling ✅
- [x] Global error handling middleware
- [x] Custom error classes (NotFoundError, ValidationError, AuthenticationError)
- [x] Proper HTTP status codes
- [x] Try/catch blocks for async errors

### Task 5: Advanced Features ✅
- [x] Query parameters for filtering by category
- [x] Pagination support
- [x] Search endpoint by name
- [x] Product statistics endpoint

---

## Author
**Stephen** - PLP Student

## License
This project is for educational purposes as part of the PLP Week 2 assignment.
4. Include examples of requests and responses

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 