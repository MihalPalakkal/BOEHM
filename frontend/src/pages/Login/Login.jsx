import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login successful!');
    // API call would go here
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <p className="subtitle">Welcome back to BOEHM</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-login">Sign In</button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Register here</a></p>
            <p><a href="#forgot">Forgot password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
