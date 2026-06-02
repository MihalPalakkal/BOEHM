const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./auth/auth.routes');
const orderRoutes = require('./orders/order.routes');
const loyaltyRoutes = require('./loyalty/loyalty.routes');

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// Error handling middleware
const errorMiddleware = require('./middleware/errorMiddleware');
app.use(errorMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
