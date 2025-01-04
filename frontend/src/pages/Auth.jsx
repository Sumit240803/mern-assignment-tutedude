import React, { useState } from 'react';
import axios from 'axios';
import './auth.css'
const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const API= import.meta.env.VITE_API_URL;
  console.log(API)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isRegister
        ? `${API}/api/auth/register` // Update with your register API endpoint
        : `${API}/api/auth/login`; // Update with your login API endpoint

      const response = await axios.post(url, formData);
      if (response.data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Success:', response.data);
        // Redirect to the dashboard or home page
        window.location.href = '/'; // Change to your desired redirect URL
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Something went wrong!');
      console.log('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : isRegister ? 'Register' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="toggle-link">
          <p>
            {isRegister ? 'Already have an account?' : "Don’t have an account?"}
            <span
              className="toggle-btn"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? ' Login' : ' Register'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
