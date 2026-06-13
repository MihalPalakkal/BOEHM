const pool = require('../config/database');

const toBooleanNumber = (value) => (value ? 1 : 0);

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const getOrCreateCategoryId = async (connection, categoryName) => {
  const name = String(categoryName || 'Specials').trim() || 'Specials';
  const [existing] = await connection.query(
    'SELECT id FROM menu_categories WHERE name = ? LIMIT 1',
    [name],
  );

  if (existing.length > 0) return existing[0].id;

  const [maxRows] = await connection.query(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextSortOrder FROM menu_categories',
  );
  const [result] = await connection.query(
    'INSERT INTO menu_categories (name, sort_order, is_active) VALUES (?, ?, TRUE)',
    [name, maxRows[0].nextSortOrder],
  );

  return result.insertId;
};

const mapMenuItem = (item, tags = []) => ({
  ...item,
  price: Number(item.price),
  available: Boolean(item.available),
  isAvailable: Boolean(item.available),
  isFeatured: Boolean(item.isFeatured),
  tags,
});

const getTagsByItemIds = async (connection, itemIds) => {
  if (itemIds.length === 0) return {};

  const [tagRows] = await connection.query(
    'SELECT menu_item_id AS menuItemId, tag FROM menu_item_tags WHERE menu_item_id IN (?)',
    [itemIds],
  );

  return tagRows.reduce((tagMap, row) => {
    if (!tagMap[row.menuItemId]) tagMap[row.menuItemId] = [];
    tagMap[row.menuItemId].push(row.tag);
    return tagMap;
  }, {});
};

const getTierByPoints = async (connection, points) => {
  const [tiers] = await connection.query(
    `SELECT id, name, min_points AS minPoints, max_points AS maxPoints
     FROM loyalty_tiers
     ORDER BY min_points ASC`,
  );

  return tiers.find((tier) => {
    if (tier.maxPoints === null) return points >= tier.minPoints;
    return points >= tier.minPoints && points <= tier.maxPoints;
  }) || tiers[0];
};

exports.getOrders = async ({ status = 'all', search = '' } = {}) => {
  const connection = await pool.getConnection();
  try {
    const filters = [];
    const values = [];

    if (status && status !== 'all') {
      filters.push('o.status = ?');
      values.push(status);
    }

    if (search) {
      filters.push('(u.name LIKE ? OR u.email LIKE ? OR o.id LIKE ? OR o.delivery_address LIKE ?)');
      const pattern = `%${search}%`;
      values.push(pattern, pattern, pattern, pattern);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [orders] = await connection.query(
      `SELECT o.id, o.user_id AS userId, u.name AS customerName, u.email AS customerEmail,
              o.status, o.total_amount AS totalAmount, o.delivery_address AS deliveryAddress,
              o.payment_method AS paymentMethod, o.notes, o.created_at AS createdAt,
              o.updated_at AS updatedAt
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ${whereClause}
       ORDER BY o.created_at DESC`,
      values,
    );

    if (orders.length === 0) return [];

    const orderIds = orders.map((order) => order.id);
    const [items] = await connection.query(
      `SELECT oi.order_id AS orderId, oi.menu_item_id AS menuItemId,
              oi.quantity, oi.unit_price AS unitPrice, oi.subtotal,
              mi.name, mi.image_url AS imageUrl
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id IN (?)`,
      [orderIds],
    );

    const itemsByOrder = items.reduce((itemMap, item) => {
      if (!itemMap[item.orderId]) itemMap[item.orderId] = [];
      itemMap[item.orderId].push({ ...item, unitPrice: Number(item.unitPrice), subtotal: Number(item.subtotal) });
      return itemMap;
    }, {});

    return orders.map((order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: itemsByOrder[order.id] || [],
    }));
  } finally {
    connection.release();
  }
};

