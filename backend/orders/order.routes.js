const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', authMiddleware, orderController.getOrders);
router.get('/detail/:orderId', authMiddleware, orderController.getOrderById);
router.post('/', authMiddleware, orderController.createOrder);
router.put('/:orderId', authMiddleware, orderController.updateOrder);
router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
