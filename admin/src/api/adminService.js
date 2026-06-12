import api from './axiosInstance';

export const adminService = {
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (orderId, status) =>
    api.patch(`/admin/orders/${orderId}/status`, { status }),

  getMenuItems: () => api.get('/admin/menu'),
  createMenuItem: (item) => api.post('/admin/menu', item),
  updateMenuItem: (itemId, item) => api.put(`/admin/menu/${itemId}`, item),
  updateMenuAvailability: (itemId, available) =>
    api.patch(`/admin/menu/${itemId}/availability`, { available }),
  archiveMenuItem: (itemId) => api.delete(`/admin/menu/${itemId}`),

  getRewards: () => api.get('/admin/loyalty/rewards'),
  createReward: (reward) => api.post('/admin/loyalty/rewards', reward),
  updateReward: (rewardId, reward) => api.put(`/admin/loyalty/rewards/${rewardId}`, reward),
  updateRewardStatus: (rewardId, active) =>
    api.patch(`/admin/loyalty/rewards/${rewardId}/status`, { active }),

  getTiers: () => api.get('/admin/loyalty/tiers'),
  updateTier: (tierId, tier) => api.put(`/admin/loyalty/tiers/${tierId}`, tier),
};

export default adminService;
