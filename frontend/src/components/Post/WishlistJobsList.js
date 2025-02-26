import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner, FaCircle, FaTrash } from "react-icons/fa";
import Navbar from "../Navbar";
import Loader from '../Loader';
import { motion } from "framer-motion";
import noJobsPosted from "../../assets/noJobsPosted.png";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import noSignal from "../../assets/noSignal.jpg";
import ServerError from '../ServerError';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishlistJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const cancelButtonRef = useRef(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleOpenModal = (jobId) => {
    setSelectedJobId(jobId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
    setOpen(false);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`${Fronted_API_URL}/job/wishlist/${userId}`, {
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
        setJobs(data.wishlist);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [refresh]);

  const navigate = useNavigate();

  const handleRemoveFromWishlist = async (jobId) => {
    try {
      const bearerToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `${Fronted_API_URL}/job/wishlist/remove`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, jobId }),
        }
      );
      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        toast.warning("Removed from wishlist!");
      }
      setOpen(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Failed to remove from wishlist.");
    }
  };

  const handleView = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
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
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-1/12 md:w-1/4 fixed lg:relative" >
          <SidebarNavigation />
        </div>
        <div className="w-11/12 md:w-3/4 m-auto">

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

              <div className="flex w-full h-screen justify-center items-center text-center">
                <div>
                  <img
                    src={noJobsPosted}
                    alt="No data found"
                    className="mb-4 h-24 w-24 md:h-32 md:w-32 mx-auto block rounded-full"
                  />
                  <p className="text-xl font-light">No jobs found !</p>
                </div>
              </div>

            ) : (
              <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
                {/* Display Table View for Larger Screens */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Job ID
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {Object.entries(filteredJobs).map(([id, job]) => (
                        <tr key={job?._id}
                          className='cursor-pointer hover:bg-gray-100'
                        >
                          <td
                            onClick={() => handleView(job?._id)}
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {job?.jobUniqueId}
                          </td>
                          <td
                            onClick={() => handleView(job?._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job?.jobRole}
                          </td>
                          <td
                            onClick={() => handleView(job?._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job?.companyName}
                          </td>
                          <td
                            onClick={() => handleView(job?._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job?.location}
                          </td>
                          <td
                            onClick={() => handleView(job?._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job?.status === "inactive" ? "Closed" : job?.status}
                          </td>
                          <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <FaTrash
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the row click
                                handleOpenModal(job?._id);
                              }}
                              className="m-2 mt-2 text-xl cursor-pointer text-red-500 hover:text-red-700"
                            />
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>



                {/* Display Card View for Smaller and Tablet Screens */}
                <div className="block lg:hidden">
                  {Object.entries(filteredJobs).map(([id, job]) => (
                    <motion.li
                      key={job?._id}
                      className="relative mb-4 max-w-lg w-full list-none rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >

                      <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                      <div className="absolute mt-8 top-2 right-2">
                        <div className="bg-white rounded-full shadow-md p-1">
                          <img
                            src={job?.companyLogoUrl}
                            alt={`${job?.companyName} Logo`}
                            className="h-20 w-20 object-cover rounded-full"
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 max-w-lg w-full">
                        {/* Work Mode Tag */}

                        {/* <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                        {job?.status === "inactive" ? "Closed" : job?.status}
                      </span> */}
                        <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                          <FaCircle
                            className={job?.status === "inactive" ? "text-red-500" : "text-green-500"}
                            size={5}
                          />
                          <span>{job?.status === "inactive" ? "Closed" : job?.status}</span>
                        </span>

                        {/* Job Title */}
                        <h3 onClick={() => handleView(job?._id)} className="text-lg font-semibold text-blue-600 hover:underline">
                          {job?.jobRole}
                        </h3>

                        {/* Company Name */}
                        <div className='flex justify-between mt-2'>
                          <div className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                            </svg>

                            <p className="text-sm text-gray-500 mt-1">{job?.companyName}</p>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <p className="text-sm text-gray-500 mt-1">{job?.ctc}</p>
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

                      {/* Apply Button */}


                      <hr className='mt-2' />
                      <div className='flex justify-between items-center'>
                        <div className="flex mx-auto my-2 px-2 gap-4">
                          <button
                            onClick={() => handleView(job?._id)}
                            className="flex text-xs gap-2 items-center justify-center px-4 py-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenModal(job?._id)}
                            className="flex text-xs gap-2 items-center justify-center px-4 py-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                          >
                            <FaTrash
                              className="text-l cursor-pointer"
                            />

                            Remove
                          </button>

                        </div>
                      </div>

                      {/* Top Section */}

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
                                      Are you sure you want to remove from Wishlist?
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                  onClick={() => {
                                    handleRemoveFromWishlist(selectedJobId);
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
