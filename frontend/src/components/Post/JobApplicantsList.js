import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import Loader from '../Loader';
import person from '../../assets/person.png'
import NoApplicantList from "../../assets/noApplicants.png";
import noSignal from "../../assets/noSignal.jpg";
import ServerError from '../ServerError';
import JobFilterDialog from "../sorting";

export default function JobApplicantsList() {
  const { jobId } = useParams(); // Get jobId from URL params
  const location = useLocation();
  const jobStatus = location.state?.status;
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
        <div className="w-full px-2 md:px-1 md:w-3/4 mx-auto">
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
                      src={NoApplicantList}
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

                <div className="hidden lg:block overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full bg-white divide-y divide-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-4 pl-6 text-left text-sm font-semibold text-gray-900">Avatar</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Applicant Name</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Applied On</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedJobs
                        .sort((a, b) => {
                          // Define custom sorting order for statuses
                          const statusOrder = ["selected", "on hold", "applied", "rejected"];
                          return statusOrder.indexOf(a[1]?.status) - statusOrder.indexOf(b[1]?.status);
                        })
                        .map(([id, applicant], index) => {
                          // Define isClickable based on jobStatus and applicant's status
                          const isClickable = jobStatus !== "inactive" || applicant?.status === "selected";

                          return (
                            <tr
                              key={applicant?._id}
                              onClick={isClickable ? () => handleViewApplicantDetails(applicant?.userId?._id) : undefined}
                              className={`${isClickable ? "cursor-pointer hover:bg-gray-100 transition duration-200" : "cursor-not-allowed opacity-50"
                                } ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                            >
                              <td className="whitespace-nowrap px-6 py-4">
                                <img
                                  className="h-12 w-12 rounded-full object-cover border border-gray-300"
                                  src={applicant?.userId?.profilePhoto || person}
                                  alt="Profile"
                                />
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                                {applicant?.userId?.firstName} {applicant?.userId?.lastName}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">{applicant?.userId?.email}</td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                                {new Date(applicant?.appliedAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${applicant?.status === "Accepted"
                                    ? "bg-green-200 text-green-800"
                                    : applicant?.status === "Pending"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-red-200 text-red-800"
                                    }`}
                                >
                                  {applicant?.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>

                  </table>
                </div>


                <div className="block lg:hidden space-y-4">
                  {filteredAndSortedJobs
                    .sort((a, b) => {
                      const statusOrder = ["selected", "on hold", "applied", "rejected"];
                      return statusOrder.indexOf(a[1]?.status) - statusOrder.indexOf(b[1]?.status);
                    })
                    .map(([id, applicant]) => {
                      const isClickable = jobStatus !== "Inactive" || applicant?.status === "Selected";

                      return (
                        <div
                          key={applicant?._id}
                          className={`flex items-center gap-4 p-4 border-l-4 shadow-md bg-white 
            ${isClickable ? "cursor-pointer hover:bg-gray-50 transition duration-200" : "cursor-not-allowed opacity-60"}
            ${applicant?.status === "selected" ? "border-blue-600" : "border-gray-300"}
          `}
                          onClick={isClickable ? () => handleViewApplicantDetails(applicant?.userId?._id) : undefined}
                        >
                          <img
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-gray-300 object-cover"
                            src={applicant?.userId?.profilePhoto && applicant?.userId?.profilePhoto !== "" ? applicant?.userId?.profilePhoto : person}
                            alt="Profile"
                            onError={(e) => { e.currentTarget.src = person; }}
                          />

                          <div className="flex flex-col">
                            <h3 className="text-normal font-bold text-blue-500 mb-1">
                              {applicant?.userId?.firstName} {applicant?.userId?.lastName}
                            </h3>
                            <div className='text-xs'>
                              <div className='flex gap-2 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <p className=" text-gray-600">{applicant?.userId?.email}</p>

                              </div>
                              <p className=" text-gray-500">
                                <span className="font-medium text-gray-800">Applied On:</span> {new Date(applicant?.appliedAt).toLocaleDateString("en-GB")}
                              </p>
                              <p className={`font-semibold ${applicant?.status === "selected" ? "text-blue-600" : "text-gray-700"}`}>
                                Status: <span className="capitalize">{applicant.status}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>





              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
