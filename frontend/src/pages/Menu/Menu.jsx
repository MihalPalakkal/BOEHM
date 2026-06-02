import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Menu.css';

function Menu() {
  const [cart, setCart] = useState([]);
  const [products] = useState([
    { id: 1, name: 'Burger Deluxe', description: 'Premium beef burger', price: 12.99, image: '/images/burger.jpg' },
    { id: 2, name: 'Caesar Salad', description: 'Fresh greens', price: 8.99, image: '/images/salad.jpg' },
    { id: 3, name: 'Grilled Chicken', description: 'Seasoned chicken', price: 14.99, image: '/images/chicken.jpg' },
    { id: 4, name: 'Pasta Carbonara', description: 'Creamy Italian pasta', price: 13.99, image: '/images/pasta.jpg' },
  ]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      <div className="menu-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
