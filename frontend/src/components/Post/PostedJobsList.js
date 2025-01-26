import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";

export default function PostedJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  useEffect(() => {
    const fetchJobs = async () => {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`${Fronted_API_URL}/job/user/${userId}`, {
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
          throw new Error(errorData.message || 'Failed to fetch jobs');
          }
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const navigate = useNavigate();

  const handleEdit = (jobId) => {
    navigate(`/editpostedjob/${jobId}`);
  };

  const handleView = (jobId) => {
    navigate(`/viewpostedjob/${jobId}`);
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/jobapplicantslist/${jobId}`);
  };

  const filteredJobs = jobs && Object.fromEntries(
    Object.entries(jobs).filter(([id, job]) => {
      return !job.hidden && (
        job?.jobUniqueId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.companyName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.jobRole?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.location?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.workMode?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  );

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative" >
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 m-auto">
          {/* Table */}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="m-4 ml-10 px-4 py-3 border-2 rounded w-3/4 bg-[#FFFFFF] border-none text-black p-8"
          />
          <div className="mt-2 flow-root">
            {loading ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-xl" />
              </div>
            ) : error ? (
              error === "Start building your dream team-post your first job!" ? ( // Handle specific 404 error message
                <div className="flex mt-4">
                  <p className="text-gray-700 mr-3 mt-1">{error}</p>
                  <button
                    onClick={() => navigate('/postjob')} // Navigate to job creation
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Job
                  </button>
                </div>
              ) : (
                <p className="text-red-500">{error}</p>
              )
            ) : jobs.length === 0 ? (
              <p>No jobs found.</p>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Display Table View for Larger Screens */}
  <div className="hidden lg:block overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
            Job Unique ID
          </th>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Job Role
          </th>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Company Name
          </th>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Location
          </th>
          <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
            Status
          </th>
          <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
          <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {Object.entries(filteredJobs).map(([id, job]) => (
          <tr key={job._id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {job.jobUniqueId}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {job.jobRole}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {job.companyName}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {job.location}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {job.status === "inactive" ? "Closed" : job.status}
            </td>
            <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
              <button
                onClick={() => handleView(job._id)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                View/Edit
              </button>
            </td>
            <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
              <button
                onClick={() => handleViewApplicants(job._id)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                View Applicants
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Display Card View for Smaller and Tablet Screens */}
  <div className="block lg:hidden">
    {Object.entries(filteredJobs).map(([id, job]) => (
      <div
        key={job._id}
        className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow"
      >
        <p className="text-sm font-medium text-gray-900">
          <strong>Job Unique ID:</strong> {job.jobUniqueId}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Job Role:</strong> {job.jobRole}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Company Name:</strong> {job.companyName}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Status:</strong> {job.status === "inactive" ? "Closed" : job.status}
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => handleView(job._id)}
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            View/Edit
          </button>
          <button
            onClick={() => handleViewApplicants(job._id)}
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            View Applicants
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
