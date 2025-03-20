import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { FaTrash, FaCircle } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';
import img2 from "../../assets/desjob.png";
import img3 from "../../assets/2.png";
import noSignal from "../../assets/noSignal.jpg";
import { motion } from "framer-motion";
import ServerError from '../ServerError';
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import JobFilterDialog from "../sorting";

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('applied');
  const [sortField, setSortField] = useState("appliedAt");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [workModeFilter, setWorkModeFilter] = useState("all");
  // const [sortOrderApplied,setSortOrderApplied={setSortOrderApplied}

  const handleOpenModal = (jobId) => {
    setSelectedJobId(jobId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
    setOpen(false);
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const response = await fetch(`${Fronted_API_URL}/job/user/${userId}/applications/statuses`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
            throw new Error(errorData.message || 'No applications Found!! Start Applying for your dream Job. ');
          }
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
  }, [refresh]);

  const withdrawApplication = async (jobId) => {
    try {
      const bearerToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`${Fronted_API_URL}/job/withdraw/${jobId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Withdraw successful!", {
          position: "top-right",
          autoClose: 3000, // 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setOpen(false);
        setRefresh((prev) => !prev);
      } else {
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          toast.error(data.message || "Withdraw failed. Try again.");
        }
      }
    } catch (err) {
      toast.error(error.message);
    }
  };

  const filteredJobs = appliedJobs.filter(job => job?.status === selectedStatus);

  const sortedJobs = [...filteredJobs]
    .filter(job =>
      workModeFilter === "all" || job?.jobPostId?.workMode.toLowerCase() === workModeFilter
    )
    .sort((a, b) => {
      let valueA, valueB;

      if (sortField === "appliedAt") {
        valueA = new Date(a.appliedAt);
        valueB = new Date(b.appliedAt);
      } else if (sortField === "companyName") {
        valueA = a.jobPostId.companyName.toLowerCase();
        valueB = b.jobPostId.companyName.toLowerCase();
      } else if (sortField === "jobRole") {
        valueA = a.jobPostId.jobRole.toLowerCase();
        valueB = b.jobPostId.jobRole.toLowerCase();
      } else if (sortField === "location") {
        valueA = a.jobPostId.location.toLowerCase();
        valueB = b.jobPostId.location.toLowerCase();
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });


  const handleViewJobDetails = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-1/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-4/4 px-2 sm:px-6 m-auto">
          <div className="mt-4 flow-root">
            {/* Tabs for status */}
            <div className="flex space-x-4 mb-2 md:mb-6">
              {['applied', 'selected', 'rejected', 'on hold'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setLoading(true);
                    setSelectedStatus(status);
                    setTimeout(() => setLoading(false), 1000); // Simulate loading delay
                  }}
                  className={`px-2 py-1 md:px-4 md:py-2 text-xs sm:text-sm font-medium rounded-md ${selectedStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  disabled={loading}
                >
                  {loading && selectedStatus === status ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white inline-block mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 100 8H4z"
                      ></path>
                    </svg>
                  ) : null}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
              <div className="hidden md:block">
                <JobFilterDialog
                  sortField={sortField}
                  setSortField={setSortField}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  workModeFilter={workModeFilter}
                  setWorkModeFilter={setWorkModeFilter}
                  // sortOrderApplied={sortOrderApplied}
                  // setSortOrderApplied={setSortOrderApplied}
                />
              </div>

            </div>

            {loading ? (
              <Loader />
            ) : error ? (
              error === "Make Your Career Dreams a Reality" ? ( // Handle specific 404 error message
                <div className="flex flex-col items-center mt-8 p-6 rounded-md">
                  <img
                    src={img2}
                    alt="No Jobs Found"
                    className="w-36"
                  />
                  <p className="text-gray-700 text-lg font-semibold mb-4">{error}</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg"
                  >
                    + Apply Job
                  </button>
                </div>
              ) : (
                <ServerError />
              )
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center mt-8 p-6 rounded-md">
                <img
                  src={img3}
                  alt="No Jobs Found"
                  className="w-36"
                />
                <p className="text-gray-500 text-lg">No applied jobs found.</p>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-2">

                <div className="block md:hidden mb-2">
                  <JobFilterDialog
                    sortField={sortField}
                    setSortField={setSortField}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    workModeFilter={workModeFilter}
                    setWorkModeFilter={setWorkModeFilter}
                  />
                </div>

                {/* Table View for Larger Screens */}
                <div className="hidden md:block">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 bg-white">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="py-4 pl-6 text-left text-sm font-semibold text-gray-900">Job Role</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Work Mode</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applied On</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {sortedJobs.map((job, index) => (
                          <tr
                            key={job?.jobPostId?._id}
                            className={`cursor-pointer transition duration-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              } hover:bg-gray-100`}
                          >
                            <td
                              onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                              className="whitespace-nowrap py-4 pl-6 text-sm font-medium text-gray-900"
                            >
                              {job?.jobPostId?.jobRole}
                            </td>

                            <td
                              onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                              className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
                            >
                              {job?.jobPostId?.companyName}
                            </td>

                            <td
                              onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                              className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
                            >
                              {job?.jobPostId?.location}
                            </td>

                            <td
                              onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                              className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
                            >
                              {job?.jobPostId?.workMode}
                            </td>

                            <td
                              onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                              className="whitespace-nowrap px-6 py-4 text-sm text-gray-600"
                            >
                              {new Date(job?.appliedAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            <td className="relative py-4 pr-6 text-right">
                              <FaTrash
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenModal(job?.jobPostId?._id);
                                }}
                                className="text-xl cursor-pointer text-red-500 hover:text-red-700 transition duration-200"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>


                {/* Card View for Smaller Screens */}
                {/* <div className="block md:hidden">
                  <p className='mb-5 text-xl font-medium leading-7 text-gray-900'>Applied Jobs</p>
                  {filteredJobs.map((job) => (
                    <div
                      key={job?.jobPostId?._id}
                      className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        <strong>Job Role:</strong> {job?.jobPostId?.jobRole}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Company Name:</strong> {job?.jobPostId?.companyName}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Location:</strong> {job?.jobPostId?.location}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Work Mode:</strong> {job?.jobPostId?.workMode}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Applied On:</strong> {new Date(job.appliedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-4 flex justify-between space-x-4">
                        <button
                          onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                        >
                          View Job
                        </button>
                        <FaTrash
                          onClick={() => handleOpenModal(job?.jobPostId?._id)}
                          className="text-xl cursor-pointer text-red-500 hover:text-red-700"
                        />

                      </div>
                    </div>
                  ))}
                </div> */}


                <div className="block md:hidden">
                  {sortedJobs.map((job) => (
                    <motion.li
                      key={job?._id}
                      className="mb-4 relative max-w-lg w-full list-none rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >

                      <div className="mt-2 top-2 right-2">
                        <div className='flex px-2 justify-between items-center'>
                          <div className="inline-flex items-center gap-1 bg-gray-200/70 text-gray-700 text-[9px] font-normal px-3 py-1 rounded-full mb-2">
                            <span>Applied On: {new Date(job?.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>

                          <button onClick={() => handleOpenModal(job?.jobPostId?._id)}
                            className="inline-flex cursor-pointer items-center gap-1 bg-blue-600 text-gray-100 text-[9px] font-normal px-3 py-1 rounded-full mb-2">
                            Withdraw
                          </button>

                        </div>
                        <div className="px-2 py-1 w-fit">
                          <img
                            src={job?.jobPostId?.companyLogoUrl}
                            alt={`${job?.jobPostId?.companyName} Logo`}
                            className="h-16 w-16 border object-cover rounded-full"
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 max-w-lg w-full">
                        {/* Job Title */}
                        <h3 onClick={() => handleViewJobDetails(job?.jobPostId?._id)}
                          className="text-sm cursor-pointer font-semibold text-blue-600 hover:underline">
                          {job?.jobPostId?.jobRole}
                        </h3>

                        {/* Company Name */}
                        <div className='flex justify-between mt-2'>
                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                            </svg>

                            <p className="text-xs text-gray-500 mt-1">{job?.jobPostId?.companyName}</p>
                          </div>

                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>

                            <p className="text-xs text-gray-700 mt-1">{job?.jobPostId?.experienceRequired} yrs.</p>
                          </div>
                        </div>

                        <div className='flex justify-between mt-2'>
                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <p className="text-xs text-gray-500 mt-1">{job?.jobPostId?.ctc}</p>
                          </div>

                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <p className="text-xs text-gray-700 mt-1">{job?.jobPostId?.location}</p>
                          </div>
                        </div>
                      </div>

                    </motion.li>
                  ))}
                </div>

                { /*Modal Open Dialog */}
                {open && (
                  <Transition.Root show={open} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      initialFocus={cancelButtonRef}
                      onClose={handleCloseModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                              <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                  <ExclamationTriangleIcon
                                    className="h-6 w-6 text-red-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  <Dialog.Title
                                    as="h3"
                                    className="text-base font-semibold leading-6 text-gray-900"
                                  >
                                    Close Job
                                  </Dialog.Title>
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                      Are you sure you want to withdraw? This action
                                      cannot be undone.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                  onClick={() => {
                                    withdrawApplication(selectedJobId);
                                    handleCloseModal();
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                  onClick={handleCloseModal}
                                  ref={cancelButtonRef}
                                >
                                  Cancel
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                )}

              </div>

            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
