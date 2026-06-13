const adminService = require('./admin.service');

const sendError = (res, error, status = 400) => {
  res.status(status).json({ error: error.message });
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await adminService.getOrders(req.query);
    res.status(200).json(orders);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await adminService.updateOrderStatus(req.params.orderId, req.body.status);
    res.status(200).json(order);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const items = await adminService.getMenuItems();
    res.status(200).json(items);
  } catch (error) {
    sendError(res, error);
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const item = await adminService.saveMenuItem(null, req.body);
    res.status(201).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const item = await adminService.saveMenuItem(req.params.itemId, req.body);
    res.status(200).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateMenuAvailability = async (req, res) => {
  try {
    const item = await adminService.updateMenuAvailability(req.params.itemId, req.body.available);
    res.status(200).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

exports.archiveMenuItem = async (req, res) => {
  try {
    const item = await adminService.archiveMenuItem(req.params.itemId);
    res.status(200).json(item);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getRewards = async (req, res) => {
  try {
    const rewards = await adminService.getRewards();
    res.status(200).json(rewards);
  } catch (error) {
    sendError(res, error);
  }
};

exports.createReward = async (req, res) => {
  try {
    const reward = await adminService.saveReward(null, req.body);
    res.status(201).json(reward);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateReward = async (req, res) => {
  try {
    const reward = await adminService.saveReward(req.params.rewardId, req.body);
    res.status(200).json(reward);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateRewardStatus = async (req, res) => {
  try {
    const reward = await adminService.updateRewardStatus(req.params.rewardId, req.body.active);
    res.status(200).json(reward);
  } catch (error) {
    sendError(res, error);
  }
};

exports.getTiers = async (req, res) => {
  try {
    const tiers = await adminService.getTiers();
    res.status(200).json(tiers);
  } catch (error) {
    sendError(res, error);
  }
};

exports.updateTier = async (req, res) => {
  try {
    const tier = await adminService.updateTier(req.params.tierId, req.body);
    res.status(200).json(tier);
  } catch (error) {
    sendError(res, error);
  }
};
