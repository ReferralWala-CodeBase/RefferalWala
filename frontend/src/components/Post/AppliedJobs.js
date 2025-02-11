import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';
import img2 from "../../assets/desjob.png";
import img3 from "../../assets/2.png";

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

  const filteredJobs = appliedJobs.filter(job => job.status === selectedStatus);

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
            {/* Tabs for status */}
            <div className="flex space-x-4 mb-6">
              {['applied', 'selected', 'rejected', 'on hold'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setLoading(true);
                    setSelectedStatus(status);
                    setTimeout(() => setLoading(false), 1000); // Simulate loading delay
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${selectedStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
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
            </div>

            {loading ? (
              <Loader />
            ) : error ? (
              error === "Make Your Career Dreams a Reality" ? ( // Handle specific 404 error message
                <div className="flex flex-col items-center mt-8 p-6 bg-gray-100 rounded-md">
                  <img
                    src={img2}
                    alt="No Jobs Found"
                    className="mb-4 w-36"
                  />
                  <p className="text-gray-700 text-lg font-semibold mb-4">{error}</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg"
                  >
                    + Add Job
                  </button>
                </div>
              ) : (
                <p className="text-red-500">{error}</p>
              )
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center mt-8 p-6 bg-gray-50 rounded-md shadow">
                <img
                  src={img3}
                  alt="No Jobs Found"
                  className="mb-4 w-36"
                />
                <p className="text-gray-500 text-lg">No applied jobs found.</p>
              </div>
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
                          Location
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Work Mode
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Applied On
                        </th>
                        <th className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredJobs.map((job) => (
                        <tr
                          key={job.jobPostId._id}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          <td
                            onClick={() => handleViewJobDetails(job.jobPostId._id)}
                            className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {job.jobPostId.jobRole}
                          </td>
                          <td
                            onClick={() => handleViewJobDetails(job.jobPostId._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job.jobPostId.companyName}
                          </td>
                          <td
                            onClick={() => handleViewJobDetails(job.jobPostId._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job.jobPostId.Location}
                          </td>
                          <td
                            onClick={() => handleViewJobDetails(job.jobPostId._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {job.jobPostId.workMode}
                          </td>
                          <td
                            onClick={() => handleViewJobDetails(job.jobPostId._id)}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {new Date(job.appliedAt).toLocaleDateString()}
                          </td>
                          <td className="relative py-4 pl-2 pr-2 text-right text-sm font-medium sm:pr-6">
                            <FaTrash
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the row click
                                handleOpenModal(job.jobPostId._id);
                              }}
                              className="m-2 mt-2 text-xl cursor-pointer text-red-500 hover:text-red-700"
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
                  {filteredJobs.map((job) => (
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
                        <strong>Location:</strong> {job.jobPostId.location}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Work Mode:</strong> {job.jobPostId.workMode}
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
