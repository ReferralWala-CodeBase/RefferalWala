import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';

export default function JobApplicantsList() {
  const { jobId } = useParams(); // Get jobId from URL params
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch(`https://referralwala-deployment.vercel.app/job/applicants/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch applicants');
        }

        const data = await response.json();
        setApplicants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const navigate = useNavigate();

  // const handleViewApplicantDetails = (applicantId) => {
  //   navigate(`/viewapplicantprofile/${applicantId}`); 
  // };
  const handleViewApplicantDetails = (applicantId) => {
    navigate(`/viewapplicantprofile/${applicantId}`, {
      state: { jobId },
    });
  };

  const filteredApplicants = applicants && Object.fromEntries(
    Object.entries(applicants).filter(([id, applicant]) => {
      return (
        !applicant.hidden &&
        (
          applicant?.userId?.firstName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant?.userId?.lastName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant?.userId?.email?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant?.appliedAt?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant?.status?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    })
  );
  

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4">
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-3 border-2 rounded w-full bg-[#FFFFFF] border-none text-black"
      />
        {/* Table */}
        <div className="mt-2 flow-root">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : applicants.length === 0 ? (
            <p>No applicants found for this job.</p>
          ) : (
            <div className="max-w-7xl">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Avatar</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applicant Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applied On</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Object.entries(filteredApplicants).map(([id, applicant]) => (
                    <tr key={applicant._id}>
                   <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">   <img className="h-11 w-11 rounded-full" src='https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'  alt="" />
                    </td>
                     <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              
      {applicant.userId.firstName} {applicant.userId.lastName}
</td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{applicant.userId.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{applicant.appliedAt}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{applicant.status}</td>
                      <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewApplicantDetails(applicant.userId._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Full Profile
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
