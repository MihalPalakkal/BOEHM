# BOEHM Architecture

## Overview
BOEHM is a full-stack restaurant ordering and loyalty management system.

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** Context API / Redux (optional)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Password Hashing:** bcryptjs
- **Notifications:** Firebase Cloud Messaging

### Database
- **Primary:** MySQL
- **ORM:** (To be determined - Sequelize/TypeORM)

## Project Structure

### Frontend (`/frontend`)
- **pages/**: Page components for different routes
- **components/**: Reusable UI components
- **services/**: API service modules
- **styles/**: CSS files
- **assets/**: Images and static files

### Backend (`/backend`)
- **auth/**: Authentication logic
- **orders/**: Order management
- **loyalty/**: Loyalty program
- **notifications/**: Notification services
- **middleware/**: Custom Express middleware
- **config/**: Configuration files
- **utils/**: Utility functions

### Database (`/database`)
- **schema.sql**: Database schema
- **seed.sql**: Sample data
- **migrations/**: Database migration scripts

## API Flow

1. User registers/logs in via Auth endpoints
2. JWT token is returned and stored in localStorage
3. Token is sent with each subsequent request
4. Auth middleware validates token on protected routes
5. Services handle business logic
6. Controllers return formatted responses

## Key Features

- User authentication and profile management
- Order management system
- Loyalty points and rewards
- Push notifications
- Admin dashboard
- Order tracking
