import api from './api';

export const orderService = {
  getOrders: (userId) => {
    return api.get(`/orders/${userId}`);
  },

  getOrderById: (orderId) => {
    return api.get(`/orders/detail/${orderId}`);
  },

  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  updateOrder: (orderId, orderData) => {
    return api.put(`/orders/${orderId}`, orderData);
  },

  cancelOrder: (orderId) => {
    return api.put(`/orders/${orderId}/cancel`);
  },
};

export default orderService;