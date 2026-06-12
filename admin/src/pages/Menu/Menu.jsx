import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../api/adminService';

const emptyForm = {
  name: '',
  category: 'Specials',
  price: 0,
  description: '',
  image: '',
  prepTime: '12 min',
  calories: 0,
  spice: 0,
  accent: '#b42318',
  available: true,
  isFeatured: false,
  tags: '',
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchMenu = async () => {
    try {
      setError('');
      const response = await adminService.getMenuItems();
      setMenuItems(response.data || []);
    } catch {
      setError('Could not load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const categories = useMemo(
    () => [...new Set(menuItems.map((item) => item.category).filter(Boolean))],
    [menuItems],
  );

  const filteredItems = menuItems.filter((item) => {
    const text = `${item.name} ${item.category} ${item.description} ${(item.tags || []).join(' ')}`;
    return text.toLowerCase().includes(query.toLowerCase());
  });

  const showMessage = (nextMessage) => {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(''), 2200);
  };

  const toggleAvailability = async (item) => {
    try {
      const response = await adminService.updateMenuAvailability(item.id, !item.available);
      setMenuItems((items) => items.map((current) => (current.id === item.id ? response.data : current)));
    } catch {
      setError('Could not update item availability.');
    }
  };

  const archiveItem = async (item) => {
    if (!window.confirm(`Mark ${item.name} as unavailable?`)) return;

    try {
      const response = await adminService.archiveMenuItem(item.id);
      setMenuItems((items) => items.map((current) => (current.id === item.id ? response.data : current)));
      showMessage(`${item.name} marked unavailable.`);
    } catch {
      setError('Could not archive item.');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Specials',
      price: item.price || 0,
      description: item.description || '',
      image: item.image || '',
      prepTime: item.prepTime || '12 min',
      calories: item.calories || 0,
      spice: item.spice || 0,
      accent: item.accent || '#b42318',
      available: Boolean(item.available),
      isFeatured: Boolean(item.isFeatured),
      tags: (item.tags || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        calories: Number(formData.calories),
        spice: Number(formData.spice),
      };
      const response = editingItem
        ? await adminService.updateMenuItem(editingItem.id, payload)
        : await adminService.createMenuItem(payload);

      setMenuItems((items) =>
        editingItem
          ? items.map((item) => (item.id === editingItem.id ? response.data : item))
          : [...items, response.data],
      );
      setIsModalOpen(false);
      showMessage(editingItem ? 'Menu item updated.' : 'Menu item added.');
    } catch {
      setError('Could not save menu item.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Menu Management</h2>
          <p>Manage real menu items and live customer availability.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add New Item
        </button>
      </div>

      <div className="flex justify-between items-center mb-4" style={{ gap: '1rem' }}>
        <input
          className="form-input"
          type="search"
          placeholder="Search menu..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ maxWidth: '360px' }}
        />
        {message && <span className="badge badge-success">{message}</span>}
      </div>

      {error && <div className="badge badge-danger p-6 justify-center mb-4">{error}</div>}
      {loading && <div className="flex justify-center p-6"><div className="spinner"></div></div>}

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
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 500 }}>
                  {item.name}
                  {item.isFeatured && <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Featured</span>}
                </td>
                <td>{item.category}</td>
                <td>₹{Number(item.price || 0).toLocaleString('en-IN')}</td>
                <td>
                  <button
                    onClick={() => toggleAvailability(item)}
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
                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => archiveItem(item)}>
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
            style={{ width: '100%', maxWidth: '620px', padding: '2rem' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.25rem' }}>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" value={formData.description} onChange={handleChange} rows="3" />
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <input name="category" list="menu-categories" className="form-input" value={formData.category} onChange={handleChange} />
                  <datalist id="menu-categories">
                    {categories.map((category) => <option key={category} value={category} />)}
                  </datalist>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (₹)</label>
                  <input name="price" type="number" min="0" className="form-input" value={formData.price} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Prep time</label>
                  <input name="prepTime" className="form-input" value={formData.prepTime} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Calories</label>
                  <input name="calories" type="number" min="0" className="form-input" value={formData.calories} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="image" type="url" className="form-input" value={formData.image} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input name="tags" className="form-input" value={formData.tags} onChange={handleChange} placeholder="Best seller, Vegetarian" />
              </div>
              <div className="flex gap-4">
                <label className="form-group flex items-center gap-2 mb-4">
                  <input name="available" type="checkbox" checked={formData.available} onChange={handleChange} style={{ width: '1rem', height: '1rem' }} />
                  <span>Available for Order</span>
                </label>
                <label className="form-group flex items-center gap-2 mb-4">
                  <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} style={{ width: '1rem', height: '1rem' }} />
                  <span>Featured</span>
                </label>
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
