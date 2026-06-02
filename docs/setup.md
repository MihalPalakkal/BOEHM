# BOEHM Setup Guide

## Prerequisites
- Node.js 16+
- npm or yarn
- MySQL 8.0+
- Git

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/boehm
JWT_SECRET=your_secret_key
FIREBASE_API_KEY=your_firebase_key
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Setup

1. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE boehm;
```

2. Run schema:
```bash
mysql -u root -p boehm < database/schema.sql
```

3. Run seed data:
```bash
mysql -u root -p boehm < database/seed.sql
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Build

### Backend
```bash
cd backend
npm install --production
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in `dist/` directory.
