import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'warning', message: 'Passwords do not match.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Creating account...' });

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const user = response.data?.user;
      const token = response.data?.token;

      login(user, token);

      setStatus({ type: 'success', message: 'Account created. Redirecting...' });
      navigate('/');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.error || 'Registration failed.',
      });
    }
  };

  return (
    <div className="register-page">
      <div className="auth-layout section-shell">
        <section className="auth-copy register-art">
          <p className="eyebrow">Join BOEHM</p>
          <h1>Rewards start with your first direct order.</h1>
          <p>
            Create an account for saved handoff details, loyalty points, and faster repeat orders.
          </p>
        </section>

        <div className="register-box">
          <h2>Create account</h2>
          <p className="subtitle">Set up your direct ordering profile.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {status && <p className={`form-status ${status.type}`}>{status.message}</p>}

            <button type="submit" className="btn-register" disabled={status?.type === 'loading'}>
              Create account
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;