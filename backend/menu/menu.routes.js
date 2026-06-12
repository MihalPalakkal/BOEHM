const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');

// Public routes — no auth required
router.get('/', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.get('/:itemId', menuController.getMenuItemById);

module.exports = router;
