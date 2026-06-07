import api from './api';

export const userService = {
  getUserProfile: (userId) => {
    return api.get(`/users/${userId}`);
  },

  updateUserProfile: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },

  getUserPreferences: (userId) => {
    return api.get(`/users/${userId}/preferences`);
  },

  updateUserPreferences: (userId, preferences) => {
    return api.put(`/users/${userId}/preferences`, preferences);
  },

  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  },
};

export default userService;