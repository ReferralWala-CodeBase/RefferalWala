import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";

export default function PostedJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch('https://referralwala-deployment.vercel.app/job/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch jobs');
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

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4">
        {/* Table */}
        <div className="mt-2 flow-root">
          {loading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-xl" />
            </div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <div className="max-w-7xl">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Unique ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Role</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    {/* <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th> */}
                    <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                    <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                    <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{job.jobUniqueId}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.jobRole}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.companyName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.location}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.status}</td>
                      {/* <td className="relative py-4 pl-3 pr-2 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(job._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td> */}
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
          )}
        </div>
      </div>
    </div>
  );
}
