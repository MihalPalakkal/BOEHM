import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import adminService from '../../api/adminService';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersRes, menuRes, rewardsRes] = await Promise.all([
          adminService.getOrders(),
          adminService.getMenuItems(),
          adminService.getRewards(),
        ]);

        setOrders(ordersRes.data || []);
        setMenuItems(menuRes.data || []);
        setRewards(rewardsRes.data || []);
      } catch {
        setError('Could not load admin overview.');
      }
    };

    loadDashboard();
  }, []);

  const activeOrders = orders.filter((order) => !['delivered', 'cancelled'].includes(order.status));
  const todayRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders],
  );

  const cards = [
    { label: 'Active orders', value: activeOrders.length, icon: <ShoppingBag size={20} />, to: '/admin/orders' },
    { label: 'Menu items', value: menuItems.length, icon: <LayoutDashboard size={20} />, to: '/admin/menu' },
    { label: 'Rewards', value: rewards.length, icon: <Award size={20} />, to: '/admin/loyalty' },
    { label: 'Revenue loaded', value: `₹${todayRevenue.toLocaleString('en-IN')}`, icon: <Users size={20} />, to: '/admin/analytics' },
  ];

  return (
    <div className="animate-fade-in flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Admin overview</h2>
          <p>Jump into live orders, menu availability, and loyalty configuration.</p>
        </div>
      </div>

      {error && <div className="badge badge-danger p-6 justify-center">{error}</div>}

      <div className="admin-card-grid">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="admin-metric-card glass-panel">
            <span>{card.icon}</span>
            <strong>{card.value}</strong>
            <small>{card.label}</small>
          </Link>
        ))}
      </div>

      <div className="glass-panel p-6">
        <h3>Latest orders</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.status.replaceAll('_', ' ')}</td>
                  <td>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