exports.getCustomers = async ({ search = '' } = {}) => {
  const connection = await pool.getConnection();
  try {
    const values = [];
    let whereClause = 'WHERE u.is_active = TRUE';

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const pattern = `%${search}%`;
      values.push(pattern, pattern, pattern);
    }

    const [customers] = await connection.query(
      `SELECT u.id, u.name, u.email, u.phone,
              u.created_at AS memberSince,
              COALESCE(lp.points, 0) AS points,
              COALESCE(lt.name, 'Bronze') AS tier,
              COUNT(o.id) AS orderCount,
              COALESCE(SUM(o.total_amount), 0) AS totalSpend,
              MAX(o.created_at) AS lastOrderAt
       FROM users u
       LEFT JOIN loyalty_points lp ON lp.user_id = u.id
       LEFT JOIN loyalty_tiers lt ON lt.id = lp.tier_id
       LEFT JOIN orders o ON o.user_id = u.id
       ${whereClause}
       GROUP BY u.id, u.name, u.email, u.phone, u.created_at, lp.points, lt.name
       ORDER BY lastOrderAt DESC, u.created_at DESC`,
      values,
    );

    if (customers.length === 0) return [];

    const customerIds = customers.map((customer) => customer.id);
    const [orders] = await connection.query(
      `SELECT id, user_id AS userId, status, total_amount AS totalAmount,
              payment_method AS paymentMethod, created_at AS createdAt
       FROM orders
       WHERE user_id IN (?)
       ORDER BY created_at DESC`,
      [customerIds],
    );

    const recentOrdersByCustomer = orders.reduce((orderMap, order) => {
      if (!orderMap[order.userId]) orderMap[order.userId] = [];
      if (orderMap[order.userId].length < 3) {
        orderMap[order.userId].push({
          ...order,
          totalAmount: Number(order.totalAmount),
        });
      }
      return orderMap;
    }, {});

    return customers.map((customer) => ({
      ...customer,
      phone: customer.phone || '',
      points: Number(customer.points),
      orderCount: Number(customer.orderCount),
      totalSpend: Number(customer.totalSpend),
      recentOrders: recentOrdersByCustomer[customer.id] || [],
    }));
  } finally {
    connection.release();
  }
};

exports.adjustCustomerPoints = async (userId, adjustment) => {
  const connection = await pool.getConnection();
  try {
    const amount = Number(adjustment.amount || 0);
    const reason = String(adjustment.reason || 'admin_adjustment').trim() || 'admin_adjustment';

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Point adjustment amount must be greater than zero');
    }

    await connection.beginTransaction();

    const [users] = await connection.query('SELECT id FROM users WHERE id = ? AND is_active = TRUE', [userId]);
    if (users.length === 0) throw new Error('Customer not found');

    const [loyaltyRows] = await connection.query(
      'SELECT points FROM loyalty_points WHERE user_id = ?',
      [userId],
    );

    const currentPoints = loyaltyRows[0]?.points || 0;
    const signedAmount = adjustment.type === 'subtract' ? -Math.min(amount, currentPoints) : amount;
    const nextPoints = Math.max(0, currentPoints + signedAmount);
    const tier = await getTierByPoints(connection, nextPoints);

    if (loyaltyRows.length === 0) {
      await connection.query(
        'INSERT INTO loyalty_points (user_id, points, tier_id) VALUES (?, ?, ?)',
        [userId, nextPoints, tier.id],
      );
    } else {
      await connection.query(
        'UPDATE loyalty_points SET points = ?, tier_id = ? WHERE user_id = ?',
        [nextPoints, tier.id, userId],
      );
    }

    await connection.query(
      `INSERT INTO loyalty_points_history
       (user_id, change_amount, balance_after, reason, reference_id)
       VALUES (?, ?, ?, ?, NULL)`,
      [userId, signedAmount, nextPoints, reason],
    );

    await connection.commit();
    const customers = await exports.getCustomers();
    return customers.find((customer) => Number(customer.id) === Number(userId));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid order status');
  }

  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE orders
       SET status = ?, cancelled_at = CASE WHEN ? = 'cancelled' THEN NOW() ELSE cancelled_at END
       WHERE id = ?`,
      [status, status, orderId],
    );

    const [orders] = await connection.query('SELECT id FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) throw new Error('Order not found');

    const updatedOrders = await exports.getOrders();
    const updatedOrder = updatedOrders.find((order) => Number(order.id) === Number(orderId));
    if (!updatedOrder) throw new Error('Order not found');
    return updatedOrder;
  } finally {
    connection.release();
  }
};

exports.getMenuItems = async () => {
  const connection = await pool.getConnection();
  try {
    const [items] = await connection.query(
      `SELECT mi.id, mi.name, mi.description, mi.price,
              mc.name AS category, mi.image_url AS image, mi.prep_time AS prepTime,
              mi.calories, mi.spice_level AS spice, mi.accent_color AS accent,
              mi.is_available AS available, mi.is_featured AS isFeatured,
              mi.sort_order AS sortOrder
       FROM menu_items mi
       LEFT JOIN menu_categories mc ON mc.id = mi.category_id
       ORDER BY mc.sort_order ASC, mi.sort_order ASC, mi.id ASC`,
    );
    const tagMap = await getTagsByItemIds(connection, items.map((item) => item.id));
    return items.map((item) => mapMenuItem(item, tagMap[item.id] || []));
  } finally {
    connection.release();
  }
};

exports.saveMenuItem = async (itemId, itemData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const categoryId = await getOrCreateCategoryId(connection, itemData.category);
    const values = [
      categoryId,
      itemData.name,
      itemData.description || '',
      Number(itemData.price || 0),
      itemData.image || itemData.imageUrl || '',
      itemData.prepTime || '12 min',
      Number(itemData.calories || 0),
      Number(itemData.spice || 0),
      itemData.accent || '#b42318',
      toBooleanNumber(itemData.available ?? itemData.isAvailable ?? true),
      toBooleanNumber(itemData.isFeatured ?? false),
      Number(itemData.sortOrder || 0),
    ];

    let savedId = itemId;

    if (itemId) {
      await connection.query(
        `UPDATE menu_items
         SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?,
             prep_time = ?, calories = ?, spice_level = ?, accent_color = ?,
             is_available = ?, is_featured = ?, sort_order = ?
         WHERE id = ?`,
        [...values, itemId],
      );
    } else {
      const [result] = await connection.query(
        `INSERT INTO menu_items
         (category_id, name, description, price, image_url, prep_time, calories,
          spice_level, accent_color, is_available, is_featured, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values,
      );
      savedId = result.insertId;
    }

    await connection.query('DELETE FROM menu_item_tags WHERE menu_item_id = ?', [savedId]);
    for (const tag of parseTags(itemData.tags)) {
      await connection.query(
        'INSERT IGNORE INTO menu_item_tags (menu_item_id, tag) VALUES (?, ?)',
        [savedId, tag],
      );
    }

    await connection.commit();
    const items = await exports.getMenuItems();
    return items.find((item) => Number(item.id) === Number(savedId));
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateMenuAvailability = async (itemId, available) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE menu_items SET is_available = ? WHERE id = ?',
      [toBooleanNumber(available), itemId],
    );
    const items = await exports.getMenuItems();
    const item = items.find((menuItem) => Number(menuItem.id) === Number(itemId));
    if (!item) throw new Error('Menu item not found');
    return item;
  } finally {
    connection.release();
  }
};

