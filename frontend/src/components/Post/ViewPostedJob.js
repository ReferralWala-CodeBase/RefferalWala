import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid';
import { Dialog, Menu, Transition } from '@headlessui/react';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ViewPostedJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const [jobData, setJobData] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

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
          throw new Error('Failed to fetch job data');
        }

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error(error.message);
      }
    };

    fetchJobData();
  }, [jobId]);

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

  const inactivate = async () => {
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const updatedJobData = {
      userId,
      status: 'inactive' // Set the status field to 'inactive'
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
        alert("not ok")
        throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      toast.success("Job status updated to inactive successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
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
    return
    <div className="flex justify-center items-center">
      <FaSpinner className="animate-spin text-xl" />
    </div>
  }

  return (
    <>
      <Navbar />

      <div>
        <SidebarNavigation />
        <main className="py-2 lg:pl-72">
          <div className="lg:flex lg:justify-between bg-gray-800 p-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
                {jobData.jobRole}
              </h2>
              <h3 className="text-xl leading-7 text-white sm:truncate sm:text-xl sm:tracking-tight">
                @{jobData.companyName}
              </h3>
              <div className="mt-2 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-300">
                  <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  {jobData.workMode}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-300">
                  <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  {jobData.location}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-300">
                  <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  {jobData.ctc} LPA
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-300">
                  <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  Closing on {getDate(jobData.endDate)}
                </div>
              </div>

              <div className="col-span-2 py-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Job Description</label>
                {jobData.jobDescription}
              </div>
              <div className="col-span-2 pb-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Experience Required (Years)</label>
                {jobData.experienceRequired}
              </div>
              <div className="col-span-2 pb-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                {jobData.employmentType}
              </div>
              <div className="col-span-2 pb-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Number of Referrals</label>
                {jobData.noOfReferrals}
              </div>
              <div className="col-span-2 pb-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Job Link</label>
                {jobData.jobLink}
              </div>
              <div className="col-span-2 pb-4 text-white">
                <label className="block text-sm font-medium text-gray-500">Job ID</label>
                {jobData.jobUniqueId}
              </div>

            </div>
            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <span className="hidden sm:block">
                <button
                  type="button"
                  onClick={() => navigate(`/editpostedjob/${jobId}`)}
                  className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                >
                  <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Edit
                </button>

                <button
                  // onClick={inactivate}
                  onClick={() => setOpen(true)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 mx-2 rounded"
                >Close Job
                </button>
              </span>

              <Transition.Root show={open} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10"
                  initialFocus={cancelButtonRef}
                  onClose={() => setOpen(false)}
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
                              onClick={inactivate}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

            </div>
            <h3 className="mt-3 text-base font-semibold leading-7 text-gray-900">Job Details</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Role</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.jobRole}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Link</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.jobLink}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job ID</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.jobUniqueId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.companyName}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience Required (Years)</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.experienceRequired}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.location}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Mode</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.workMode}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.employmentType}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CTC (INR-Lakhs)</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.ctc}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Referrals</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{jobData.noOfReferrals}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">{getDate(jobData.endDate)}</div>
              </div>
              <div className="col-span-2 pb-4">
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 h-40 overflow-auto">{jobData.jobDescription}</div>
              </div>
            </div>

          </div>
        </main >
      </div >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>


  );
}
