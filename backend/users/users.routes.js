const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', authMiddleware, userController.getUserProfile);
router.put('/:userId', authMiddleware, userController.updateUserProfile);
router.get('/:userId/preferences', authMiddleware, userController.getUserPreferences);
router.put('/:userId/preferences', authMiddleware, userController.updateUserPreferences);
router.delete('/:userId', authMiddleware, userController.deleteUser);

module.exports = router;