import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setStatus({ type: 'loading', message: 'Signing in...' });

    try {
      const response = await authService.login(formData.email, formData.password);
      const user = response.data?.user;
      const token = response.data?.token;

      if (token) authService.setToken(token);
      if (user) authService.setCurrentUser(user);

      setStatus({ type: 'success', message: 'Signed in. Redirecting...' });
      navigate('/');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.error || 'Login failed.',
      });
    }
  };

  return (
    <div className="login-page">
      <div className="auth-layout section-shell">
        <section className="auth-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in before checkout or keep browsing the menu.</h1>
          <p>
            Save addresses, earn rewards, and reorder favorites from one direct BOEHM account.
          </p>
        </section>

        <div className="login-box">
          <h2>Login</h2>
          <p className="subtitle">Use your BOEHM account details.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {status && <p className={`form-status ${status.type}`}>{status.message}</p>}

            <button type="submit" className="btn-login" disabled={status?.type === 'loading'}>
              Sign in
            </button>
          </form>

          <div className="login-footer">
            <p>
              New to BOEHM? <Link to="/register">Create an account</Link>
            </p>
            <p>
              <Link to="/menu">Continue as guest</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;