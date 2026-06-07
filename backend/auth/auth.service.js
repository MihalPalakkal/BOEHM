const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

exports.register = async (userData) => {
  const { email, password, name } = userData;
  const connection = await pool.getConnection();

  try {
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );

    const token = jwt.sign(
      { id: result.insertId, email, name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: result.insertId, email, name } };
  } finally {
    connection.release();
  }
};

exports.login = async (email, password) => {
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(
      'SELECT id, email, password, name FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  } finally {
    connection.release();
  }
};

exports.refreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, name: decoded.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return { token: newToken };
  } catch {
    throw new Error('Invalid refresh token');
  }
};