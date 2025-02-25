import React, { Fragment, useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { FaUniversity, FaBriefcase, FaBuilding, FaLocationArrow, FaLaptopCode, FaGithub, FaLinkedin, FaGlobe, FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaTimes } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../Loader';
import busi from "../../assets/company.png";
import { UserPlus, UserX } from "lucide-react";
import person from '../../assets/person.png';
import { EyeIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';

export default function ViewApplicantProfile() {
  const navigate = useNavigate();
  const { applicantId } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const location = useLocation();
  const { jobId } = location.state || {};
  const [status, setStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const statusOptions = ['applied', 'selected', 'rejected', 'on hold'];
  const Cloudinary_URL = process.env.REACT_APP_CLOUDINARY_URL; // Cloudinary API
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = React.useRef(null);

  // Open modal function
  const openModal = () => {
    setOpen(true);
  };

  // Close modal function
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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

        setIsFollowing(data.followers?.includes(userId) || false);

      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, [Fronted_API_URL, applicantId]);


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
  }, [Fronted_API_URL, applicantId, jobId]);

  // Handle status change selection
  const handleStatusChange = async (newStatus) => {
    if (newStatus === "selected") {
      setIsDialogOpen(true); // Open dialog before proceeding
      return;
    }

    await updateStatus(newStatus, null);
  };

  // Upload file and confirm selection
  const uploadAndConfirmSelection = async () => {
    if (!selectedFile) {
      toast.error("Please upload a document before selecting status.");
      return;
    }

    setUpdatingStatus(true);

    try {
      const fileUrl = await uploadImageToCloudinary(selectedFile);
      setUploadedFileUrl(fileUrl);
      await updateStatus("selected", fileUrl);
    } catch (error) {
      toast.error("File upload failed. Try again.");
    } finally {
      setUpdatingStatus(false);
      setIsDialogOpen(false);
    }
  };

  // Update status in backend
  const updateStatus = async (newStatus, fileUrl) => {
    setUpdatingStatus(true);

    try {
      const bearerToken = localStorage.getItem("token");
      const response = await fetch(
        `${Fronted_API_URL}/job/${jobId}/applicant/${applicantId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus, uploadedFileUrl: fileUrl }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/user-login");
        } else {
          throw new Error("Failed to update status");
        }
      }

      setStatus(newStatus);
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };


  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Referrwala Image"); // Replace with upload preset name

    const response = await fetch(`${Cloudinary_URL}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.secure_url; // Return only the URL of the uploaded image
  };


  const handleFollowUnfollow = async () => {
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`${Fronted_API_URL}/user/${action}/${applicantId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      } else {
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successfully`);
      }

      // Update state and fetch updated profile data
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(error.message);
    }
  };

  const handleShowJob = async () => {
    setIsModalOpen(true); // Open the modal
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${Fronted_API_URL}/job/user/${applicantId}`, {
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
        } else if (response.status === 404) {
          console.warn('Profile data not found.');
        } else if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error(error.message);
    }
  }

  const handleViewDetails = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
  };

  if (!profileData) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-0 sm:px-6 mx-auto">
          <div className={`col-span-2 flex justify-end items-center py-4 gap-1 ${isFollowing ? "flex-row gap-2 flex-wrap" : ""}`}>
            <label htmlFor="status" className="font-medium text-gray-700">
              Update Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="inline-flex rounded-md border border-gray-300 bg-white py-2 px-4 pr-6 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={updatingStatus} // Disable while updating
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {updatingStatus && <FaSpinner className="ml-4 animate-spin text-indigo-600" />}


            {/* File Uploading */}
            {isDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-semibold mb-4">Uploading Select Document</h2>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="mb-4 w-full border border-gray-300 p-2 rounded-md"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={uploadAndConfirmSelection}
                      disabled={!selectedFile || updatingStatus}
                      className={`px-4 py-2 rounded-md text-white ${updatingStatus || !selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                      {updatingStatus ? "Uploading..." : "Confirm Selection"}
                    </button>

                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <div className='flex'>
                {isFollowing && (
                  <button onClick={handleShowJob} className="mr-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    View Job Posted
                  </button>
                )}
                <button
                  onClick={handleFollowUnfollow}
                  className="inline-flex gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {isFollowing ? <UserX size={17} /> : <UserPlus size={17} />}
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="mx-4 relative bg-white rounded-lg shadow-lg w-100 max-h-[80vh] overflow-hidden">
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white z-10 border-b rounded-t-lg">
                  {/* Close Icon */}
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setJobs([]);
                    }}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className='w-6 h-6' />
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-center py-4">Posted Jobs</h2>
                </div>

                {/* Modal Content */}
                <div className="overflow-auto max-h-[70vh] p-4 hide-scrollbar">
                  {jobs.length > 0 ? (
                    <ul className="space-y-2">
                      {jobs.map((job) => (
                        <li
                          key={job?._id}
                          onClick={() => job.status === "active" && handleViewDetails(job._id)}
                          className={`p-4 border rounded-md bg-gray-100 shadow-sm flex items-center justify-between cursor-pointer ${job.status === "inactive" ? "opacity-50 pointer-events-none" : ""
                            }`}
                        >
                          <img
                            src={job?.companyLogoUrl || busi}
                            alt={job?.companyName}
                            className="w-10 h-10 sm:w-16 sm:h-16 mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-base sm:text-lg md:text-xl">{job?.jobRole}</h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${job?.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                                  }`}
                              >
                                {job.status === "active" ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600">{job?.companyName}</p>
                            <p className="text-sm sm:text-base text-gray-500">Location: {job?.location}</p>
                            <p className="text-sm sm:text-base text-gray-500">
                              End Date: {new Date(job?.endDate).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No jobs posted by this user.</p>
                  )}
                </div>

              </div>
            </div>
          )}

          <div className="p-6 font-sans rounded-lg shadow-lg bg-gray-50">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 text-center pr-6 md:border-r border-gray-300 mb-6 md:mb-0">
                <div className="w-36 h-36 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center bg-gray-200">
                  {profileData?.profilePhoto ? (
                    <img
                      src={profileData?.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                  )}
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                  {`${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() || <>&nbsp;</>}
                </h2>

                <div className="text-sm text-gray-700 leading-relaxed block">
                  <div className="flex items-center space-x-1">
                    <FaEnvelope className="text-gray-500" />
                    <span>{profileData?.email || <>&nbsp;</>}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaPhone className="text-gray-500" />
                    <span>{profileData?.mobileNumber || <>&nbsp;</>}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  {profileData?.links?.github && (
                    <a
                      href={profileData?.links?.github}
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
                      href={profileData?.links?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaGlobe className="text-2xl" />
                    </a>
                  )}
                  {profileData?.links?.instagram && (
                    <a
                      href={profileData?.links?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
                  {profileData?.links?.facebook && (
                    <a
                      href={profileData?.links?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition"
                    >
                      <FaFacebook className="text-2xl" />
                    </a>
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/3 pl-0 md:pl-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">About Me</h3>
                <p className="text-sm text-gray-700 mb-6">{profileData?.aboutMe || 'No about me information provided'}</p>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData?.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-sm bg-blue-100 text-gray-800 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Achievements</h3>
                <div className="mt-3">
                  {profileData.achievements?.length ? (
                    <div className="mt-1 block w-full p-2">
                      {profileData?.achievements.join(", ")}
                    </div>
                  ) : (
                    <div className="mt-1 block w-full p-2">
                      No achievements added
                    </div>
                  )}
                </div>

                {/* Resume */}
                <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Resume</h3>
                <div className="mt-3">
                  {profileData?.resume ? (
                    <div>
                      {/* Button to open the modal and view resume */}
                      <button
                        type="button"
                        onClick={openModal}
                        // className="mt-1 block w-25 p-2 bg-blue-500 text-white rounded"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-offset-2"
                      >
                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
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
                                  src={`data:application/pdf;base64,${profileData.resume}`}
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
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Education</h3>
            {profileData?.education?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData?.education.map((edu, index) => (
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
                          {edu?.level || "Education Level"}
                        </h3>
                        <p className="text-sm text-gray-500">{edu?.schoolName || "School/University Name"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Year of Passing:</span>{" "}
                        {edu?.yearOfPassing || "Not provided"}
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
            {profileData?.presentCompany ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Role:</span>
                    <span className="text-gray-600">{profileData?.presentCompany?.role || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Company Name:</span>
                    <span className="text-gray-600">
                      {profileData?.presentCompany?.companyName || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Company Email:</span>
                    <span className="text-gray-600">
                      {profileData?.presentCompany?.companyEmail || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Years of Experience:</span>
                    <span className="text-gray-600">
                      {profileData?.presentCompany?.yearsOfExperience || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Location:</span>
                    <span className="text-gray-600">{profileData?.presentCompany?.location || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">Current CTC:</span>
                    <span className="text-gray-600">
                      ₹{profileData?.presentCompany?.currentCTC || '-'} LPA
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
                {profileData?.experience.map((exp, index) => (
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
                          {exp?.companyName || "Company Name"}
                        </h3>
                        <p className="text-sm text-gray-500">{exp?.position || "Position"}</p>
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
                {profileData?.project.map((project, index) => (
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
                          {project?.projectName || "Project Name"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project?.details || "Project Description"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* Display Repo Link with FA Icon */}
                      {project?.repoLink && (
                        <a href={project?.repoLink} target="_blank" rel="noopener noreferrer">
                          <p className="text-blue-500 text-sm flex items-center">
                            <FaGithub className="mr-2" />
                            <span className="font-medium">Repository</span>{" "}
                          </p>
                        </a>
                      )}
                    </div>
                    <div className="mt-4">
                      {/* Display Live Link with FA Icon */}
                      {project?.liveLink && (
                        <a href={project?.liveLink} target="_blank" rel="noopener noreferrer">
                          <p className="text-blue-500 text-sm flex items-center">
                            <FaGlobe className="mr-2" />
                            <span className="font-medium">Live Link</span>{" "}
                          </p>
                        </a>
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
            {profileData?.preferences?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData?.preferences.map((pref, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">
                        {pref?.preferredCompanyURL ? (
                          <img src={pref?.preferredCompanyURL} alt="Company Logo" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <FaLocationArrow />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {pref?.preferredCompanyName || "Preferred Company Name"}
                        </h3>
                        <p className="text-sm text-gray-500">{pref?.preferredPosition || "Preferred Position"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Expected CTC Range:</span>{" "}
                        {pref?.expectedCTCRange || "Not Set"}
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
