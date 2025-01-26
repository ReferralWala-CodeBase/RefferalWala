import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // to refresh
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
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
    const fetchAppliedJobs = async () => {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

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
            // Unauthorized, remove the token and navigate to login
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
      console.log("Response data:", data);

      if (response.ok) {
        toast.success("Withdraw  successfully!", {
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


  const handleViewJobDetails = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
  };

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 m-auto">
          <div className="mt-4 flow-root">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              error === "Make Your Career Dreams a Reality" ? ( // Handle specific 404 error message
                <div className="flex mt-4">
                  <p className="text-gray-700 mr-3 mt-1">{error}</p>
                  <button
                    onClick={() => navigate('/')} // Navigate to job creation
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Job
                  </button>
                </div>
              ) : (
                <p className="text-red-500">{error}</p>
              )
            ) : appliedJobs.length === 0 ? (
              <p>No applied jobs found.</p>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Table View for Larger Screens */}
                <div className="hidden md:block">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Job Role
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Company Name
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Job Unique ID
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Applied On
                        </th>
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
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(job.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => handleViewJobDetails(job.jobPostId._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Job
                            </button>
                          </td>
                          <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <FaTrash
                              // onClick={() => withdrawApplication(job.jobPostId._id)}
                              onClick={() => handleOpenModal(job.jobPostId._id)}
                              className="m-2 mt-4 text-xl cursor-pointer text-red-500 hover:text-red-700"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card View for Smaller Screens */}
                <div className="block md:hidden">
                  <p className='mb-5 text-xl font-medium leading-7 text-gray-900'>Applied Jobs</p>
                  {appliedJobs.map((job) => (
                    <div
                      key={job.jobPostId._id}
                      className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        <strong>Job Role:</strong> {job.jobPostId.jobRole}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Company Name:</strong> {job.jobPostId.companyName}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Job Unique ID:</strong> {job.jobPostId.jobUniqueId}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Status:</strong> {job.status}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Applied On:</strong> {new Date(job.appliedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-4 flex justify-between space-x-4">
                        <button
                          onClick={() => handleViewJobDetails(job.jobPostId._id)}
                          className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                        >
                          View Job
                        </button>
                        <FaTrash
                          // onClick={() => withdrawApplication(job.jobPostId._id)}
                          onClick={() => handleOpenModal(job.jobPostId._id)}
                          className="text-xl cursor-pointer text-red-500 hover:text-red-700"
                        />
                      </div>
                    </div>
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
                                      Are you sure you want to close this job? This action
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
