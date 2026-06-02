const orders = {}; // Placeholder for database

exports.getOrders = async (userId) => {
  return Object.values(orders).filter(order => order.userId === userId);
};

exports.getOrderById = async (orderId) => {
  const order = orders[orderId];
  if (!order) throw new Error('Order not found');
  return order;
};

exports.createOrder = async (orderData) => {
  const orderId = Date.now().toString();
  const newOrder = {
    id: orderId,
    ...orderData,
    createdAt: new Date(),
    status: 'pending'
  };
  orders[orderId] = newOrder;
  return newOrder;
};

exports.updateOrder = async (orderId, orderData) => {
  const order = orders[orderId];
  if (!order) throw new Error('Order not found');
  
  const updatedOrder = { ...order, ...orderData, updatedAt: new Date() };
  orders[orderId] = updatedOrder;
  return updatedOrder;
};

exports.cancelOrder = async (orderId) => {
  const order = orders[orderId];
  if (!order) throw new Error('Order not found');
  
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  return { message: 'Order cancelled successfully', order };
};
