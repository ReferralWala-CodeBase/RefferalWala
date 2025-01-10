import React, { useState,useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [formData, setFormData] = useState({
    userId: '',
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

  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  const navigate = useNavigate();
  // Check if the profile is complete

  const checkProfileCompletion = async () => {
    setLoading(true);
    try {

      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${Fronted_API_URL}/user/profile/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch profile data.");
      }
      const profileData = await response.json();
      const { mobileNumber, presentCompany } = profileData;

      if (
        !mobileNumber ||
        !presentCompany?.role ||
        !presentCompany?.companyName ||
        !presentCompany?.CompanyEmailVerified
      ) {
        setProfileIncomplete(true);
      } else {
        setProfileIncomplete(false);
      }

    } catch (error) {
      console.error("Error checking profile:", error);
      toast.error("Error checking profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    checkProfileCompletion();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJobPostSubmit = async (e) => {
    e.preventDefault();

    if (profileIncomplete) {
      toast.error("Please complete your profile before posting a job.");
      return;
    }


    // Add userId from local storage to formData
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const updatedFormData = { ...formData, userId };

    try {
      const response = await fetch(`${Fronted_API_URL}/job/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
        throw new Error(errorData.msg || response.statusText);
      }

      const responseData = await response.json();
      toast.success("Job posted successfully!");
      console.log('Response:', responseData);
    } catch (error) {
      console.error('Error posting job:', error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-1/4">
          <SidebarNavigation />
        </div>
        <div className="w-3/4 px-4 sm:px-6">
          <h3 className="mt-3 text-base font-semibold leading-7 text-gray-900">Post a New Job</h3>
          <form
            className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={handleJobPostSubmit}
          >
            <div>
              <label
                htmlFor="jobRole"
                className="block text-sm font-medium text-gray-700"
              >
                Job Role
              </label>
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
              <label
                htmlFor="jobLink"
                className="block text-sm font-medium text-gray-700"
              >
                Job Link
              </label>
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
              <label
                htmlFor="jobUniqueId"
                className="block text-sm font-medium text-gray-700"
              >
                Job Id
              </label>
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
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
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
              <label
                htmlFor="experienceRequired"
                className="block text-sm font-medium text-gray-700"
              >
                Experience Required(Yrs)
              </label>
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
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
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
              <label
                htmlFor="workMode"
                className="block text-sm font-medium text-gray-700"
              >
                Work Mode
              </label>
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
              <label
                htmlFor="employmentType"
                className="block text-sm font-medium text-gray-700"
              >
                Employment Type
              </label>
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
              <label
                htmlFor="ctc"
                className="block text-sm font-medium text-gray-700"
              >
                CTC (INR-Lakhs)
              </label>
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
              <label
                htmlFor="noOfReferrals"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Referrals
              </label>
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
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description
              </label>
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
            <div className="col-span-2">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              
                 disabled={loading}

>

  {loading ? "Checking Profile..." : "Post Job"}

</button>
            </div>
          </form>
        </div>
      </div>
        {/* Dialog for incomplete profile */}

        {profileIncomplete && (

<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">

  <div className="bg-white p-6 rounded-md shadow-md">

    <h2 className="text-lg font-semibold text-gray-900">

      Complete Your Profile

    </h2>

    <p className="mt-2 text-sm text-gray-600">

      Please fill in your profile details, including your mobile number

      and company information, before posting a job.

    </p>

    <div className="mt-4 flex justify-end">

      <button

        onClick={() => navigate("/viewprofile")}

        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"

      >

        Go to Profile

      </button>

    </div>

  </div>

</div>

)}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
