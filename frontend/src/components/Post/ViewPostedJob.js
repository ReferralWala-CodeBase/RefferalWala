import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Loader from '../Loader';
import { TruckIcon } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ViewPostedJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const [jobData, setJobData] = useState(null);
  const [open, setOpen] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const cancelButtonRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await fetch(`${Fronted_API_URL}/job/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
            throw new Error('Failed to fetch job data');
          }
        }

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error(error.message);
      }
    };

    fetchJobData();
  }, [Fronted_API_URL, jobId, navigate]);

  function getDate(endDate_param) {
    var tempDate = endDate_param + "";
    var date = '';
    for (let i = 0; i < tempDate.length; i++) {
      if (/^[a-zA-Z]$/.test(tempDate[i]))
        break;
      else
        date += tempDate[i];
    }
    return date;
  }

  const handleViewApplicants = (jobId) => {
    navigate(`/jobapplicantslist/${jobId}`, { state: { status: "selected" } });
  };

  const inactivate = async (currentStatus) => {
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const updatedJobData = {
      userId,
      // status: 'inactive'
      status: currentStatus
    };


    try {
      const response = await fetch(`${Fronted_API_URL}/job/update/${jobId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();

      const message = currentStatus === "inactive" ? "Job Closed successfully!" : "Job Activated successfully!";

      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          navigate(`/postedjobslist`);
        }
      });
      setOpen(false);
      console.log('Response:', responseData);
    } catch (error) {
      console.error('Error fetching job data:', error);
      toast.error(error.message);
    }
  };


  if (!jobData) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div>
        <SidebarNavigation />
        <main className="py-4 lg:pl-72 min-h-screen">
          {/* status */}
          <div className="mt-5 flex justify-end gap-2 px-4 lg:ml-4 lg:mt-0">
            {jobData?.status === 'active' ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/editpostedjob/${jobId}`)}
                  className="inline-flex justify-center rounded-full border border-transparent bg-blue-600 py-1 px-5 sm:px-7 text-[14px] sm:text-md font-light text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 items-center focus:ring-offset-2 "
                >
                  <PencilIcon className="sm:-ml-0.5 mr-1 sm:mr-1.5 h-5 w-5" aria-hidden="true" />
                  Edit
                </button>

                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex justify-center rounded-full border border-transparent bg-red-600 py-1 px-5 sm:px-7 text-[14px] sm:text-md font-light text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 items-center focus:ring-offset-2"
                >
                  Close Job
                </button>
              </>
            ) : (
              <button
                onClick={() => setOpenJob(true)}
                className="inline-flex justify-center rounded-full border border-transparent bg-blue-600 py-1 px-5 sm:px-7 text-[14px] sm:text-md font-light text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 items-center focus:ring-offset-2"
              >
                Activate
              </button>
            )}
            <button
              onClick={() => { handleViewApplicants(jobId) }}
              className="inline-flex justify-center rounded-full border border-transparent bg-blue-600 py-1 px-5 sm:px-7 text-[14px] sm:text-md font-light text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 items-center focus:ring-offset-2"
            >
              View Applicants
            </button>
          </div>

          {/* Modal for Activate Job */}
          <Transition.Root show={openJob} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpenJob(false)}>
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
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Activate Job
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to activate this job?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          // onClick={inactivate}
                          
                  onClick={() => navigate(`/editpostedjob/${jobId}`)}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpenJob(false)}
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

          {/* Modal for Closing Job */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
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
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Close Job
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to close this job?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          // onClick={inactivate}
                          onClick={() => inactivate("inactive")}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
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

          <div className="lg:flex lg:justify-between p-4 md:p-8">
            <div className="min-w-0 flex-1 border-b pb-4">
              <h2 className="text-2xl font-bold leading-7 text-blue-700 sm:truncate sm:text-2xl sm:tracking-tight">
                {jobData?.jobRole}
              </h2>
              <div className="flex items-center mt-2">
                <img class="h-14 w-14 border-2 border-blue-700 rounded-full" src={jobData?.companyLogoUrl} alt="" />
                <h3 className="ml-2 text-xl leading-7 text-gray-700 sm:truncate sm:text-xl sm:tracking-tight">
                  @{jobData?.companyName}
                </h3>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6 mb-4">
                <div className="mt-2 flex items-center text-xs text-gray-600 bg-gray-200/70 px-2 md:px-4 rounded-full py-1">
                  <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                  {jobData?.employmentType}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600 px-2 md:px-4 rounded-full bg-gray-200/70 py-1">
                  <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                  {jobData?.location}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600 px-2 md:px-4 rounded-full bg-gray-200/70 py-1">
                  <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                  {jobData?.ctc} LPA
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600 px-2 md:px-4 rounded-full bg-gray-200/70 py-1">
                  <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Closing on {getDate(jobData?.endDate)}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600 px-2 md:px-4 rounded-full bg-gray-200/70 py-1">
                  <TruckIcon className="mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                  {jobData?.workMode}
                </div>
              </div>

              <hr />


              {/* Job Details */}
              <div class="mb-4 mt-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                <div class="space-y-4">

                  <dl class="">
                    <dt class="mb-1 text-gray-800 font-bold">Job ID</dt>
                    <dd class="font-normal text-sm text-gray-900">{jobData?.jobUniqueId}</dd>
                  </dl>

                  <dl>
                    <dt class="mb-1 text-gray-800 font-bold">Experience Required</dt>
                    <dd class="flex items-center gap-1 font-normal transition text-sm text-gray-900">

                      {jobData?.experienceRequired} yrs
                    </dd>
                  </dl>

                  <dl>
                    <a href={jobData?.jobLink} target="_blank" rel="noopener noreferrer">
                      <p className="text-blue-500 gap-1 hover:underline hover:underline-offset-2 hover:text-blue-700 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>

                        <span className="font-medium">Job Link</span>{" "}
                      </p>
                    </a>
                  </dl>


                </div>
                <div class="space-y-4">

                  <dl>
                    <dt class="mb-1 text-gray-800 font-bold">Number of Referrals</dt>
                    <dd class="font-light text-sm text-gray-900">{jobData?.noOfReferrals}</dd>
                  </dl>
                  <dl>
                    <dt class="mb-1 text-gray-800 font-bold">End Date</dt>
                    <dd class="flex items-center space-x-4 font-normal text-sm text-gray-900">
                      <div>
                        <div class="text-sm">
                          <p class="mb-0.5 font-normal text-gray-900">{getDate(jobData?.endDate)}</p>
                        </div>
                      </div>
                    </dd>
                  </dl>

                </div>
                <div className="col-span-2 pb-1 border-t py-2 md:py-4 border-gray-200">
                  <label className="block text-sm font-bold text-blue-700">Job Description</label>
                  <div
                    className="mt-1 text-sm text-justify block w-full rounded-none"
                    dangerouslySetInnerHTML={{ __html: jobData?.jobDescription }}
                  />
                </div>

              </div>
            </div>


          </div>


        </main>



      </div >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
