import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to BOEHM Restaurant</h1>
        <p>Discover delicious food and earn rewards</p>
        <a href="/menu" className="btn btn-primary">Browse Menu</a>
      </div>
      
      <section className="features-section">
        <h2>Why Choose BOEHM?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>🍽️ Quality Food</h3>
            <p>Fresh and delicious meals prepared daily</p>
          </div>
          <div className="feature">
            <h3>⚡ Quick Service</h3>
            <p>Fast delivery right to your door</p>
          </div>
          <div className="feature">
            <h3>🎁 Loyalty Rewards</h3>
            <p>Earn points on every order</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
