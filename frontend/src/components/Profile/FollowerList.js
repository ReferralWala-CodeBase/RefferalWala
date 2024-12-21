import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';

export default function FollowerList() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userId = localStorage.getItem('userId');
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch(`https://referralwala-deployment.vercel.app/user/${userId}/followers`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch followers users');
        }

        const data = await response.json();
        setFollowers(data.followers || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  const navigate = useNavigate();

  const handleViewUserProfile = (userId) => {
    navigate(`/checkuserprofile/${userId}`);
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4">
        <div className="mt-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : followers.length === 0 ? (
            <p>You have no followers.</p>
          ) : (
            <div className="max-w-7xl">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Avatar</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> First Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"> Last Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    {/* <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {followers.map((user) => (
                    <tr key={user._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <img
                          className="h-11 w-11 rounded-full"
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
          )}
        </div>
      </div>
    </div>
  );
}
