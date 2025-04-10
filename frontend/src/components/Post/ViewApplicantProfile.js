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
import { IoShieldCheckmark } from "react-icons/io5";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ExperienceCarousel from '../Profile/ExperienceCarousel';
import ProjectCarousel from '../Profile/ProjectCarousel';
import Preferences from '../Profile/Preferences';
import Achievements from '../Profile/Achievements';
import AboutMeSection from '../Profile/AboutMe';


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
  const [selectedDocUpload, setSelectedDocUpload] = useState(false);
  const [openStatusBox, setOpenStatusBox] = useState(false);
  const [tempStatus, setTempStatus] = useState(""); // Holds temporary status before confirmation

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

        const data = await response.json();
        const { status } = data;
        setStatus(status);
        setSelectedDocUpload(!!data?.employer_doc);
        setUploadedFileUrl(data?.employer_doc);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    if (jobId && applicantId) fetchCurrentStatus();
  }, [Fronted_API_URL, applicantId, jobId]);



  // Handle status change selection
  const handleStatusChange = (newStatus) => {
    setTempStatus(newStatus); // Store the new status temporarily
    setOpenStatusBox(true); // Open confirmation dialog
  };

  //Confrim status change
  const confirmChange = async () => {
    setUpdatingStatus(true);
    try {
      await updateStatus(tempStatus); // Call API to update status
      setStatus(tempStatus); // Update actual status after confirmation
      setOpenStatusBox(false);
    } finally {
      setUpdatingStatus(false);
    }
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
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)}ed successfully`);
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
      <div className="flex mt-[navbar-height] bg-[#edede7]">
        <div className="w-full md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-4/4 px-0 sm:px-6 mx-auto">
          <div className={`col-span-2 flex justify-end items-center py-2 gap-1 ${isFollowing ? "flex-row gap-2 flex-wrap" : ""}`}>
            {/*<label htmlFor="status" className="font-medium text-gray-700">
              Update Status
            </label>*/}
            <select
              id="status"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="inline-flex rounded-md border border-gray-300 bg-white py-2 px-4 pr-6 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={status === "selected" || updatingStatus}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {updatingStatus && <FaSpinner className="ml-4 animate-spin text-indigo-600" />}

            {/* Confirmation Modal */}
            <Transition.Root show={openStatusBox} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={() => setOpenStatusBox(false)}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                              Confirm Status Change
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to change the status to{" "}
                                <strong className="text-indigo-900">
  {tempStatus.charAt(0).toUpperCase() + tempStatus.slice(1)}
</strong>

                              </p>
                              {tempStatus === "selected" && (
                                <p className="mt-2 text-sm font-bold text-red-600">
                                  This action cannot be undone.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            onClick={confirmChange}
                            disabled={updatingStatus}
                          >
                            {updatingStatus ? <FaSpinner className="animate-spin" /> : "Confirm"}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpenStatusBox(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            {/* File Uploading */}
            {isDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-semibold mb-4"> Select Document</h2>
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
                    User's Posted Jobs
                  </button>
                )}
                {/* <button
                  onClick={handleFollowUnfollow}
                  className="inline-flex gap-2 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {isFollowing ? <UserX size={17} /> : <UserPlus size={17} />}
                  {isFollowing ? "Unfollow" : "Follow"}
                </button> */}
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            {status === "selected" && !uploadedFileUrl && (
              <button
                onClick={() => setIsDialogOpen(true)} // Show dialog to upload file
                className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={updatingStatus}
              >
                Upload Document
              </button>
            )}

            {/* If the document is uploaded, show 'View Document' button */}
            {selectedDocUpload && (
              <button
                onClick={() => window.open(uploadedFileUrl, "_blank")} // Open the document in a new tab
                className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={updatingStatus}
              >
                View Document
              </button>
            )}
          </div>



          {isModalOpen && (
            // z index changed from z-50 to pixels 
            <div className="fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
              <div className="mx-4 relative bg-white rounded-lg shadow-lg w-100 max-h-[80vh] overflow-hidden">
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white z-40 border-b rounded-t-lg">
                  {/* Close Icon */}
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setJobs([]);
                    }}
                    className="absolute top-3 right-5 text-gray-500 hover:text-gray-700"
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

          <div className="p-2 sm:mr-0 font-sans rounded-md">
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full max-w-sm space-y-4 text-center lg:pr-4 mb-2 lg:mb-0 py-2 md:py-6 rounded-lg px-4 md:px-4 bg-white overflow-hidden">
                {/* Background for top half */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-700 rounded-t-lg z-0">
                </div>

                {/* Profile Image Container (Ensure it's above background) */}
                <div className="relative w-36 h-36 mx-auto z-10">
                  <div className="relative w-36 h-36 mx-auto bg-white rounded-full">
                    <img
                      src={profileData?.profilePhoto || person}
                      alt="Profile"
                      className="w-36 h-36 rounded-full border-2 p-1 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />

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
                    <div className="text-start">
                      <p className="text-md font-medium text-gray-800">{profileData?.presentCompany?.companyName || <>&nbsp;</>}</p>
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

              <div className="w-full max-w-5xl lg:mx-2 px-3 md:px-6 py-4 md:py-8 rounded-lg bg-white relative">
                {/* Follow/Unfollow Button (Top-Right) */}
                <button
  onClick={handleFollowUnfollow}
  className="absolute top-3 right-3 text-white bg-blue-700 p-2 rounded-full shadow-md transition hover:bg-blue-800 z-20"
>
  {isFollowing ? <UserX size={18} /> : <UserPlus size={18} />}
</button>



                {/* Conditionally Show Modal */}
                {isFollowing && isModalOpen && (
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
                          <FaTimes className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center py-4">Posted Jobs</h2>
                      </div>

                      {/* Modal Content */}
                      <div className="overflow-auto max-h-[70vh] p-4 hide-scrollbar">
                        {jobs.length > 0 ? (
                          <ul className="space-y-2">
                            {jobs.map((job) => (
                              <li
                                key={job._id}
                                onClick={() => job.status === "active" && handleViewDetails(job._id)}
                                className={`p-4 border rounded-md bg-gray-100 shadow-sm flex items-center justify-between cursor-pointer ${job.status === "inactive" ? "opacity-50 pointer-events-none" : ""
                                  }`}
                              >
                                <img
                                  src={job.companyLogoUrl || busi}
                                  alt={job.companyName}
                                  className="w-10 h-10 sm:w-16 sm:h-16 mr-4"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-base sm:text-lg md:text-xl">{job.jobRole}</h3>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                      {job.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                  <p className="text-sm sm:text-base text-gray-600">{job.companyName}</p>
                                  <p className="text-sm sm:text-base text-gray-500">Location: {job.location}</p>
                                  <p className="text-sm sm:text-base text-gray-500">
                                    End Date: {new Date(job.endDate).toLocaleDateString("en-GB")}
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


                {/* About Me Section */}
                <AboutMeSection profileData={profileData} />

                {/* Skills Section */}
                <h3 className="text-lg font-medium text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData?.skills?.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="text-sm bg-blue-100 text-gray-800 px-3 py-1 rounded-full">
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
