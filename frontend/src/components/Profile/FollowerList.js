import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Loader from '../Loader';
import busi from "../../assets/company.png";
import vid1 from "../../assets/vid1.mp4";
import person from '../../assets/person.png'
import noSignal from "../../assets/noSignal.jpg";
import ServerError from '../ServerError';

export default function FollowerList() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userId = localStorage.getItem('userId');
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch(`${Fronted_API_URL}/user/${userId}/followers`, {
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
            throw new Error(errorData.msg || 'Failed to fetch followers users');
          }
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

  const handleShowJob = async (applicantId) => {
    setIsModalOpen(true); // Open the modal
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${Fronted_API_URL}/job/user/${applicantId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          throw new Error('Failed to fetch profile data');
        }

      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error(error.message);
    }
  }

  const handleViewDetails = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
  };

  const handleViewUserProfile = (userId) => {
    navigate(`/checkuserprofile/${userId}`);
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 mx-auto ">
          <div className="mt-2">
            {loading ? (
              <Loader />
            ) : error ? (
              <ServerError />
            ) : followers.length === 0 ? (
              <div className="flex justify-center items-center h-[70vh] mx-auto text-center">
                <div>
                  <video
                    src={vid1}
                    className="w-60 h-60 mx-auto mb-4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <p className="text-xl font-light">You have no followers !</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl md:mr-2">
                <div className="hidden md:block">
                  <table className="min-w-full border border-gray-200 rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200/80">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Avatar</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">First Name</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Last Name</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {followers.map((user) => (
                        <tr
                          key={user?._id}
                          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => handleViewUserProfile(user?._id)}
                        >
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                            <img
                              className="h-12 w-12 rounded-full mx-auto border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                              src={user?.profilePhoto || person}
                              alt="avatar"
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                            {user?.firstName || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                            {user?.lastName || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                            {user?.email || '—'}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowJob(user?._id);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 font-medium transition duration-200"
                            >
                              View Job Posted
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="mx-4 relative bg-white rounded-lg shadow-lg w-100 max-h-[80vh] overflow-hidden">
                      {/* Sticky Header */}
                      <div className="sticky top-0 bg-white z-10 border-b rounded-t-lg">
                        {/* Close Icon */}
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setJobs([]);
                          }}
                          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes className='w-6 h-6' />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center py-4">Posted Jobs</h2>
                      </div>

                      {/* Modal Content */}
                      <div className="overflow-auto max-h-[70vh] p-4 hide-scrollbar">
                        {jobs.length > 0 ? (
                          <ul className="space-y-2">
                            {jobs.map((job) => (
                              <li
                                key={job._id}
                                onClick={() => job.status === "active" && handleViewDetails(job._id)}
                                className={`p-4 border rounded-md bg-gray-100 shadow-sm flex items-center justify-between cursor-pointer ${job.status === "inactive" ? "opacity-50 pointer-events-none" : ""
                                  }`}
                              >
                                <img
                                  src={job.companyLogoUrl || busi}
                                  alt={job.companyName}
                                  className="w-10 h-10 sm:w-16 sm:h-16 mr-4"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-base sm:text-lg md:text-xl">{job.jobRole}</h3>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === "active"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                      {job.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                  <p className="text-sm sm:text-base text-gray-600">{job.companyName}</p>
                                  <p className="text-sm sm:text-base text-gray-500">Location: {job.location}</p>
                                  <p className="text-sm sm:text-base text-gray-500">
                                    End Date: {new Date(job.endDate).toLocaleDateString("en-GB")}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No jobs posted by this user.</p>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* For small screens, show card layout */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {followers.map((user) => (
                    <div key={user?._id} className="p-4 border rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 sm:h-16 sm:w-16 rounded-full mx-auto mb-4 border-2 p-1 border-gray-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
                          src={user?.profilePhoto || person}
                          alt="avatar"
                        />
                        <div className="ml-4">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-center gap-2">
                        <button
                          onClick={() => handleViewUserProfile(user?._id)}
                          className="px-3 text-xs font-normal bg-blue-600 py-1 text-white rounded-full"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleShowJob(user?._id)}
                          className="px-3 text-xs font-normal bg-gray-200 py-1 text-black rounded-full"
                        >
                          Posted Job
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
