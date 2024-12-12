import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";

export default function AppliedJobDetails() {
  const { jobId } = useParams(); // Extract jobId from URL
  const navigate = useNavigate(); // Navigation to different pages
  
  const [jobData, setJobData] = useState(null);
  const [isApplied, setIsApplied] = useState(false); // State to track if user has applied
  
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Get current user's ID
        
        const response = await fetch(`https://referralwala-deployment.vercel.app/job/${jobId}`, {
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
        setJobData(data); // Populate state with fetched job data

        // Check if the user has already applied
        const userApplied = data.applicants?.includes(userId);
        setIsApplied(userApplied);
      } catch (error) {
        console.error('Error fetching job data:', error);
        alert('Error fetching job details.');
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleApply = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Get current user's ID

      const response = await fetch(`https://referralwala-deployment.vercel.app/job/apply/${jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply for the job');
      }

      // On successful application, redirect to the "applied jobs" page
      alert('Successfully applied for the job!');
      navigate('/appliedjobs');
    } catch (error) {
      console.error('Error applying for the job:', error);
      alert('Error applying for the job.');
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

  if (!jobData) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-xl" />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4 px-4 sm:px-6">
        <div className="col-span-2 flex justify-end p-4">
          {!isApplied ? (
            <button
              onClick={handleApply}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Apply
            </button>
          ) : (
            <p className="text-green-600 font-medium">You have already applied for this job.</p>
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
  );
}
