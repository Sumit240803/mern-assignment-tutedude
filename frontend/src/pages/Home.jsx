import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const API = import.meta.env.VITE_API_URL;

  // Get the logged-in user's ID
  const loggedInUserId = localStorage.getItem("id");

  const sendRequestWithToken = (url, method, data = {}) => {
    const token = localStorage.getItem("token");
    return axios({
      url,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
  };

  const fetchData = () => {
    setLoading(true);
    sendRequestWithToken(`${API}/api/user/all?page=${currentPage}&size=${size}`, "GET")
      .then((response) => {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching users");
        setLoading(false);
      });

    sendRequestWithToken(`${API}/api/user/friends`, "GET")
      .then((response) => {
        setFriends(response.data.friends);
      })
      .catch(() => setError("Error fetching friends"));

    sendRequestWithToken(`${API}/api/user/friend-requests`, "GET")
      .then((response) => {
        setRequests(response.data.requests);
      })
      .catch(() => setError("Error fetching friend requests"));
  };

  useEffect(fetchData, [currentPage]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const sendFriendRequest = (userId) => {
    setActionLoading(true);
    sendRequestWithToken(`${API}/api/user/send-request/${userId}`, "POST")
      .then(() => {
        alert("Friend request sent!");
        fetchData();
      })
      .catch(() => alert("Failed to send friend request"))
      .finally(() => setActionLoading(false));
  };

  const handleRequest = (userId, action) => {
    setActionLoading(true);
    sendRequestWithToken(`${API}/api/user/handle-request/${userId}`, "POST", { action })
      .then(() => {
        alert(action === "accept" ? "Friend request accepted!" : "Friend request rejected!");
        fetchData();
      })
      .catch(() => alert("Error handling friend request"))
      .finally(() => setActionLoading(false));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const isFriend = (userId) => friends.some((friend) => friend._id === userId);
  const isRequestPending = (userId) =>
    requests.some((request) => request._id === userId);

  return (
    <div className="home-container">
      <h2 className="title">User List</h2>
      
      <div className="section-container">
        <h3 className="section-title">Friends List</h3>
        <ul className="user-list">
          {friends.length === 0 ? (
            <li>No friends yet</li>
          ) : (
            friends.map((friend) => (
              <li key={friend._id} className="user-item">
                {friend.username}
              </li>
            ))
          )}
        </ul>
      </div>
  
      <div className="section-container">
        <h3 className="section-title">Friend Requests</h3>
        <ul className="user-list">
          {requests.length === 0 ? (
            <li>No friend requests</li>
          ) : (
            requests.map((request) => (
              <li key={request._id} className="user-item">
                {request.username}
                <button
                  onClick={() => handleRequest(request._id, "accept")}
                  className="accept-btn"
                  disabled={actionLoading}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, "reject")}
                  className="reject-btn"
                  disabled={actionLoading}
                >
                  Reject
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
  
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
  
      <ul className="user-list">
        {filteredUsers.map((user) => (
          <li key={user._id} className="user-item">
            <div>
              <strong>{user.username}</strong>
              {user.hobbies.length > 0 ? (
                <ul className="hobbies-list">
                  {user.hobbies.map((hobby, index) => (
                    <li key={index} className="hobby-item">
                      {hobby}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hobbies listed</p>
              )}
            </div>
            {!isFriend(user._id) &&
              !isRequestPending(user._id) &&
              user._id !== loggedInUserId && (
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="friend-btn"
                  disabled={actionLoading}
                >
                  Send Friend Request
                </button>
              )}
          </li>
        ))}
      </ul>
  
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
