import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');

  // Mock Data
  const dailyData = [
    { name: '1 Nov', orders: 45, revenue: 12500 },
    { name: '5 Nov', orders: 52, revenue: 15600 },
    { name: '10 Nov', orders: 38, revenue: 9800 },
    { name: '15 Nov', orders: 65, revenue: 19500 },
    { name: '20 Nov', orders: 48, revenue: 13400 },
    { name: '25 Nov', orders: 70, revenue: 22000 },
    { name: '30 Nov', orders: 55, revenue: 16500 },
  ];

  const hourlyData = [
    { name: '10 AM', orders: 12 },
    { name: '12 PM', orders: 45 },
    { name: '2 PM', orders: 30 },
    { name: '4 PM', orders: 15 },
    { name: '6 PM', orders: 55 },
    { name: '8 PM', orders: 85 },
    { name: '10 PM', orders: 40 },
  ];

  const topItems = [
    { name: 'Classic Burger', count: 320 },
    { name: 'Truffle Fries', count: 280 },
    { name: 'Spicy Chicken Wings', count: 210 },
    { name: 'Vanilla Shake', count: 190 },
    { name: 'Margherita Pizza', count: 150 },
  ];

  const tierData = [
    { name: 'Silver', value: 450, color: '#d1d5db' },
    { name: 'Gold', value: 300, color: '#f59e0b' },
    { name: 'Platinum', value: 150, color: '#c084fc' },
  ];

  const SummaryCard = ({ title, value, icon, trend }) => (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{value}</h3>
        </div>
        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)' }}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1" style={{ color: trend >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '0.875rem', fontWeight: 500 }}>
        <TrendingUp size={16} style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none' }} />
        <span>{Math.abs(trend)}% vs last period</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Performance Analytics</h2>
        <div className="flex items-center gap-2 glass-panel" style={{ padding: '0.25rem 1rem', borderRadius: '20px' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <select 
            className="form-input" 
            style={{ border: 'none', background: 'transparent', padding: '0.5rem', cursor: 'pointer' }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <SummaryCard title="Total Revenue" value="₹2,45,000" icon={<DollarSign />} trend={12.5} />
        <SummaryCard title="Total Orders" value="1,248" icon={<ShoppingBag />} trend={8.2} />
        <SummaryCard title="Average Order Value" value="₹452" icon={<DollarSign />} trend={-2.4} />
        <SummaryCard title="New Customers" value="342" icon={<Users />} trend={18.7} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel p-6">
          <h3 className="mb-6" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Revenue & Orders Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis yAxisId="left" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue (₹)" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="var(--info)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="mb-6" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Customer Tiers</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {tierData.map(tier => (
              <div key={tier.name} className="flex items-center gap-1" style={{ fontSize: '0.875rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: tier.color }}></div>
                {tier.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel p-6">
          <h3 className="mb-6" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Peak Hours</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="orders" stroke="var(--accent-secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="mb-6" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Top Selling Items</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis dataKey="name" type="category" stroke="var(--text-primary)" tick={{fill: 'var(--text-primary)', fontSize: '12px'}} width={100} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Orders" fill="var(--success)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Points Issued</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>1,250,400</h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Points Redeemed</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)', marginTop: '0.25rem' }}>845,200</h3>
          </div>
        </div>

        <div className="glass-panel p-6">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>New Customers</td>
                <td style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 600 }}>342 (24%)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Returning Customers</td>
                <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>1,083 (76%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
