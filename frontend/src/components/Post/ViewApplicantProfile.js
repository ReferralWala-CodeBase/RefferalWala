import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { FaUniversity, FaBriefcase, FaBuilding, FaLocationArrow, FaGithub, FaLinkedin, FaGlobe, FaInstagram, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewApplicantProfile() {
  const navigate = useNavigate();
  const { applicantId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();
  const { jobId } = location.state || {};
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const statusOptions = ['applied', 'selected', 'rejected', 'on hold'];
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        const bearerToken = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${Fronted_API_URL}/user/profile/${applicantId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, [applicantId]);


  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await fetch(
          `${Fronted_API_URL}/job/user/${applicantId}/jobpost/${jobId}/application/status`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch status');

        const { status } = await response.json();
        setStatus(status); // Set current status
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    if (jobId && applicantId) fetchCurrentStatus();
  }, [applicantId, jobId]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${Fronted_API_URL}/job/${jobId}/applicant/${applicantId}/status`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          throw new Error('Failed to update status');
        }
      }

      setStatus(newStatus);
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-xl" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-2/12 md:w-1/4">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-4 sm:px-6">
          <div className="col-span-2 flex justify-end p-4">
            <label htmlFor="status" className="mr-2 font-medium text-gray-700">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="inline-flex rounded-md border border-gray-300 bg-white py-2 px-4 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={updatingStatus} // Disable while updating
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {updatingStatus && <FaSpinner className="ml-4 animate-spin text-indigo-600" />}
          </div>

          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Basic Profile</h3>
          <div className="p-6 font-sans rounded-lg shadow-lg bg-gray-50">
            <div className="flex">
              <div className="w-1/3 text-center pr-6 border-r border-gray-300">
                <img
                  src={profileData.profilePhoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLA994hpL3PMmq0scCuWOu0LGsjef49dyXVg&s"}
                  alt="Profile"
                  className="w-36 h-36 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800">{`${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || <>&nbsp;</>}</h2>
                {/* <p className="text-sm text-gray-600 mb-3">{profileData.presentCompany.role || <>&nbsp;</>}</p> */}
                <div className="text-sm text-gray-700 leading-relaxed  flex items-center flex-wrap space-x-4">
                  <div className="flex items-center space-x-1">
                    <FaEnvelope className="text-gray-500" />
                    <span>{profileData.email || <>&nbsp;</>}</span>
                  </div>
                  <span className="text-gray-400">||</span>
                  <div className="flex items-center space-x-1">
                    <FaPhone className="text-gray-500" />
                    <span>{profileData.mobileNumber || <>&nbsp;</>}</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {profileData.links?.github && (
                    <a
                      href={profileData.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaGithub className="text-2xl" />
                    </a>
                  )}

                  {profileData.links?.linkedin && (
                    <a
                      href={profileData.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaLinkedin className="text-2xl" />
                    </a>
                  )}

                  {profileData.links?.website && (
                    <a
                      href={profileData.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaGlobe className="text-2xl" />
                    </a>
                  )}

                  {profileData.links?.instagram && (
                    <a
                      href={profileData.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}

                  {profileData.links?.facebook && (
                    <a
                      href={profileData.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaFacebook className="text-2xl" />
                    </a>
                  )}
                </div>



              </div>
              <div className="w-2/3 pl-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">About Me</h3>
                <p className="text-sm text-gray-700 mb-6">{profileData.aboutMe || 'No about me information provided'}</p>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-sm bg-blue-100 text-gray-800 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {/* Achievements */}
                <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Achievements</h3>
                <div className="mt-3">
                  {profileData.achievements?.length ? (
                    <div className="mt-1 block w-full p-2">
                      {profileData.achievements.join(", ")}
                    </div>
                  ) : (
                    <div className="mt-1 block w-full p-2">
                      No achievements added
                    </div>
                  )}
                </div>

              </div>
            </div>

            { /* Education */}
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Education</h3>
            {profileData.education?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
                        <FaUniversity />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {edu.level || "Education Level"}
                        </h3>
                        <p className="text-sm text-gray-500">{edu.schoolName || "School/University Name"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Year of Passing:</span>{" "}
                        {edu.yearOfPassing || "Not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 mt-6">
                No education details added.
              </div>
            )}

            {/* Present Company Section */}
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Present Company</h3>
            {profileData.presentCompany ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Role:</span>
                    <span className="text-gray-600">{profileData.presentCompany.role || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Company Name:</span>
                    <span className="text-gray-600">
                      {profileData.presentCompany.companyName || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Company Email:</span>
                    <span className="text-gray-600">
                      {profileData.presentCompany.companyEmail || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Years of Experience:</span>
                    <span className="text-gray-600">
                      {profileData.presentCompany.yearsOfExperience || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Location:</span>
                    <span className="text-gray-600">{profileData.presentCompany.location || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Current CTC:</span>
                    <span className="text-gray-600">
                      ₹{profileData.presentCompany.currentCTC || '-'} LPA
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">No present company details added.</div>
            )}

            {/* Experience Section */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Experience</h3>
            {profileData.experience?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                        <FaBuilding />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {exp.companyName || "Company Name"}
                        </h3>
                        <p className="text-sm text-gray-500">{exp.position || "Position"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Years of Experience:</span>{" "}
                        {exp.yearsOfExperience
                          ? `${exp.yearsOfExperience} years`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 mt-6">
                No experience details added.
              </div>
            )}

            {/* Preferences */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Preferences</h3>
            <div className="border hover:shadow-xl transition-shadow bg-white border-gray-200 p-8 rounded-lg shadow-xl mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Preferred Company Name */}
                <div className="flex flex-col">
                  <label className="text-base font-medium text-gray-700 mb-2">Preferred Company Name</label>
                  <div className="flex items-center justify-between bg-gray-50 text-gray-700 p-4 rounded-lg shadow-sm border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                    {profileData.preferences?.preferredCompanyName ? (
                      <span>{profileData.preferences.preferredCompanyName}</span>
                    ) : (
                      <span className="text-gray-400">Not Set</span>
                    )}
                  </div>
                </div>

                {/* Preferred Position */}
                <div className="flex flex-col">
                  <label className="text-base font-medium text-gray-700 mb-2">Preferred Position</label>
                  <div className="flex items-center justify-between bg-gray-50 text-gray-700 p-4 rounded-lg shadow-sm border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                    {profileData.preferences?.preferredPosition ? (
                      <span>{profileData.preferences.preferredPosition}</span>
                    ) : (
                      <span className="text-gray-400">Not Set</span>
                    )}
                  </div>
                </div>

                {/* Expected CTC Range */}
                <div className="flex flex-col">
                  <label className="text-base font-medium text-gray-700 mb-2">Expected CTC Range</label>
                  <div className="flex items-center justify-between bg-gray-50 text-gray-700 p-4 rounded-lg shadow-sm border-2 border-gray-200 focus-within:border-blue-500 transition-all">
                    {profileData.preferences?.expectedCTCRange ? (
                      <span>{profileData.preferences.expectedCTCRange}</span>
                    ) : (
                      <span className="text-gray-400">Not Set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
