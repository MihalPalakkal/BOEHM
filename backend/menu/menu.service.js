const pool = require('../config/database');

exports.getAllMenuItems = async () => {
  const connection = await pool.getConnection();
  try {
    const [items] = await connection.query(
      `SELECT mi.id, mi.name, mi.description, mi.price,
              mc.name AS category,
              mi.image_url AS image,
              mi.prep_time AS prepTime,
              mi.calories,
              mi.spice_level AS spice,
              mi.accent_color AS accent,
              mi.is_available AS isAvailable,
              mi.is_featured AS isFeatured
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE mi.is_available = TRUE
       ORDER BY mc.sort_order ASC, mi.sort_order ASC`
    );

    // Fetch all tags in one query
    const [tags] = await connection.query(
      `SELECT menu_item_id, tag FROM menu_item_tags`
    );

    // Group tags by item id
    const tagMap = {};
    for (const row of tags) {
      if (!tagMap[row.menu_item_id]) tagMap[row.menu_item_id] = [];
      tagMap[row.menu_item_id].push(row.tag);
    }

    // Attach tags to each item
    return items.map((item) => ({
      ...item,
      price: Number(item.price),
      tags: tagMap[item.id] || [],
    }));
  } finally {
    connection.release();
  }
};

exports.getCategories = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, name, sort_order AS sortOrder
       FROM menu_categories
       WHERE is_active = TRUE
       ORDER BY sort_order ASC`
    );
    return rows;
  } finally {
    connection.release();
  }
};

exports.getMenuItemById = async (itemId) => {
  const connection = await pool.getConnection();
  try {
    const [items] = await connection.query(
      `SELECT mi.id, mi.name, mi.description, mi.price,
              mc.name AS category,
              mi.image_url AS image,
              mi.prep_time AS prepTime,
              mi.calories,
              mi.spice_level AS spice,
              mi.accent_color AS accent,
              mi.is_available AS isAvailable,
              mi.is_featured AS isFeatured
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       WHERE mi.id = ?`,
      [itemId]
    );

    if (items.length === 0) throw new Error('Menu item not found');

    const [tags] = await connection.query(
      `SELECT tag FROM menu_item_tags WHERE menu_item_id = ?`,
      [itemId]
    );

    return {
      ...items[0],
      price: Number(items[0].price),
      tags: tags.map((t) => t.tag),
    };
  } finally {
    connection.release();
  }
};
