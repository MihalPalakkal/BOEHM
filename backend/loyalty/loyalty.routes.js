const express = require('express');
const router = express.Router();
const loyaltyController = require('./loyalty.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/:userId', authMiddleware, loyaltyController.getUserLoyalty);
router.get('/rewards/:userId', authMiddleware, loyaltyController.getRewards);
router.post('/redeem', authMiddleware, loyaltyController.redeemReward);
router.get('/tiers', loyaltyController.getLoyaltyTiers);
router.get('/points/:userId', authMiddleware, loyaltyController.getUserPoints);

module.exports = router;
