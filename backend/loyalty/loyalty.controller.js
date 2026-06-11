const loyaltyService = require('./loyalty.service');

exports.getUserLoyalty = async (req, res) => {
  try {
    const { userId } = req.params;
    const loyalty = await loyaltyService.getUserLoyalty(userId);
    res.status(200).json(loyalty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    const rewards = await loyaltyService.getRewards(userId);
    res.status(200).json(rewards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.redeemReward = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;
    const result = await loyaltyService.redeemReward(userId, rewardId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLoyaltyTiers = async (req, res) => {
  try {
    const tiers = await loyaltyService.getLoyaltyTiers();
    res.status(200).json(tiers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const points = await loyaltyService.getUserPoints(userId);
    res.status(200).json(points);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRewardsCatalogue = async (req, res) => {
  try {
    const rewards = await loyaltyService.getRewardsCatalogue();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
