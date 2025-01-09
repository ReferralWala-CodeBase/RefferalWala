import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
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

      if (!response.ok) throw new Error('Failed to update status');

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
        <div className="w-1/4">
          <SidebarNavigation />
        </div>
        <div className="w-3/4 px-4 sm:px-6">
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
            {updatingStatus && <FaSpinner className="ml-2 animate-spin text-indigo-600" />}
          </div>
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Basic Profile</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.firstName}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.lastName}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.mobileNumber}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.gender || 'N/A'}
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Education</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">Level</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">School Name</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">Year of Passing</th>
                </tr>
              </thead>
              <tbody>
                {profileData.education?.length ? (
                  profileData.education.map((edu, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{edu.level || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{edu.schoolName || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{edu.yearOfPassing || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-sm text-gray-900 text-center border border-gray-300">
                      No education details added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>



          {/* Present Company */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Present Company</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profileData.presentCompany ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.role || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.companyName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Email</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.companyEmail || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.CompanyEmailVerified ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.yearsOfExperience || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.location || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current CTC</label>
                  <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                    {profileData.presentCompany.currentCTC || 'N/A'}
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                No present company details added
              </div>
            )}
          </div>
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Experience</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">Company Name</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">Position</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">Years of Experience</th>
                </tr>
              </thead>
              <tbody>
                {profileData.experience?.length ? (
                  profileData.experience.map((exp, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{exp.companyName || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{exp.position || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300">{exp.yearsOfExperience || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-sm text-gray-900 text-center border border-gray-300">
                      No experience details added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>





          {/* Preferences */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Preferences</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Company Name</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.preferences?.preferredCompanyName || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Position</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.preferences?.preferredPosition || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected CTC Range</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.preferences?.expectedCTCRange || 'N/A'}
              </div>
            </div>
          </div>


          {/* Links */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Links</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['github', 'portfolio', 'linkedin', 'facebook', 'instagram', 'other'].map((link) => (
              <div key={link}>
                <label className="block text-sm font-medium text-gray-700">
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </label>
                <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                  {profileData.links?.[link] || 'N/A'}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Skills</h3>
          <div className="mt-3">
            {profileData.skills?.length ? (
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.skills.join(", ")}
              </div>
            ) : (
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                No skills added
              </div>
            )}
          </div>

          {/* Achievements */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Achievements</h3>
          <div className="mt-3">
            {profileData.achievements?.length ? (
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.achievements.join(", ")}
              </div>
            ) : (
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                No achievements added
              </div>
            )}
          </div>


          {/* Resume Link */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resume Link</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.resume ? (
                  <a
                    href={profileData.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  'No resume uploaded'
                )}
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">About Me</label>
              <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2">
                {profileData.aboutMe || 'No about me information provided'}
              </div>
            </div>
          </div>

        </div>
      </div>
       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
