import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        setApplicationStatus(statusData.status); // Set the application status

      } catch (error) {
        console.error('Error fetching job data or application status:', error);
        toast.error(error.message);
      } finally {
        setLoading(false); // Stop loading once the fetch is done
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
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className="flex">
        <div className="w-2/12 md:w-1/4">
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
      </div>
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
