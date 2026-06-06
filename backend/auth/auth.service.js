const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.register = async (userData) => {
  const { email, password, name } = userData;
  
  const connection = await pool.getConnection();
  
  try {
    // Check if user exists
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      throw new Error('User already exists');
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    
    // Create JWT token
    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    
    return { token, user: { id: result.insertId, email, name } };
  } finally {
    connection.release();
  }
};

exports.login = async (email, password) => {
  const connection = await pool.getConnection();
  
  try {
    const [users] = await connection.query('SELECT id, password, name FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    
    return { token, user: { id: user.id, email, name: user.name } };
  } finally {
    connection.release();
  }
};

exports.refreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret_key');
    const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    return { token: newToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
