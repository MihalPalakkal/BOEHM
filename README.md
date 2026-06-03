# BOEHM - Restaurant Ordering & Loyalty System

A full-stack web application for restaurant ordering with integrated loyalty program and management dashboard.

## Features

- 🍔 **Browse & Order:** Easy-to-use menu browsing and ordering system
- 🛒 **Shopping Cart:** Manage items before checkout
- 👤 **User Accounts:** Registration, login, and profile management
- 🎁 **Loyalty Program:** Points-based rewards system with multiple tiers
- 📊 **Order Tracking:** Real-time order status updates
- 🔔 **Notifications:** Push notifications for order updates
- 👨‍💼 **Admin Dashboard:** Manage menu, orders, and analytics

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Firebase Messaging

## Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/MihalPalakkal/BOEHM.git
cd BOEHM
```

2. **Backend Setup:**
```bash
cd backend
npm install
# Create .env file with required variables
npm run dev
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
# Create .env file
npm run dev
```

4. **Database Setup:**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p boehm < database/seed.sql
```

## Documentation

- [API Documentation](docs/API.md) - REST API endpoints
- [Architecture](docs/architecture.md) - System design
- [Setup Guide](docs/setup.md) - Detailed setup instructions
- [Sprint Plan](docs/sprint-plan.md) - Project timeline
- [Task Allocation](docs/task-allocation.md) - Team responsibilities

## Project Structure

```
BOEHM/
├── frontend/           # React frontend application
├── backend/            # Express.js backend API
├── database/           # Database schema and migrations
├── admin/              # Admin dashboard
├── docs/               # Project documentation
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `GET /api/orders/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:orderId` - Update order

### Loyalty
- `GET /api/loyalty/user/:userId` - Get loyalty info
- `GET /api/loyalty/rewards/:userId` - Get available rewards
- `POST /api/loyalty/redeem` - Redeem reward

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Contact

**Author:** Mihal Palakkal

For support, open an issue on GitHub.

---

**Happy Ordering! 🚀**
