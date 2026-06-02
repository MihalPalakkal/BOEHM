const loyalties = {}; // Placeholder for database

const tiers = [
  { id: 1, name: 'Bronze', minPoints: 0, maxPoints: 999 },
  { id: 2, name: 'Silver', minPoints: 1000, maxPoints: 4999 },
  { id: 3, name: 'Gold', minPoints: 5000, maxPoints: 9999 },
  { id: 4, name: 'Platinum', minPoints: 10000, maxPoints: Infinity }
];

exports.getUserLoyalty = async (userId) => {
  if (!loyalties[userId]) {
    loyalties[userId] = { userId, points: 0, tier: 'Bronze', rewards: [] };
  }
  return loyalties[userId];
};

exports.getRewards = async (userId) => {
  const loyalty = await exports.getUserLoyalty(userId);
  return loyalty.rewards;
};

exports.redeemReward = async (userId, rewardId) => {
  const loyalty = await exports.getUserLoyalty(userId);
  const rewardIndex = loyalty.rewards.findIndex(r => r.id === rewardId);
  
  if (rewardIndex === -1) throw new Error('Reward not found');
  
  loyalty.rewards.splice(rewardIndex, 1);
  return { message: 'Reward redeemed successfully', loyalty };
};

exports.getLoyaltyTiers = async () => {
  return tiers;
};

exports.getUserPoints = async (userId) => {
  const loyalty = await exports.getUserLoyalty(userId);
  return { userId, points: loyalty.points, tier: loyalty.tier };
};

exports.addPoints = async (userId, points) => {
  const loyalty = await exports.getUserLoyalty(userId);
  loyalty.points += points;
  
  const tier = tiers.find(t => loyalty.points >= t.minPoints && loyalty.points <= t.maxPoints);
  loyalty.tier = tier ? tier.name : 'Platinum';
  
  return loyalty;
};
