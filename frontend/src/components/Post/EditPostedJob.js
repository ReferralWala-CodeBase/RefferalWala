import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



export default function EditJob() {
  const { jobId } = useParams(); // Extract jobId from URL
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  
  const [formData, setFormData] = useState({
    jobRole: '',
    companyName: '',
    experienceRequired: '',
    location: '',
    jobLink: '',
    jobUniqueId: '',
    noOfReferrals: '',
    workMode: 'remote',
    employmentType: 'full-time',
    ctc: '',
    endDate: '',
    jobDescription: '',
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
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
        setFormData(data);  // Populate form with existing job data
      } catch (error) {
        console.error('Error fetching job data:', error);
        alert('Error fetching job details.');
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJobEditSubmit = async (e) => {
    e.preventDefault();

    // Add userId from local storage to formData
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const updatedFormData = { ...formData, userId };

    try {
      const response = await fetch(`https://referralwala-deployment.vercel.app/job/update/${jobId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();
      toast.success("Job updated successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log('Response:', responseData);
      navigate(`/postedjobslist`);  
    } catch (error) {
      console.error('Error updating job:', error.message);
      alert('Failed to update job. Please try again.');
    }
  };

  function getDate(endDate_param)
  {
    var tempDate=endDate_param+"";
    var date='';
    for(let i=0; i<tempDate.length; i++)
    {
      if(/^[a-zA-Z]$/.test(tempDate[i]))
        break;
      else
        date+=tempDate[i];
    }
    return date;
  }

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4 px-4 sm:px-6">
        <h3 className="mt-3 text-base font-semibold leading-7 text-gray-900">Edit Job</h3>
        <form className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6" onSubmit={handleJobEditSubmit}>
          <div>
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">Job Role</label>
            <input
              type="text"
              id="jobRole"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="jobLink" className="block text-sm font-medium text-gray-700">Job Link</label>
            <input
              type="text"
              id="jobLink"
              name="jobLink"
              value={formData.jobLink}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="jobUniqueId" className="block text-sm font-medium text-gray-700">Job ID</label>
            <input
              type="text"
              id="jobUniqueId"
              name="jobUniqueId"
              value={formData.jobUniqueId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700">Experience Required (Years)</label>
            <input
              type="text"
              id="experienceRequired"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">Work Mode</label>
            <select
              id="workMode"
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label htmlFor="ctc" className="block text-sm font-medium text-gray-700">CTC (INR-Lakhs)</label>
            <input
              type="text"
              id="ctc"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="noOfReferrals" className="block text-sm font-medium text-gray-700">Number of Referrals</label>
            <input
              type="number"
              id="noOfReferrals"
              name="noOfReferrals"
              value={formData.noOfReferrals}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={getDate(formData.endDate)}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="col-span-2 pb-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
