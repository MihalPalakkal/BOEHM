import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const userService = {
  getUserProfile: (userId) => {
    return axios.get(`${API_BASE_URL}/users/${userId}`);
  },

  updateUserProfile: (userId, userData) => {
    return axios.put(`${API_BASE_URL}/users/${userId}`, userData);
  },

  getUserPreferences: (userId) => {
    return axios.get(`${API_BASE_URL}/users/${userId}/preferences`);
  },

  updateUserPreferences: (userId, preferences) => {
    return axios.put(`${API_BASE_URL}/users/${userId}/preferences`, preferences);
  },

  deleteUser: (userId) => {
    return axios.delete(`${API_BASE_URL}/users/${userId}`);
  }
};

export default userService;
