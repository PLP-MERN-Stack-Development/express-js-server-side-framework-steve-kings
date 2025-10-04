// server.js - Week 2 Express.js Assignment
// Student: Stephen - PLP Student

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CUSTOM ERROR CLASSES
// ============================================
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

// ============================================
// MIDDLEWARE IMPLEMENTATIONS
// ============================================

// Custom logger middleware
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Authentication middleware - checks for API key in headers
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  // For demo purposes, accept any API key or skip if none provided
  // In production, you'd validate against a real API key
  if (!apiKey) {
    return next(new AuthenticationError('API key is required. Please provide x-api-key header.'));
  }

  // Simple validation - accept "plp-student-key" as valid
  if (apiKey !== 'plp-student-key') {
    return next(new AuthenticationError('Invalid API key provided.'));
  }

  next();
};

// Validation middleware for product data
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ValidationError('Product name is required and must be a non-empty string.'));
  }

  if (!description || typeof description !== 'string') {
    return next(new ValidationError('Product description is required and must be a string.'));
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return next(new ValidationError('Product price is required and must be a non-negative number.'));
  }

  if (!category || typeof category !== 'string') {
    return next(new ValidationError('Product category is required and must be a string.'));
  }

  if (inStock === undefined || typeof inStock !== 'boolean') {
    return next(new ValidationError('Product inStock status is required and must be a boolean.'));
  }

  next();
};

// Apply global middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Desk Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 250,
    category: 'furniture',
    inStock: true
  },
  {
    id: '5',
    name: 'Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 150,
    category: 'electronics',
    inStock: true
  }
];

// ============================================
// ROUTES
// ============================================

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    student: 'Stephen - PLP Student',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search?q=laptop',
      stats: '/api/products/stats',
      singleProduct: '/api/products/:id'
    },
    note: 'Most endpoints require x-api-key header with value: plp-student-key'
  });
});

// GET /api/products - Get all products with filtering and pagination
app.get('/api/products', (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    let filteredProducts = [...products];

    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredProducts.length / limit),
      data: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/search - Search products by name
app.get('/api/products/search', (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new ValidationError('Search query parameter "q" is required.'));
    }

    const searchResults = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      query: q,
      count: searchResults.length,
      data: searchResults
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/stats - Get product statistics
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {
      totalProducts: products.length,
      inStock: products.filter(p => p.inStock).length,
      outOfStock: products.filter(p => !p.inStock).length,
      byCategory: {}
    };

    // Count by category
    products.forEach(p => {
      if (!stats.byCategory[p.category]) {
        stats.byCategory[p.category] = 0;
      }
      stats.byCategory[p.category]++;
    });

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      return next(new NotFoundError(`Product with ID ${id} not found.`));
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product (requires auth and validation)
app.post('/api/products', authMiddleware, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      inStock
    };

    products.push(newProduct);

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update an existing product (requires auth and validation)
app.put('/api/products/:id', authMiddleware, validateProduct, (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, inStock } = req.body;

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return next(new NotFoundError(`Product with ID ${id} not found.`));
    }

    products[productIndex] = {
      id,
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      inStock
    };

    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product (requires auth)
app.delete('/api/products/:id', authMiddleware, (req, res, next) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return next(new NotFoundError(`Product with ID ${id} not found.`));
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found.`));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${err.name}: ${message}`);

  res.status(statusCode).json({
    error: {
      name: err.name,
      message: message,
      statusCode: statusCode
    }
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Student: Stephen - PLP Student`);
});

// Export the app for testing purposes
module.exports = app; 