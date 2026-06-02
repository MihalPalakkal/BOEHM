import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const loyaltyService = {
  getUserLoyalty: (userId) => {
    return axios.get(`${API_BASE_URL}/loyalty/user/${userId}`);
  },

  getRewards: (userId) => {
    return axios.get(`${API_BASE_URL}/loyalty/rewards/${userId}`);
  },

  redeemReward: (userId, rewardId) => {
    return axios.post(`${API_BASE_URL}/loyalty/redeem`, { userId, rewardId });
  },

  getLoyaltyTiers: () => {
    return axios.get(`${API_BASE_URL}/loyalty/tiers`);
  },

  getUserPoints: (userId) => {
    return axios.get(`${API_BASE_URL}/loyalty/points/${userId}`);
  }
};

export default loyaltyService;
