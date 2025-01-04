import React, { useState } from 'react';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here based on isRegister state
    if (isRegister) {
      // Register logic (you can send a POST request to your server for registration)
      console.log('Registering:', formData);
    } else {
      // Login logic (send a POST request to your server for login)
      console.log('Logging in:', formData);
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
          <button type="submit" className="submit-btn">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="toggle-link">
          <p>
            {isRegister ? 'Already have an account?' : 'Don’t have an account?'}
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
