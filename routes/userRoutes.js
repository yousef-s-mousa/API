const express = require('express');
const router = express.Router();
const {
  getAllBasicUsers,
  getBasicUserById,
  getAllDetailedUsers,
  getDetailedUserById,
  getAllDetailedUsersSOAP,
  getDetailedUserByIdSOAP
} = require('../controllers/userController');

// Basic Users Routes
// GET /api/users - Get all basic users
router.get('/users', getAllBasicUsers);

// GET /api/users/:id - Get a single basic user by ID
router.get('/users/:id', getBasicUserById);

// Detailed Users Routes (SOAP format)
// GET /api/users/details/soap - Get all detailed users in SOAP format
router.get('/users/details/soap', getAllDetailedUsersSOAP);

// GET /api/users/details/soap/:id - Get a single detailed user by ID in SOAP format
router.get('/users/details/soap/:id', getDetailedUserByIdSOAP);

// Detailed Users Routes (JSON format)
// GET /api/users/details - Get all detailed users
router.get('/users/details', getAllDetailedUsers);

// GET /api/users/details/:id - Get a single detailed user by ID
router.get('/users/details/:id', getDetailedUserById);

module.exports = router;
