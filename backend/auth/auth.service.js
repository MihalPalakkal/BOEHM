const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = {}; // Placeholder for database

exports.register = async (userData) => {
  const { email, password, name } = userData;
  
  if (users[email]) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, name, createdAt: new Date() };
  
  users[email] = user;

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });

  return { token, user: { email, name } };
};

exports.login = async (email, password) => {
  const user = users[email];
  
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });

  return { token, user: { email, name: user.name } };
};

exports.refreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret_key');
    const newToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    return { token: newToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
