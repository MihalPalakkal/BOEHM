const express = require('express');
const router = express.Router();
const loyaltyController = require('./loyalty.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/tiers', loyaltyController.getLoyaltyTiers);
router.get('/rewards-catalogue', loyaltyController.getRewardsCatalogue);

// Authenticated routes
router.get('/user/:userId', authMiddleware, loyaltyController.getUserLoyalty);
router.get('/rewards/:userId', authMiddleware, loyaltyController.getRewards);
router.post('/redeem', authMiddleware, loyaltyController.redeemReward);
router.get('/points/:userId', authMiddleware, loyaltyController.getUserPoints);

module.exports = router;
