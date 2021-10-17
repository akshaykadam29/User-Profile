const express = require('express');
const userController = require('./../controllers/user');
const extractFile = require('./../middleware/file')

const checkAuth = require('./../middleware/check-auth');

const router = express.Router();


// Signup API
router.post('/signup', extractFile, userController.createUser);

// Login API
router.post('/login', userController.userLogin);

// Get Profile data
router.get('/:id', userController.getUserProfile);

// Update user
router.put('/:id', extractFile, userController.updateUser);


module.exports = router;
