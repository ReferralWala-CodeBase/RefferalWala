import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "../Navbar";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      const bearerToken = localStorage.getItem("token");
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${Fronted_API_URL}/user/notifications/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, remove the token and navigate to login
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
          throw new Error("Failed to fetch notifications");
          }
        }
        const data = await response.json();
        // console.log("Fetched notifications:", data); // Log data to check the response
        setNotifications(data || []); // Ensure we set the notifications array correctly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (postId) => {
    // console.log("Navigating to post ID:", postId); // Log the postId for debugging
    // Navigate to the job details page based on the postId
    navigate(`/appliedjobdetails/${postId}`);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <>
    <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
    <div className="p-4">
      <h2 className="text-lg font-semibold">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="p-3 bg-gray-100 rounded-md shadow-md text-sm text-gray-700 cursor-pointer"
              onClick={() => handleNotificationClick(notification.post._id)}
            >
              {notification.message || "New Notification"}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No notifications available</div>
      )}
    </div>
    </>
  );
};

export default NotificationsPage;
