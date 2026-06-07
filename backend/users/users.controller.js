const userService = require('./user.service');

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await userService.getUserPreferences(userId);
    res.status(200).json(preferences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await userService.updateUserPreferences(userId, req.body);
    res.status(200).json(preferences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await userService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};