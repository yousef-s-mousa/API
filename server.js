const express = require('express');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Mount user routes
app.use('/api', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the User API',
    endpoints: {
      basicUsers: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id'
      },
      detailedUsers: {
        getAll: 'GET /api/users/details',
        getById: 'GET /api/users/details/:id'
      },
      detailedUsersSOAP: {
        getAll: 'GET /api/users/details/soap',
        getById: 'GET /api/users/details/soap/:id'
      },
      generateRandom: 'POST /api/generate-random'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET http://localhost:${PORT}/api/users`);
  console.log(`  GET http://localhost:${PORT}/api/users/:id`);
  console.log(`  GET http://localhost:${PORT}/api/users/details`);
  console.log(`  GET http://localhost:${PORT}/api/users/details/:id`);
  console.log(`  GET http://localhost:${PORT}/api/users/details/soap`);
  console.log(`  GET http://localhost:${PORT}/api/users/details/soap/:id`);
});
