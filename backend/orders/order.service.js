const pool = require('../config/database');

exports.getOrders = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.query(
      `SELECT id, user_id AS userId, status, total_amount AS totalAmount,
              delivery_address AS deliveryAddress, payment_method AS paymentMethod,
              notes, estimated_delivery_at AS estimatedDeliveryAt,
              cancelled_at AS cancelledAt, created_at AS createdAt, updated_at AS updatedAt
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return orders;
  } finally {
    connection.release();
  }
};

exports.getOrderById = async (orderId) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.query(
      `SELECT id, user_id AS userId, status, total_amount AS totalAmount,
              delivery_address AS deliveryAddress, payment_method AS paymentMethod,
              notes, estimated_delivery_at AS estimatedDeliveryAt,
              cancelled_at AS cancelledAt, created_at AS createdAt, updated_at AS updatedAt
       FROM orders
       WHERE id = ?`,
      [orderId]
    );

    if (orders.length === 0) throw new Error('Order not found');

    const [items] = await connection.query(
      `SELECT oi.id, oi.order_id AS orderId, oi.menu_item_id AS menuItemId,
              oi.quantity, oi.unit_price AS unitPrice, oi.subtotal, oi.notes,
              mi.name, mi.description, mi.image_url AS imageUrl
       FROM order_items oi
       JOIN menu_items mi ON mi.id = oi.menu_item_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...orders[0], items };
  } finally {
    connection.release();
  }
};

exports.createOrder = async (orderData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      userId,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes,
      estimatedDeliveryAt,
      items = [],
    } = orderData;

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (user_id, total_amount, delivery_address, payment_method, notes, estimated_delivery_at, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, totalAmount, deliveryAddress || null, paymentMethod || null, notes || null, estimatedDeliveryAt || null]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.menuItemId, item.quantity, item.unitPrice, item.notes || null]
      );
    }

    await connection.commit();

    const createdOrder = await exports.getOrderById(orderId);
    return createdOrder;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateOrder = async (orderId, orderData) => {
  const connection = await pool.getConnection();
  try {
    const fields = [];
    const values = [];

    if (orderData.status) {
      fields.push('status = ?');
      values.push(orderData.status);
    }
    if (orderData.deliveryAddress !== undefined) {
      fields.push('delivery_address = ?');
      values.push(orderData.deliveryAddress);
    }
    if (orderData.paymentMethod !== undefined) {
      fields.push('payment_method = ?');
      values.push(orderData.paymentMethod);
    }
    if (orderData.notes !== undefined) {
      fields.push('notes = ?');
      values.push(orderData.notes);
    }
    if (orderData.estimatedDeliveryAt !== undefined) {
      fields.push('estimated_delivery_at = ?');
      values.push(orderData.estimatedDeliveryAt);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(orderId);

    await connection.query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await exports.getOrderById(orderId);
  } finally {
    connection.release();
  }
};

exports.cancelOrder = async (orderId) => {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE orders
       SET status = 'cancelled', cancelled_at = NOW()
       WHERE id = ?`,
      [orderId]
    );

    const order = await exports.getOrderById(orderId);
    return { message: 'Order cancelled successfully', order };
  } finally {
    connection.release();
  }
};