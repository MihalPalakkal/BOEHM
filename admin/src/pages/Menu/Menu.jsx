import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Classic Burger', category: 'Mains', price: 250, available: true, pointsOnly: false, requiredPoints: 0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop' },
    { id: 2, name: 'Truffle Fries', category: 'Sides', price: 150, available: true, pointsOnly: false, requiredPoints: 0, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=100&h=100&fit=crop' },
    { id: 3, name: 'Vanilla Shake', category: 'Beverages', price: 120, available: false, pointsOnly: false, requiredPoints: 0, image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb876?w=100&h=100&fit=crop' },
    { id: 4, name: 'Secret Menu Item', category: 'Specials', price: 0, available: true, pointsOnly: true, requiredPoints: 500, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const toggleAvailability = (id) => {
    setMenuItems(items => items.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Menu Management</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add New Item
        </button>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 500 }}>
                  {item.name}
                  {item.pointsOnly && <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Points Only</span>}
                </td>
                <td>{item.category}</td>
                <td>{item.pointsOnly ? `${item.requiredPoints} pts` : `₹${item.price}`}</td>
                <td>
                  <button 
                    onClick={() => toggleAvailability(item.id)}
                    className={`badge ${item.available ? 'badge-success' : 'badge-danger'}`}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openEditModal(item)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => deleteItem(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.25rem' }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" defaultValue={editingItem?.name || ''} required />
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select className="form-input" defaultValue={editingItem?.category || 'Mains'}>
                    <option value="Mains">Mains</option>
                    <option value="Sides">Sides</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Specials">Specials</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" defaultValue={editingItem?.price || 0} />
                </div>
              </div>
              
              <div className="form-group flex items-center gap-2 mb-4">
                <input type="checkbox" id="available" defaultChecked={editingItem?.available ?? true} style={{ width: '1rem', height: '1rem' }} />
                <label htmlFor="available" style={{ color: 'var(--text-primary)' }}>Available for Order</label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Menu;
