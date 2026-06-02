const orderService = require('./order.service');

exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderData = req.body;
    const updatedOrder = await orderService.updateOrder(orderId, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await orderService.cancelOrder(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
