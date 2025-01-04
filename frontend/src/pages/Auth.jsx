import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  console.log(API);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    hobbies: [],
  });

  const [newHobby, setNewHobby] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHobbyAdd = () => {
    if (newHobby.trim()) {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, newHobby.trim()],
      });
      setNewHobby('');
    }
  };

  const handleHobbyRemove = (hobbyToRemove) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((hobby) => hobby !== hobbyToRemove),
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isRegister
        ? `${API}/api/auth/register`
        : `${API}/api/auth/login`;

      const response = await axios.post(url, formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id', response.data.id);
        console.log('Success:', response.data);
        window.location.href = '/profile';
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
          {isRegister && (
            <div className="input-field">
              <label htmlFor="hobbies">Hobbies</label>
              <div className="hobby-input-container">
                <input
                  type="text"
                  id="hobbies"
                  name="hobbies"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                />
                <button type="button" className="add-hobby-btn" onClick={handleHobbyAdd}>
                  Add Hobby
                </button>
              </div>
              <ul className="hobbies-list">
                {formData.hobbies.map((hobby, index) => (
                  <li key={index} className="hobby-item">
                    {hobby}
                    <button
                      type="button"
                      className="remove-hobby-btn"
                      onClick={() => handleHobbyRemove(hobby)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
