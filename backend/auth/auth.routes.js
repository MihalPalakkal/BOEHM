const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/register', validationMiddleware.validateRegister, authController.register);
router.post('/login', validationMiddleware.validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
