import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'
const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10); // You can adjust the size per page as needed
  const API = import.meta.env.VITE_API_URL;

  // Function to send API request with the token
  const sendRequestWithToken = (url, method, data = {}) => {
    const token = localStorage.getItem('token');
    return axios({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  };

  useEffect(() => {
    // Fetch users with pagination (page and size as query parameters)
    sendRequestWithToken(`${API}/api/user/all?page=${currentPage}&size=${size}`, 'GET')
      .then(response => {
        setUsers(response.data.users); // Set users from the response
        setFilteredUsers(response.data.users); // Set the initial filtered list
        setTotalPages(response.data.totalPages); // Set total pages for pagination
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching users');
        setLoading(false);
      });
  }, [currentPage, size]); // Fetch new data when currentPage or size changes

  // Filter users based on search term
  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  // Send friend request with token
  const sendFriendRequest = (userId) => {
    sendRequestWithToken(`${API}/api/user/friend-request`, 'POST', { userId })
      .then(response => {
        alert('Friend request sent!');
      })
      .catch(err => {
        alert('Failed to send friend request');
      });
  };

  // Handle next and prev page buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      <h2 className="title">User List</h2>
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="user-list">
        {filteredUsers.map(user => (
          <li key={user._id} className="user-item">
            {user.username}
            <button
              onClick={() => sendFriendRequest(user._id)}
              className="friend-btn"
            >
              Send Friend Request
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination buttons */}
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="page-info">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
