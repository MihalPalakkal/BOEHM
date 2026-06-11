const menuService = require('./menu.service');

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await menuService.getAllMenuItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await menuService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await menuService.getMenuItemById(itemId);
    res.status(200).json(item);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
