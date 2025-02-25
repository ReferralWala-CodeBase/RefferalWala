import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import Loader from '../Loader';
import person from '../../assets/person.png'
import noApplicants from "../../assets/noApplicants.png";
import noSignal from "../../assets/noSignal.jpg";
import ServerError from '../ServerError';
import JobFilterDialog from "../sorting";

export default function JobApplicantsList() {
  const { jobId } = useParams(); // Get jobId from URL params
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [sortField, setSortField] = useState("appliedAt");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDateFilter, setCreatedDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [appliedOnDateFilter, setAppliedOnDateFilter] = useState(""); // Applied on date

  useEffect(() => {
    const fetchApplicants = async () => {
      const bearerToken = localStorage.getItem('token');

      try {
        const response = await fetch(`${Fronted_API_URL}/job/applicants/${jobId}`, {
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
            throw new Error(errorData.message || 'Failed to fetch applicants');
          }
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

  // const filteredApplicants = applicants && Object.fromEntries(
  //   Object.entries(applicants).filter(([id, applicant]) => {
  //     return (
  //       !applicant.hidden &&
  //       (
  //         applicant?.userId?.firstName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         applicant?.userId?.lastName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         applicant?.userId?.email?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         applicant?.appliedAt?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         applicant?.status?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //     );
  //   })
  // );


  const filteredAndSortedJobs = applicants && Object.entries(applicants)
    .filter(([id, applicant]) => {
      // Apply filtering logic
      return (
        // Status filter
        (!statusFilter || statusFilter === "all" || applicant.status === statusFilter) &&
        // User status filter
        (!userStatusFilter || userStatusFilter === "all" || applicant.status === userStatusFilter)
      );
    })
    .sort(([idA, applicantA], [idB, applicantB]) => {
      // Sorting logic based on the selected sortField and order
      const orderMultiplier = sortOrder === "asc" ? 1 : -1; // Ascending or descending order

      // If sorting by "appliedAt" date field
      if (sortField === "appliedAt") {
        const dateA = new Date(applicantA.appliedAt).getTime(); // Convert to timestamp for proper comparison
        const dateB = new Date(applicantB.appliedAt).getTime(); // Convert to timestamp for proper comparison

        if (dateA < dateB) return -1 * orderMultiplier;
        if (dateA > dateB) return 1 * orderMultiplier;
        return 0;
      }

      // Default sorting for other fields
      const valueA = applicantA[sortField];
      const valueB = applicantB[sortField];

      if (valueA < valueB) return -1 * orderMultiplier;
      if (valueA > valueB) return 1 * orderMultiplier;
      return 0;
    });

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 mx-auto">
          {/* <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // className="m-4 px-4 py-3 border-2 rounded w-3/4 bg-[#FFFFFF] border-none text-black"
            className="m-4 ml-10 px-4 py-3 rounded w-3/4 border-1 border-blue-500 focus:outline-none text-black"
          /> */}
          {/* Table */}
          <div className="mt-2 flow-root">
            {loading ? (
              <Loader />
            ) : error ? (
              <ServerError />
            ) : applicants.length === 0 ? (
              <>
                <div className="w-full h-full flex justify-center items-center">
                  <div className="bg-white  rounded-2xl p-6 flex flex-col items-center">
                    <img
                      src={noApplicants}
                      alt="No Applicants"
                      className="w-40 h-40 md:w-80 md:h-80 lg:w-100 lg:100 opacity-80"
                    />

                    <p className="text-gray-600 text-lg font-semibold">No Applicants Found</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-7xl">

                <div className="mb-2">
                  <JobFilterDialog
                    sortField={sortField}
                    setSortField={setSortField}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    userStatusFilter={userStatusFilter}
                    setUserStatusFilter={setUserStatusFilter}
                    appliedOnDateFilter={appliedOnDateFilter}
                    setAppliedOnDateFilter={setAppliedOnDateFilter}
                    createdDateFilter={createdDateFilter}
                    setCreatedDateFilter={setCreatedDateFilter}
                  />
                </div>

                <div className="hidden lg:block">
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
                      {filteredAndSortedJobs.map(([id, applicant]) => (
                        <tr key={applicant?._id}
                          onClick={() => handleViewApplicantDetails(applicant?.userId?._id)}
                          className='cursor-pointer'
                        >
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> <img className="h-11 w-11 rounded-full" src={applicant?.userId?.profilePhoto || person} alt="" />
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">

                            {applicant?.userId?.firstName} {applicant?.userId?.lastName}
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{applicant?.userId?.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(applicant?.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{applicant?.status}</td>
                          {/* <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleViewApplicantDetails(applicant.userId?._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Profile
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="block lg:hidden">
                  {filteredAndSortedJobs.map(([id, applicant]) => (
                    <div key={applicant?._id} className="mb-4 flex flex-col p-4 bg-white shadow-lg rounded-lg"
                      onClick={() => handleViewApplicantDetails(applicant?.userId?._id)}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-gray-500"
                          src={applicant?.userId?.profilePhoto || person}
                          alt=""
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {applicant?.userId?.firstName} {applicant?.userId?.lastName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">{applicant?.userId?.email}</p>
                          <p className="text-xs text-gray-400">Applied On: {new Date(applicant?.appliedAt).toLocaleDateString("en-GB")}</p>
                          <p className="text-xs text-gray-500">Status: {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}</p>
                        </div>
                      </div>
                      {/* <div className="mt-4 text-right">
                        <button
                          onClick={() => handleViewApplicantDetails(applicant.userId?._id)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          View Full Profile
                        </button>
                      </div> */}
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
