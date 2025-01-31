import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/20/solid';
import { FaGithub, FaLinkedin, FaGlobe, FaInstagram, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaUniversity, FaBuilding, FaLocationArrow, FaLaptopCode } from 'react-icons/fa';
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../Loader';

export default function ViewProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API


  useEffect(() => {
    const fetchProfileData = async () => {
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
          if (response.status === 401) {
            // Unauthorized, remove the token and navigate to login
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
            throw new Error('Failed to fetch profile data');
          }
        }


        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar className="sticky top-0 z-50" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex mt-[navbar-height]">
        <div className="w-1/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-11/12 md:w-3/4 px-4 sm:px-6 m-auto">
          <div className="flex justify-end pt-2 pb-4 ml-4">
            <button
              onClick={() => navigate(`/editprofile`)}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" /> Edit
            </button>
          </div>

          <div className="p-6 sm:mr-0 font-sans rounded-lg shadow-lg bg-gray-50">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 text-center lg:pr-6 lg:border-r border-gray-300 mb-6 lg:mb-0">
                <img
                  src={profileData.profilePhoto || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLA994hpL3PMmq0scCuWOu0LGsjef49dyXVg&s"}
                  alt="Profile"
                  className="w-36 h-36 rounded-full mx-auto mb-4 border-2 p-1 border-gray-500 shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <h2 className="text-xl font-semibold text-gray-800">{profileData.firstName || <>&nbsp;</>} {profileData.lastName || <>&nbsp;</>}</h2>
                <p className="text-sm text-gray-600 mb-3">{profileData.presentCompany?.role || <>&nbsp;</>}</p>
                <div className="text-sm text-gray-700 leading-relaxed  flex items-center flex-wrap space-x-4">
                  <div className="flex items-center space-x-1">
                    <FaEnvelope className="text-gray-500" />
                    <span>{profileData.email || <>&nbsp;</>}</span>
                  </div>
                  {/* <span className="text-gray-400">||</span> */}
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
              <div className="lg:w-2/3 lg:pl-6">
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
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-4">Present Company</h3>
            {profileData.presentCompany ? (
              <div>
                <div className="flex flex-row flex-wrap gap-10 md:gap-x-24 gap-y-10">
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

            {/* Projects */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Projects</h3>
            {profileData.project?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.project.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl">
                        <FaLaptopCode />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {project.projectName || "Project Name"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.details || "Project Description"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* Display Repo Link with FA Icon */}
                      {project.repoLink && (
                        <p className="text-blue-500 text-sm flex items-center">
                          <FaGithub className="mr-2" />
                          <span className="font-medium">Repository:</span>{" "}
                          <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                            {project.repoLink}
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      {/* Display Live Link with FA Icon */}
                      {project.liveLink && (
                        <p className="text-blue-500 text-sm flex items-center">
                          <FaGlobe className="mr-2" />
                          <span className="font-medium">Live Link:</span>{" "}
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                            {project.liveLink}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 mt-6">No projects added.</div>
            )}

            {/* Preferences */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-6">Preferences</h3>
            {profileData.preferences?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.preferences.map((pref, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">
                        <FaLocationArrow />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {pref.preferredCompanyName || "Preferred Company Name"}
                        </h3>
                        <p className="text-sm text-gray-500">{pref.preferredPosition || "Preferred Position"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Expected CTC Range:</span>{" "}
                        {pref.expectedCTCRange || "Not Set"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No Preferences Set</p>
            )}

        

          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );


}
