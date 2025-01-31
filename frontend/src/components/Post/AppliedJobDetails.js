import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import company from "../../assets/company.png"

export default function AppliedJobDetails() {
  const { jobId } = useParams(); // Extract jobId from URL
  const navigate = useNavigate(); // Navigation to different pages
  const [searchQuery, setSearchQuery] = useState('');
  const [jobData, setJobData] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null); // Store the application status
  const [loading, setLoading] = useState(true); // Loading state
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');

        // Fetching job details
        const jobResponse = await fetch(`${Fronted_API_URL}/job/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to fetch job data');
        }

        const jobData = await jobResponse.json();
        setJobData(jobData); // Set the job data

        // Now fetch the application status
        const userId = localStorage.getItem('userId');
        const statusResponse = await fetch(`${Fronted_API_URL}/job/user/${userId}/jobpost/${jobId}/application/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to fetch application status');
        }

        const statusData = await statusResponse.json();
        setApplicationStatus(statusData.status);

      } catch (error) {
        console.error('Error fetching job data or application status:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Get current user's ID

      const response = await fetch(`${Fronted_API_URL}/job/apply/${jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          throw new Error(errorData.msg || response.statusText);
        }
      }

      // On successful application, redirect to the "applied jobs" page
      toast.success("Successfully applied for the job!");
      navigate('/appliedjobs');
    } catch (error) {
      toast.error(error.message);
    }
  };

  function getDate(endDate_param) {
    var tempDate = endDate_param + "";
    var date = '';
    for (let i = 0; i < tempDate.length; i++) {
      if (/^[a-zA-Z]$/.test(tempDate[i])) break;
      else date += tempDate[i];
    }
    return date;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-xl" />
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-600">Error: Job data could not be fetched.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/5 border">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-4 sm:px-6">
          <div className="col-span-2 flex justify-end p-4">
            {applicationStatus === 'applied' ? (
              <p className="text-blue-600 font-medium">You have applied for this job.</p>
            ) : applicationStatus === 'selected' ? (
              <p className="text-green-600 font-medium">You have been selected for this job!</p>
            ) : applicationStatus === 'rejected' ? (
              <p className="text-red-600 font-medium">Your application was rejected.</p>
            ) : applicationStatus === 'on hold' ? (
              <p className="text-yellow-600 font-medium">Your application is on hold.</p>
            ) : (
              <button
                onClick={handleApply}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Apply
              </button>
            )}
          </div>
          <section class="bg-white py-4 antialiased md:py-6">
            <div class="mx-auto px-1 2xl:px-0">

              <div className='flex justify-between'>
                <h2 class="mb-2 text-xl font-semibold text-gray-900  sm:text-2xl md:mb-3">Job Details</h2>
                <img className='hidden lg:block h-10 w-10' src={company} alt="" />
              </div>
              <div>
                <p>Posted By: {jobData.jobUniqueId}</p>
              </div>
              <div class="grid grid-cols-2 gap-4 border-b-2 border-t border-gray-300/80 py-3 md:py-4 lg:grid-cols-4 xl:gap-6">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                  </svg>

                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Job Role</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.jobRole}
                  </span>
                </div>

                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>

                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Employement Type</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.employmentType}
                  </span>
                </div>

                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>

                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Company</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.companyName}
                  </span>
                </div>


                <div>
                  <svg class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                  </svg>
                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Location</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900 "
                  >{jobData.location}
                  </span>
                </div>

              </div>
              <div class="py-4 md:py-8">
                <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                  <div class="space-y-4">
                    <div class="flex space-x-4">
                      <img class="h-16 w-16 rounded-lg" src={jobData.companyLogoUrl} alt="Company" />

                    </div>
                    <dl class="">
                      <dt class="font-semibold text-gray-900 dark:text-white">Job ID</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.jobUniqueId}</dd>
                    </dl>
                    <dl class="">
                      <dt class="font-semibold text-gray-900 dark:text-white">CTC</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.ctc}</dd>
                    </dl>

                    <dl class="">
                      <dt class="font-semibold text-gray-900 dark:text-white">Experience Required (Years)</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.experienceRequired}</dd>
                    </dl>
                    <dl>
                      <dt class="font-semibold text-gray-900 dark:text-white">Job Link</dt>
                      <dd class="flex items-center gap-1 text-gray-500 dark:text-gray-400">

                        {jobData.jobLink}
                      </dd>
                    </dl>
                    <dl>
                      <dt class="font-semibold text-gray-900 dark:text-white">Work Mode</dt>
                      <dd class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                        </svg>
                        {jobData.workMode}
                      </dd>
                    </dl>
                  </div>
                  <div class="space-y-4">

                    <dl>
                      <dt class="font-semibold text-gray-900 dark:text-white">Number of Referrals</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.noOfReferrals}</dd>
                    </dl>
                    <dl>
                      <dt class="mb-1 font-semibold text-gray-900 dark:text-white">End Date</dt>
                      <dd class="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                        <div>
                          <div class="text-sm">
                            <p class="mb-0.5 font-medium text-gray-900">{getDate(jobData.endDate)}</p>
                          </div>
                        </div>
                      </dd>
                    </dl>
                    <dl>
                      <div className="col-span-2 pb-4">
                        <label className="block text-sm font-medium text-gray-700">Job Description</label>
                        <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 h-40 overflow-auto">{jobData.jobDescription}</div>
                      </div>
                    </dl>
                  </div>
                </div>
                <button type="button" data-modal-target="accountInformationModal2" data-modal-toggle="accountInformationModal2" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
                  <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                  </svg>
                  Apply
                </button>
              </div>

            </div>
          </section>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}


