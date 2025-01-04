import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/navbar.css'
const Navbar = () => {
    const [token , setToken] = useState('');
  useEffect(()=>{
      const token = localStorage.getItem('token');
      setToken(token);

  },[])

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        
        {/* Conditionally render the Profile link if token is present */}
        {token ? (
          <li><Link to="/profile">Profile</Link></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
