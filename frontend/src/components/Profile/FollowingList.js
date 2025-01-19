import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";

export default function FollowingList() {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  useEffect(() => {
    const fetchFollowing = async () => {
      const userId = localStorage.getItem('userId');
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch(`${Fronted_API_URL}/user/${userId}/following`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            // Unauthorized, remove the token and navigate to login
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
            throw new Error(errorData.msg || 'Failed to fetch following users');
          }
        }

        const data = await response.json();
        setFollowing(data.following || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const navigate = useNavigate();

  const handleViewUserProfile = (userId) => {
    navigate(`/checkuserprofile/${userId}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 mx-auto">
          <div className="mt-2">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : following.length === 0 ? (
              <p>You are not following anyone.</p>
            ) : (
              <div className="max-w-7xl">
                {/* For large screens, show table layout */}
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Avatar</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">First Name</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Name</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {following.map((user) => (
                        <tr key={user._id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <img
                              className="h-11 w-11 rounded-full mx-auto mb-4 border-2 p-1 border-gray-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
                              src={user.profilePhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                              alt="avatar"
                            />

                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            {user.firstName || ''}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                            {user.lastName || ''}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email || ''}</td>
                          <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleViewUserProfile(user._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* For small screens, show card layout */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {following.map((user) => (
                    <div key={user._id} className="p-4 border rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <img
                          className="h-16 w-16 rounded-full mx-auto mb-4 border-2 p-1 border-gray-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
                          src={user.profilePhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                          alt="avatar"
                        />
                        <div className="ml-4">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => handleViewUserProfile(user._id)}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          View Profile
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
