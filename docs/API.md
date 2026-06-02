# BOEHM API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header.

```
Authorization: Bearer <token>
```

## Endpoints

### Auth Endpoints

#### Register
- **POST** `/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Order Endpoints

#### Get User Orders
- **GET** `/orders/:userId`
- **Headers:** Authorization required

#### Get Order Details
- **GET** `/orders/detail/:orderId`
- **Headers:** Authorization required

#### Create Order
- **POST** `/orders`
- **Headers:** Authorization required

#### Update Order
- **PUT** `/orders/:orderId`
- **Headers:** Authorization required

#### Cancel Order
- **PUT** `/orders/:orderId/cancel`
- **Headers:** Authorization required

### Loyalty Endpoints

#### Get User Loyalty
- **GET** `/loyalty/user/:userId`
- **Headers:** Authorization required

#### Get User Rewards
- **GET** `/loyalty/rewards/:userId`
- **Headers:** Authorization required

#### Redeem Reward
- **POST** `/loyalty/redeem`
- **Headers:** Authorization required
- **Body:**
```json
{
  "userId": "123",
  "rewardId": "456"
}
```

#### Get Loyalty Tiers
- **GET** `/loyalty/tiers`

#### Get User Points
- **GET** `/loyalty/points/:userId`
- **Headers:** Authorization required
