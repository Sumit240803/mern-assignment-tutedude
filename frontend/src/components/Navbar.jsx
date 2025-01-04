import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // useHistory for redirecting after logout
import '../components/navbar.css';

const Navbar = () => {
  const [token, setToken] = useState('');
   // Hook for navigating programmatically

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setToken('');  // Update state to reflect the logged-out status
    window.location.href = '/'  // Redirect to the login page
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/">Home</Link>
      </div>
      <ul>
        {/* Conditionally render Profile and Logout if token is present */}
        {token ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
