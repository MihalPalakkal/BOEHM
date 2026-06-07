const pool = require('../config/database');

exports.getUserProfile = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, email, name, phone, profile_picture AS profilePicture, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) throw new Error('User not found');
    return rows[0];
  } finally {
    connection.release();
  }
};

exports.updateUserProfile = async (userId, userData) => {
  const connection = await pool.getConnection();
  try {
    const fields = [];
    const values = [];

    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.phone !== undefined) {
      fields.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.profilePicture !== undefined) {
      fields.push('profile_picture = ?');
      values.push(userData.profilePicture);
    }

    if (fields.length === 0) throw new Error('No fields to update');

    values.push(userId);

    await connection.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await exports.getUserProfile(userId);
  } finally {
    connection.release();
  }
};

exports.getUserPreferences = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT preference_key AS preferenceKey, preference_value AS preferenceValue
       FROM user_preferences
       WHERE user_id = ?`,
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
};

exports.updateUserPreferences = async (userId, preferences) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM user_preferences WHERE user_id = ?', [userId]);

    for (const [key, value] of Object.entries(preferences)) {
      await connection.query(
        `INSERT INTO user_preferences (user_id, preference_key, preference_value)
         VALUES (?, ?, ?)`,
        [userId, key, String(value)]
      );
    }

    await connection.commit();
    return await exports.getUserPreferences(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.deleteUser = async (userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE users SET is_active = FALSE WHERE id = ?', [userId]);
    return { message: 'User deleted successfully' };
  } finally {
    connection.release();
  }
};