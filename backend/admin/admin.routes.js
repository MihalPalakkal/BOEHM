const express = require('express');
const adminController = require('./admin.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(adminMiddleware);

router.get('/orders', adminController.getOrders);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);

router.get('/menu', adminController.getMenuItems);
router.post('/menu', adminController.createMenuItem);
router.put('/menu/:itemId', adminController.updateMenuItem);
router.patch('/menu/:itemId/availability', adminController.updateMenuAvailability);
router.delete('/menu/:itemId', adminController.archiveMenuItem);

router.get('/loyalty/rewards', adminController.getRewards);
router.post('/loyalty/rewards', adminController.createReward);
router.put('/loyalty/rewards/:rewardId', adminController.updateReward);
router.patch('/loyalty/rewards/:rewardId/status', adminController.updateRewardStatus);

router.get('/loyalty/tiers', adminController.getTiers);
router.put('/loyalty/tiers/:tierId', adminController.updateTier);

module.exports = router;
