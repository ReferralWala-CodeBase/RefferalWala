import React, { Fragment, useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, EyeIcon } from '@heroicons/react/20/solid';
import { FaGithub, FaLinkedin, FaGlobe, FaInstagram, FaFacebook, FaEnvelope, FaPhone ,FaCheckCircle} from "react-icons/fa";
import { FaUniversity, FaBuilding, FaLocationArrow, FaLaptopCode } from 'react-icons/fa';
import { IoShieldCheckmark } from "react-icons/io5";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../Loader';
import person from '../../assets/person.png'
import Achievements from './Achievements';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from "react-icons/fa";
import ExperienceCarousel from './ExperienceCarousel';
import ProjectCarousel from './ProjectCarousel';
import Preferences from './Preferences';
import AboutMeSection from './AboutMe';

export default function ViewProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [open, setOpen] = useState(false);
  const cancelButtonRef = React.useRef(null);
  const [profileCompletion, setProfileCompletion] = useState(null);

  // Open modal function
  const openModal = () => {
    setOpen(true);
  };

  // Close modal function
  const handleCloseModal = () => {
    setOpen(false);
  };


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
  useEffect(() => {
    const fetchProfileCompletion = async () => {
      try {
        const bearerToken = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
  
        const response = await fetch(`${Fronted_API_URL}/user/profile-completion/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch profile completion");
        }
  
        const data = await response.json();
        setProfileCompletion(data.profileCompletion); // Assuming API returns { profileCompletion: 75 }
      } catch (error) {
        console.error("Error fetching profile completion:", error);
      }
    };
  
    fetchProfileCompletion();
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = profileCompletion !== null ? (profileCompletion / 100) * circumference : 0;

  if (!profileData) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar className="sticky top-0 z-50" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex mt-[navbar-height] bg-[#edede7]">
        <div className="w-1/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-4/4 px-0 sm:px-6 m-auto">
          <div className="p-3 sm:mr-0 font-sans rounded-md">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full max-w-sm space-y-4 text-center lg:pr-4 mb-2 lg:mb-0 py-2 md:py-6 rounded-lg px-4 md:px-4 bg-white overflow-hidden">
                {/* Background for top half */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-700 rounded-t-lg z-0">
                  <button
                    onClick={() => navigate(`/editprofile`)}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md  transition z-20"
                  >
                    <PencilIcon className="h-4 w-4 text-black" aria-hidden="true" />
                  </button></div>

                {/* Profile Image Container (Ensure it's above background) */}
                <div className="relative w-36 h-36 mx-auto z-10">
                  <div className="relative w-36 h-36 mx-auto bg-white rounded-full">
                    <img
                      src={profileData?.profilePhoto || person}
                      alt="Profile"
                      className="w-36 h-36 rounded-full border-2 p-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />        {/* Profile Completion Percentage Badge */}
                    {profileCompletion !== null && (
                      <div className="absolute bottom-4 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        {profileCompletion}%
                      </div>
                    )}
                                </div>
              
                              </div>
                              <div className="flex flex-col items-center space-y-2">
                {/* Name */}
                <h2 className="text-xl font-semibold text-gray-800 text-center flex items-center justify-center space-x-1">
                <span>
                  {profileData?.firstName || <>&nbsp;</>} {profileData?.lastName || <>&nbsp;</>}
                </span>
              
                {/* Verified Badge with Tooltip */}
                {profileData?.presentCompany?.CompanyEmailVerified && (
                  <div className="relative group">
                    <IoShieldCheckmark className="text-blue-500 w-7 h-7 cursor-pointer" />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Verified
                    </span>
                  </div>
                )}
              </h2>
              
                {/* Company Logo & Details */}
                <div className="flex items-center space-x-3 p-2 rounded-lg">
                  {/* Company Logo */}
                  {profileData?.presentCompany?.companyLogoUrl ? (
                <img
                  src={profileData?.presentCompany?.companyLogoUrl}
                  alt={`${profileData?.presentCompany?.companyName} Logo`}
                  className="h-12 w-12 object-cover rounded-full"
                />
              ) : null}
              
                  {/* Company Name & Role */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">{profileData?.presentCompany?.companyName || <>&nbsp;</>}</p>
                    <p className="text-sm text-gray-600">{profileData?.presentCompany?.role || <>&nbsp;</>}</p>
                  </div>
                </div>
              </div>
              
                              <div className="text-sm text-gray-700 space-y-2 leading-relaxed block">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-600" />
                    <span className='font-light text-sm cursor-pointer'>{profileData?.email || <>&nbsp;</>}</span>
                  </div>
                  {/* <span className="text-gray-400">||</span> */}
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-gray-600" />
                    <span className='font-light text-sm'>{profileData?.mobileNumber || <>&nbsp;</>}</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {profileData?.links?.github && (
                    <a
                      href={profileData?.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaGithub className="text-2xl" />
                    </a>
                  )}

                  {profileData?.links?.linkedin && (
                    <a
                      href={profileData?.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaLinkedin className="text-2xl" />
                    </a>
                  )}

                  {profileData?.links?.website && (
                    <a
                      href={profileData?.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaGlobe className="text-2xl" />
                    </a>
                  )}

                  {profileData?.links?.instagram && (
                    <a
                      href={profileData?.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}

                  {profileData?.links?.facebook && (
                    <a
                      href={profileData?.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaFacebook className="text-2xl" />
                    </a>
                  )}
                </div>
              </div>

              <div className="w-full max-w-5xl lg:mx-2 px-3 md:px-6 py-4 md:py-8 rounded-lg bg-white">
                <AboutMeSection profileData={profileData} /><h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData?.skills?.length > 0 ? (
                    profileData?.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-sm bg-blue-100 text-gray-800 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added</p>
                  )}
                </div>
                {/* Achievements */}
                <Achievements achievements={profileData?.achievements || []} />

                <div className="mt-3">
                  {profileData?.resume ? (
                    <div>
                      <button
                        type="button"
                        onClick={openModal}
                        className="flex gap-2 text-sm items-center px-4 py-1 rounded-full bg-blue-500 text-white"
                      >
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        View Resume
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 block w-full p-2">No resume uploaded</div>
                  )}
                </div>

                {/* Resume Dialog */}
                {open && (
                  <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleCloseModal}>
                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto mt-4">
                        <div className="flex min-h-full items-center justify-center p-2 text-center sm:items-center sm:p-0">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:max-w-3xl w-full sm:h-auto h-3/4 p-6">
                              <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Uploaded Resume
                                  </Dialog.Title>
                                </div>
                              </div>
                              <div className="mt-3">
                                {/* Display the Base64 resume as an embedded PDF */}
                                <iframe
                                  src={`data:application/pdf;base64,${profileData?.resume}`}
                                  width="100%"
                                  height="500px"
                                  title="Resume"
                                ></iframe>
                              </div>
                              {/* Close Button */}
                              <button
                                onClick={handleCloseModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                              >
                                <FaTimes className="w-6 h-6" />
                              </button>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                )}

              </div>
            </div>

            { /* Education */}
            <div className='bg-white rounded-lg mt-2 lg:w-2/2 px-2 py-3 md:px-4 md:mr-2'>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm px-1">Education</h3>
              {profileData?.education?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileData?.education.map((edu, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg border-gray-300 hover:shadow-xl transition-shadow duration-300"
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
                  Education is the key—open the door to success.
                </div>
              )}
            </div>

            {/* Present Company Section */}
            {/* <div className='bg-white rounded-lg mt-2 lg:w-2/2 px-2 py-4 md:px-4 md:mr-2'>
              <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-4">Present Company</h3>
              {profileData?.presentCompany ? (
                <div>
                  <div className="flex flex-row flex-wrap gap-8 md:gap-x-20 gap-y-10">
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Role</span>
                      <span className="text-gray-600">{profileData?.presentCompany.role || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Company Name</span>
                      <span className="text-gray-600">
                        {profileData?.presentCompany.companyName || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Company Email</span>
                      <span className="text-gray-600">
                        {profileData?.presentCompany.companyEmail || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Years of Experience</span>
                      <span className="text-gray-600">
                        {profileData?.presentCompany.yearsOfExperience || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Location</span>
                      <span className="text-gray-600">{profileData?.presentCompany.location || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700">Current CTC</span>
                      <span className="text-gray-600">
                        ₹{profileData?.presentCompany.currentCTC || '-'} LPA
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">No present company details added.</div>
              )}
            </div> */}

            {/* Experience Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 bg-white rounded-lg mt-2 lg:w-2/2 px-2 py-4 md:px-4 md:mr-2">
              {/* Experience Section */}
              <ExperienceCarousel experience={profileData?.experience} />


              {/* Projects Section */}
              <ProjectCarousel projects={profileData?.project} />


              {/* Preferences Section */}
              <Preferences preferences={profileData?.preferences} />

            </div>

          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );


}
