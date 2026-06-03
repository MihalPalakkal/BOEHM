import React, { useMemo, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { formatCurrency } from '../../services/currencyService';
import {
  getStoredCustomMenuItems,
  removeCustomMenuItem,
  saveCustomMenuItem,
} from '../../services/menuService';
import './MenuManager.css';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Specials',
  prepTime: '12 min',
  calories: '450',
  tags: 'New, House special',
  image: '',
  accent: '#b42318',
};

function MenuManager() {
  const [formData, setFormData] = useState(emptyForm);
  const [customItems, setCustomItems] = useState(() => getStoredCustomMenuItems());
  const [status, setStatus] = useState('');

  const previewItem = useMemo(
    () => ({
      id: 'preview',
      name: formData.name || 'New menu item',
      description:
        formData.description || 'Short description customers will see on the menu.',
      price: Number(formData.price) || 299,
      category: formData.category || 'Specials',
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
      prepTime: formData.prepTime || '12 min',
      calories: Number(formData.calories) || 450,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      accent: formData.accent,
    }),
    [formData],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Choose an image file.');
      return;
    }

    if (file.size > 1_200_000) {
      setStatus('Use an image under 1.2 MB for browser-only storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((currentForm) => ({ ...currentForm, image: reader.result }));
      setStatus('Image added to preview.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !Number(formData.price)) {
      setStatus('Name and rupee price are required.');
      return;
    }

    const savedItem = saveCustomMenuItem(previewItem);
    setCustomItems((currentItems) => [savedItem, ...currentItems]);
    setFormData(emptyForm);
    setStatus(`${savedItem.name} is now available on the menu.`);
  };

  const handleRemove = (itemId) => {
    const nextItems = removeCustomMenuItem(itemId);
    setCustomItems(nextItems);
    setStatus('Custom item removed from this browser.');
  };

  return (
    <div className="menu-manager-page">
      <section className="section-shell page-heading split">
        <div>
          <p className="eyebrow">Frontend-only admin</p>
          <h1>Menu manager</h1>
          <p>Add dishes and food photos for this browser session.</p>
        </div>
        <div className="manager-count">
          <strong>{customItems.length}</strong>
          <span>custom items</span>
        </div>
      </section>

      <section className="section-shell manager-layout">
        <form className="manager-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Dish details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-name">Name</label>
                <input
                  id="item-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Paneer Tikka Pizza"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="item-price">Price in rupees</label>
                <input
                  id="item-price"
                  name="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="349"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-description">Description</label>
              <textarea
                id="item-description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Smoky paneer, mozzarella, onions, coriander chutney, crisp crust."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-category">Category</label>
                <input
                  id="item-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="item-prep">Prep time</label>
                <input
                  id="item-prep"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="item-calories">Calories</label>
                <input
                  id="item-calories"
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="item-accent">Accent color</label>
                <input
                  id="item-accent"
                  name="accent"
                  type="color"
                  value={formData.accent}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-tags">Tags</label>
              <input
                id="item-tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Vegetarian, Spicy, Best seller"
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Food photo</h2>
            <div className="form-group">
              <label htmlFor="item-image-upload">Upload image</label>
              <input
                id="item-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <div className="form-group">
              <label htmlFor="item-image">Or paste image URL</label>
              <input
                id="item-image"
                name="image"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {status && <p className="manager-status">{status}</p>}
            <button type="submit" className="btn-submit">Save item</button>
          </section>
        </form>

        <aside className="manager-preview">
          <div className="section-heading">
            <p className="eyebrow">Preview</p>
            <h2>Customer menu card</h2>
          </div>
          <ProductCard product={previewItem} onAddToCart={() => {}} />
        </aside>
      </section>

      <section className="section-shell custom-items-section">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Saved locally</p>
            <h2>Custom menu items</h2>
          </div>
        </div>

        {customItems.length === 0 ? (
          <div className="empty-custom-list">
            <h3>No custom items yet</h3>
            <p>Saved dishes will appear here and on the customer menu.</p>
          </div>
        ) : (
          <div className="custom-items-grid">
            {customItems.map((item) => (
              <article className="custom-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{formatCurrency(item.price)}</p>
                </div>
                <button type="button" onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MenuManager;
