import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    jobRole: '',
    companyName: '',
    companyLogoUrl: '',
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
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const OLA_API_Key = process.env.REACT_APP_OLA_API_KEY; // OLA API
  const Logo_Dev_Secret_key = process.env.REACT_APP_LOGO_DEV_SECRET_KEY; // Logo dev secret key

  const navigate = useNavigate();

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

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));


    // Only trigger API calls if the value length is greater than 2
    if (value.length > 2) {
      setLoading(true);

      try {
        if (name === "companyName") {
          const response = await fetch(`https://api.logo.dev/search?q=${value}`, {
            headers: {
              "Authorization": `Bearer: ${Logo_Dev_Secret_key}`, // Add your Secret key
            },
          });
          const data = await response.json();

          if (data && data.length > 0) {
            setCompanySuggestions(data);
          } else {
            setCompanySuggestions([]);
          }
        } else if (name === "location") {
          const response = await fetch(
            `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(value)}&api_key=${OLA_API_Key}`
          );
          const data = await response.json();

          if (data && data.predictions && data.predictions.length > 0) {
            setLocationSuggestions(data.predictions);
          } else {
            setLocationSuggestions([]);
          }
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setCompanySuggestions([]);  // Clear company suggestions on error
        setLocationSuggestions([]);  // Clear location suggestions on error
      } finally {
        setLoading(false);
      }
    } else {
      setCompanySuggestions([]);  // Clear company suggestions if input length <= 2
      setLocationSuggestions([]);  // Clear location suggestions if input length <= 2
    }
  };



  const handleSuggestionClick = (company) => {
    setFormData({
      ...formData,
      companyName: company.name,
      companyLogoUrl: company.logo_url || null,  // Set logo URL or null
    });
    setCompanySuggestions([]);  // Clear suggestions
  };

  const handleSelectSuggestion = (location) => {
    setFormData({
      ...formData,
      location: location.description, // Set the full location name
    });
    setLocationSuggestions([]); // Clear suggestions after selection
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
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          // throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
          throw new Error(errorData.msg || response.statusText);
        }
      }

      const responseData = await response.json();
      toast.success("Job posted successfully!");
      navigate('/postedjobslist');
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
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-4 sm:px-1 m-auto">
          <h3 className="mt-3 text-base font-semibold leading-7 text-gray-900">Post a New Job</h3>
          <form
            className="mt-3 grid grid-cols-2 gap-6 sm:grid-cols-2"
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
            <div className='relative'>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
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
              {companySuggestions.length > 0 && (
                <ul className="absolute w-full mt-32 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto" style={{ top: '-100%' }}>
                  {companySuggestions.map((company, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => handleSuggestionClick(company)}
                    >
                      <div className="flex items-center">
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="h-6 w-6 object-contain mr-2"
                        />
                        <span>{company.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
            <div className='relative'>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
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

              {locationSuggestions.length > 0 && (
                <ul className="absolute w-full mt-32 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-[250px] overflow-y-auto" style={{ top: '-100%' }}>
                  {locationSuggestions.map((location, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(location)}
                      className="cursor-pointer p-2 hover:bg-black-800 rounded-md"
                    >
                      {location.description}
                    </li>
                  ))}
                </ul>
              )}
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
              <select
                id="ctc"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Salary Package</option>
                <option value="3-5 LPA">3-5 LPA</option>
                <option value="5-8 LPA">5-8 LPA</option>
                <option value="8-12 LPA">8-12 LPA</option>
                <option value="12-15 LPA">12-15 LPA</option>
                <option value="15-20 LPA">15-20 LPA</option>
                <option value="20+ LPA">20+ LPA</option>
              </select>

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
                min="0"
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
