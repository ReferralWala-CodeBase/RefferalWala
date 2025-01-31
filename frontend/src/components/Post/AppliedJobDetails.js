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
              <div class="grid grid-cols-2 gap-4 border-b-2 border-t border-gray-300/80 py-3 md:py-4 lg:grid-cols-4 xl:gap-6">
                <div>
                  <svg class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                  </svg>
                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Job Role</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.jobRole}
                  </span>
                </div>

                <div>
                  <svg class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                  </svg>
                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Employement Type</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.employmentType}
                  </span>
                </div>

                <div>
                  <svg class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                  </svg>
                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">CTC (INR-Lakhs)</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900"
                  >{jobData.ctc}
                  </span>
                </div>


                <div>
                  <svg class="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                  </svg>
                  <h3 class="mb-2 text-gray-500 dark:text-gray-400">Job Link</h3>
                  <span class="flex items-center text-lg font-bold text-gray-900 "
                  >{jobData.jobLink}
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
                      <dt class="font-semibold text-gray-900 dark:text-white">Company Name</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.companyName}</dd>
                    </dl>

                    <dl class="">
                      <dt class="font-semibold text-gray-900 dark:text-white">Experience Required (Years)</dt>
                      <dd class="text-gray-500 dark:text-gray-400">{jobData.experienceRequired}</dd>
                    </dl>
                    <dl>
                      <dt class="font-semibold text-gray-900 dark:text-white">Job Location</dt>
                      <dd class="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <svg class="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                        </svg>
                        {jobData.location}
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


