import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

      try {
        const response = await fetch(`https://referralwala-deployment.vercel.app/job/user/${userId}/applications/statuses`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'No applications Found!! Start Applying for your dream Job. ');
        }

        const data = await response.json();
        setAppliedJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleViewJobDetails = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4">
        <div className="mt-2 flow-root">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : appliedJobs.length === 0 ? (
            <p>No applied jobs found.</p>
          ) : (
            <div className="max-w-7xl">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Role</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Job Unique ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applied On</th>
                    <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {appliedJobs.map((job) => (
                    <tr key={job.jobPostId._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {job.jobPostId.jobRole}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {job.jobPostId.companyName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {job.jobPostId.jobUniqueId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.status}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(job.appliedAt).toLocaleDateString()}</td>
                      <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewJobDetails(job.jobPostId._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Job
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
