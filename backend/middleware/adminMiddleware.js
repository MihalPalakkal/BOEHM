module.exports = (req, res, next) => {
  const expectedToken = process.env.ADMIN_TOKEN || 'dummy-test-token-123';
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin access required' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }

  next();
};
