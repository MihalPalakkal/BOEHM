import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Award, BarChart3, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Loyalty', path: '/admin/loyalty', icon: <Award size={20} /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)',
      zIndex: 10
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
          B
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '1px' }}>BOEHM</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(109, 40, 217, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(109, 40, 217, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s',
              fontWeight: isActive ? 500 : 400
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="btn btn-outline"
        style={{ width: '100%', marginTop: 'auto', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--danger)', justifyContent: 'center' }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
