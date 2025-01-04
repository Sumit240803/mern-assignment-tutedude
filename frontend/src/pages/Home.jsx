import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const API = import.meta.env.VITE_API_URL;

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
      })
      .catch(() => setError("Error fetching users"));

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

    // Fetch Friend Recommendations
    sendRequestWithToken(`${API}/api/user/friend-recommendations`, "GET")
      .then((response) => {
        setRecommendations(response.data.recommendations);
      })
      .catch(() => setError("Error fetching friend recommendations"))
      .finally(() => setLoading(false));
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

      {/* User List */}
      <h2 className="title">User List</h2>
      <h3>Friend Requests</h3>
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

        {/* Friend Recommendations */}
      <h3>Friend Recommendations</h3>
      <ul className="user-list">
        {recommendations.length === 0 ? (
          <li>No recommendations available</li>
        ) : (
          recommendations.map((recommendation) => (
            <li key={recommendation.user._id} className="user-item">
              <div>
                <strong>{recommendation.user.username}</strong>
                <p>Mutual Friends: {recommendation.mutualFriendsCount}</p>
                <p>
                  Common Interests:{" "}
                  {recommendation.commonInterests.length > 0
                    ? recommendation.commonInterests.join(", ")
                    : "None"}
                </p>
              </div>
              <button
                onClick={() => sendFriendRequest(recommendation.user._id)}
                className="friend-btn"
                disabled={actionLoading}
              >
                Send Friend Request
              </button>
            </li>
          ))
        )}
      </ul>

      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="user-list">
        {filteredUsers.length === 0 ? (
          <li>No users found</li>
        ) : (
          filteredUsers.map((user) => (
            <li key={user._id} className="user-item">
              {user.username}
              {user._id !== loggedInUserId && (
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="friend-btn"
                  disabled={actionLoading || isFriend(user._id) || isRequestPending(user._id)}
                >
                  {isFriend(user._id)
                    ? "Friend"
                    : isRequestPending(user._id)
                    ? "Request Sent"
                    : "Add Friend"}
                </button>
              )}
            </li>
          ))
        )}
      </ul>

      {/* Friend Requests */}
      

      

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
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
