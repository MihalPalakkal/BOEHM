import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Orders from './pages/Orders/Orders';
import Menu from './pages/Menu/Menu';
import Customers from './pages/Customers/Customers';
import Loyalty from './pages/Loyalty/Loyalty';
import Analytics from './pages/Analytics/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="menu" element={<Menu />} />
          <Route path="customers" element={<Customers />} />
          <Route path="loyalty" element={<Loyalty />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
