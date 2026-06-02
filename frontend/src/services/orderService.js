import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const orderService = {
  getOrders: (userId) => {
    return axios.get(`${API_BASE_URL}/orders/${userId}`);
  },

  getOrderById: (orderId) => {
    return axios.get(`${API_BASE_URL}/orders/detail/${orderId}`);
  },

  createOrder: (orderData) => {
    return axios.post(`${API_BASE_URL}/orders`, orderData);
  },

  updateOrder: (orderId, orderData) => {
    return axios.put(`${API_BASE_URL}/orders/${orderId}`, orderData);
  },

  cancelOrder: (orderId) => {
    return axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`);
  }
};

export default orderService;
