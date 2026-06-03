import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { menuCategories, menuItems } from '../../services/menuService';
import { formatCurrency } from '../../services/currencyService';
import { useCart } from '../../context/CartContext';
import './Menu.css';

function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('recommended');
  const [lastAdded, setLastAdded] = useState('');
  const toastTimeoutRef = useRef(null);
  const { addItem, items, itemCount, subtotal, total } = useCart();

  const handleAddToCart = (product) => {
    addItem(product);
    setLastAdded(product.name);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setLastAdded(''), 2200);
  };

  const filteredItems = menuItems
    .filter((item) => activeCategory === 'All' || item.category === activeCategory)
    .filter((item) => {
      const searchableText = `${item.name} ${item.description} ${item.category} ${item.tags.join(' ')}`;
      return searchableText.toLowerCase().includes(query.toLowerCase());
    })
    .sort((first, second) => {
      if (sortMode === 'price-low') return first.price - second.price;
      if (sortMode === 'fastest') return Number.parseInt(first.prepTime, 10) - Number.parseInt(second.prepTime, 10);
      return first.id - second.id;
    });

  const getQuantity = (productId) => items.find((item) => item.id === productId)?.quantity || 0;

  return (
    <div className="menu-page">
      <section className="menu-hero section-shell">
        <div>
          <p className="eyebrow">Order direct</p>
          <h1>BOEHM menu</h1>
          <p>Filter the kitchen board, add dishes, and keep your cart in view.</p>
        </div>

        <div className="menu-search">
          <label htmlFor="menu-search-input">Search menu</label>
          <input
            id="menu-search-input"
            type="search"
            placeholder="Search burgers, bowls, dessert..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </section>

      <section className="section-shell menu-layout">
        <aside className="menu-sidebar" aria-label="Menu filters">
          <div className="filter-block">
            <h2>Categories</h2>
            <div className="category-list">
              {menuCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <label htmlFor="sort-menu">Sort</label>
            <select
              id="sort-menu"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="fastest">Fastest prep</option>
              <option value="price-low">Price: low to high</option>
            </select>
          </div>

          <div className="mini-cart">
            <span>{itemCount} items</span>
            <strong>{formatCurrency(subtotal)}</strong>
            <p>Estimated total {formatCurrency(total)}</p>
            <Link className="btn primary" to="/cart">Review cart</Link>
          </div>
        </aside>

        <div className="menu-content">
          <div className="menu-toolbar">
            <p>{filteredItems.length} dishes available</p>
            {lastAdded && <span>{lastAdded} added to cart</span>}
          </div>

          <div className="menu-grid">
            {filteredItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getQuantity(product.id)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