exports.archiveMenuItem = async (itemId) => {
  return exports.updateMenuAvailability(itemId, false);
};

exports.getRewards = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, name, description, points_required AS pointsRequired, is_active AS active
       FROM rewards
       ORDER BY points_required ASC, id ASC`,
    );
    return rows.map((row) => ({ ...row, active: Boolean(row.active) }));
  } finally {
    connection.release();
  }
};

exports.saveReward = async (rewardId, rewardData) => {
  const connection = await pool.getConnection();
  try {
    if (rewardId) {
      await connection.query(
        `UPDATE rewards
         SET name = ?, description = ?, points_required = ?, is_active = ?
         WHERE id = ?`,
        [
          rewardData.name,
          rewardData.description || '',
          Number(rewardData.pointsRequired || rewardData.points || 0),
          toBooleanNumber(rewardData.active ?? true),
          rewardId,
        ],
      );
    } else {
      const [result] = await connection.query(
        `INSERT INTO rewards (name, description, points_required, is_active)
         VALUES (?, ?, ?, ?)`,
        [
          rewardData.name,
          rewardData.description || '',
          Number(rewardData.pointsRequired || rewardData.points || 0),
          toBooleanNumber(rewardData.active ?? true),
        ],
      );
      rewardId = result.insertId;
    }

    const rewards = await exports.getRewards();
    return rewards.find((reward) => Number(reward.id) === Number(rewardId));
  } finally {
    connection.release();
  }
};

exports.updateRewardStatus = async (rewardId, active) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE rewards SET is_active = ? WHERE id = ?', [
      toBooleanNumber(active),
      rewardId,
    ]);
    const rewards = await exports.getRewards();
    return rewards.find((reward) => Number(reward.id) === Number(rewardId));
  } finally {
    connection.release();
  }
};

exports.getTiers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, name, min_points AS minPoints, max_points AS maxPoints, sort_order AS sortOrder
       FROM loyalty_tiers
       ORDER BY sort_order ASC, min_points ASC`,
    );
    return rows;
  } finally {
    connection.release();
  }
};

exports.updateTier = async (tierId, tierData) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE loyalty_tiers
       SET name = ?, min_points = ?, max_points = ?, sort_order = ?
       WHERE id = ?`,
      [
        tierData.name,
        Number(tierData.minPoints ?? tierData.threshold ?? 0),
        tierData.maxPoints === '' || tierData.maxPoints === undefined ? null : Number(tierData.maxPoints),
        Number(tierData.sortOrder || 0),
        tierId,
      ],
    );
    const tiers = await exports.getTiers();
    return tiers.find((tier) => Number(tier.id) === Number(tierId));
  } finally {
    connection.release();
  }
};
