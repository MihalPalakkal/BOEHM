import api from './api';

export const loyaltyService = {
  getUserLoyalty: (userId) => {
    return api.get(`/loyalty/user/${userId}`);
  },

  getRewards: (userId) => {
    return api.get(`/loyalty/rewards/${userId}`);
  },

  redeemReward: (userId, rewardId) => {
    return api.post('/loyalty/redeem', { userId, rewardId });
  },

  getLoyaltyTiers: () => {
    return api.get('/loyalty/tiers');
  },

  getUserPoints: (userId) => {
    return api.get(`/loyalty/points/${userId}`);
  },
};

export default loyaltyService;