import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner, FaCircle } from "react-icons/fa";
import Navbar from "../Navbar";
import Loader from '../Loader';
import { motion } from "framer-motion";
import noJobsPosted from "../../assets/noJobsPosted.png";
import noSignal from "../../assets/noSignal.jpg";
import ServerError from '../ServerError';
import JobFilterDialog from "../sorting";

export default function PostedJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [sortField, setSortField] = useState("appliedAt");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDateFilter, setCreatedDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [workModeFilter, setWorkModeFilter] = useState("all");

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

  const handleViewApplicants = (job) => {
    navigate(`/jobapplicantslist/${job._id}`, { state: { status: job.status } });
  };
  

  // const filteredJobs = jobs && Object.fromEntries(
  //   Object.entries(jobs).filter(([id, job]) => {
  //     return !job.hidden && (
  //       job?.jobUniqueId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       job?.companyName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       job?.jobRole?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       job?.location?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       job?.workMode?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   })
  // );

  const filteredAndSortedJobs = jobs && Object.entries(jobs)
    .filter(([id, job]) => {
      // Apply filters
      return (
        (!statusFilter || statusFilter === "all" || job.status === statusFilter) &&
        (!workModeFilter || workModeFilter === "all" || job.workMode === workModeFilter) &&
        (!createdDateFilter || createdDateFilter === "all" || new Date(job.createdDate).toLocaleDateString() === createdDateFilter)
      );
    })
    .sort(([idA, jobA], [idB, jobB]) => {
      // Apply sorting based on jobUniqueId, you can adjust this for other properties
      const sortKey = "jobUniqueId"; // For example, sorting by jobUniqueId
      const orderMultiplier = sortOrder === "asc" ? 1 : -1;

      if (jobA[sortKey] < jobB[sortKey]) return -1 * orderMultiplier;
      if (jobA[sortKey] > jobB[sortKey]) return 1 * orderMultiplier;
      return 0;
    });

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-1/12 md:w-1/4 fixed lg:relative" >
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-4/4 px-2 sm:px-6 m-auto">

          <div className="mt-2 flow-root">
            {loading ? (
              <Loader />
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
              ) : <ServerError />
            ) : jobs.length === 0 ? (

              <div className="flex w-full justify-center items-center h-auto mx-auto text-center">
                <div>
                  <img src={noJobsPosted} alt="No data found" className="mb-4 mx-auto block rounded-full" />
                  <p className="text-xl font-light">No jobs found !</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
                {/* Job Filter Dialog */}
                <div className="mb-2">
                  <JobFilterDialog
                    sortField={sortField}
                    setSortField={setSortField}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    createdDateFilter={createdDateFilter}
                    setCreatedDateFilter={setCreatedDateFilter}
                  />
                </div>
                {/* Display Table View for Larger Screens */}
                <div className="hidden lg:block overflow-x-auto rounded-lg">
                  <table className="min-w-full border border-gray-300 bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Job ID</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Job Role</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Company Name</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Location</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedJobs.map(([id, job]) => (
                        <tr
                          key={job?._id}
                          className="hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => handleView(job?._id)}
                        >
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{job?.jobUniqueId}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{job?.jobRole}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{job?.companyName}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{job?.location}</td>
                          <td className="py-4 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${job?.status === "inactive" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                }`}
                            >
                              {job?.status === "inactive" ? "Closed" : job?.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApplicants(job);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 font-medium transition"
                            >
                              Applicants ({job.applicants?.length || 0})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="block md:hidden">
                  {filteredAndSortedJobs.map(([id, job]) => (
                    <motion.li
                      key={job?._id}
                      className="mb-4 relative max-w-lg w-full list-none rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >

                      <div className="mt-2 top-2 right-2">
                        <div className='flex px-2 justify-between items-center'>
                          <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 text-[9px] font-normal px-2 py-1 rounded-full mb-2">
                            <FaCircle
                              className={job?.status === "inactive" ? "text-red-500" : "text-green-500"}
                              size={5}
                            />
                            <span>{job?.status === "inactive" ? "Closed" : job?.status}</span>
                          </span>

                          <button onClick={() => handleViewApplicants(job)}
                            className="inline-flex cursor-pointer items-center gap-1 bg-blue-600 text-gray-100 text-[9px] font-normal px-3 py-1 rounded-full mb-2">
                             Applicants ({job.applicants?.length || 0})
                          </button>

                        </div>
                        <div className="px-2 py-1 w-fit">
                          <img
                            src={job?.companyLogoUrl}
                            alt={`${job?.companyName} Logo`}
                            className="h-16 w-16 border object-cover rounded-full"
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 max-w-lg w-full">
                        {/* Job Title */}
                        <h3 onClick={() => handleView(job?._id)} className="text-sm cursor-pointer font-semibold text-blue-600 hover:underline">
                          {job?.jobRole}
                        </h3>

                        {/* Company Name */}
                        <div className='flex justify-between mt-2'>
                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                            </svg>

                            <p className="text-xs text-gray-500 mt-1">{job?.companyName}</p>
                          </div>

                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>

                            <p className="text-xs text-gray-700 mt-1">{job?.experienceRequired} yrs</p>
                          </div>
                        </div>

                        <div className='flex justify-between mt-2'>
                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <p className="text-xs text-gray-500 mt-1">{job?.ctc}</p>
                          </div>

                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <p className="text-xs text-gray-700 mt-1">{job?.location}</p>
                          </div>
                        </div>
                      </div>

                    </motion.li>
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
