import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import company from "../../assets/company.png";
import Loader from '../Loader';
import { FaTimes } from "react-icons/fa";
import { UserPlus, UserX } from "lucide-react";
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, DocumentArrowDownIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import ReportJob from './ReportJob';
import InfoCardGrid, { InfoCard } from './InfoCard';
import JobHeaderCard from './JobHeaderCard';
import JobDescriptionSection from './JobDescriptionSection';

export default function AppliedJobDetails() {
  const { jobId } = useParams(); // Extract jobId from URL
  const navigate = useNavigate(); // Navigation to different pages
  const [searchQuery, setSearchQuery] = useState('');
  const [jobData, setJobData] = useState(null);
  const [employeeDoc, setEmployeeDoc] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null); // Store the application status
  const [loading, setLoading] = useState(true); // Loading state
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const Cloudinary_URL = process.env.REACT_APP_CLOUDINARY_URL; // Cloudinary API
  const userId = localStorage.getItem('userId');
  const [verified, setVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [verifyFile, setVerifyFile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [usertofollow, setUsertofollow] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const cancelButtonRef = useRef(null);
  const [missingFields, setMissingFields] = useState([]);
  const [imgError, setImgError] = useState(false);

  const closeReportDialog = () => {
    toast.success("Post Reported", {
      autoClose: 100, // Toast disappears after 2 seconds
      onClose: () => setShowReportDialog(false) // Close dialog after toast disappears
    });
    navigate('/');
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');

        // Fetching job details
        const jobResponse = await fetch(`${Fronted_API_URL}/job/${jobId}`, {
          method: 'GET',
          headers: {
            // Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!jobResponse.ok) {
          throw new Error('Failed to fetch job data');
        }

        const jobData = await jobResponse.json();
        setJobData(jobData); // Set the job data


        // setIsFollowing(jobData.user.followers?.includes(userId) || false);

        // console.log(jobData.user);

        // if (jobData?.user?._id) {
        //   setUsertofollow(jobData.user._id); // Ensure _id exists before setting state
        // }

        // Now fetch the application status
        const statusResponse = await fetch(`${Fronted_API_URL}/job/user/${userId}/jobpost/${jobId}/application/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        const statusData = await statusResponse.json();

        // console.log("applicationStatus ----", statusData.status);
        setApplicationStatus(statusData.status);
        setVerified(!!statusData.employee_doc);
        setEmployeeDoc(statusData.employee_doc);
        setVerifyFile(statusData.employer_doc);

      } catch (error) {
        console.error('Error fetching job data or application status:', error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);


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
      return await response.json(); // Return the fetched data directly
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error(error.message);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const handleApply = async () => {
    try {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Check if user is logged in
      if (!bearerToken) {
        navigate('/user-login');
        return;
      }

      // Fetch the user profile
      const profile = await fetchProfileData();

      // Determine which fields are missing
      const missingFields = [];
      if (!profile.firstName) missingFields.push("Name");
      if (!profile.mobileNumber) missingFields.push("Mobile Number");
      if (!profile.aboutMe) missingFields.push("About Me");
      if (!profile.resume) missingFields.push("Resume");

      if (missingFields.length > 0) {
        setMissingFields(missingFields); // Save state to show in modal
        setProfileIncomplete(true);
        return;
      }

      // If profile is complete, proceed with job application
      const response = await fetch(`${Fronted_API_URL}/job/apply/${jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Unauthorized, remove token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          throw new Error(errorData.message || response.statusText);
        }
      }

      toast.success("Application Submitted", {
        onClose: () => navigate('/appliedjobs') // Navigates only after the toast is closed
      });
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleFollowUnfollow = async () => {
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(`${Fronted_API_URL}/user/${action}/${usertofollow}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      } else {
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)}ed successfully`);

        // Update state and fetch updated profile data
        setIsFollowing(!isFollowing);
      }

      // Update state and fetch updated profile data
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(error.message);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Upload and Confirm Selection
  const uploadAndConfirmSelection = async () => {
    if (!selectedFile) {
      toast.error("Please select a document before confirming.");
      return;
    }

    setUploading(true);
    try {
      // Upload file to Cloudinary
      const uploadedFileUrl = await uploadImageToCloudinary(selectedFile);

      // Send to backend after successful upload
      await updateEmployeeDocument(uploadedFileUrl);

      toast.success("Document uploaded successfully!");
      setVerified(true);
      setIsDialogOpen(false); // Close the dialog box after success
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document.");
    } finally {
      setUploading(false);
      setSelectedFile(null); // Reset file state
    }
  };


  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Referrwala Image");

    const response = await fetch(`${Cloudinary_URL}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.secure_url;
  };

  // Saving Document Of verification
  const updateEmployeeDocument = async (fileUrl) => {
    setUploading(true);
    const bearerToken = localStorage.getItem("token");

    const response = await fetch(`${Fronted_API_URL}/job/${jobId}/applicant/${userId}/document`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentUrl: fileUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to update employee document");
    }

    setEmployeeDoc(fileUrl); // Update state with new document URL
  };

  const handleViewUserProfile = (userId) => {
    navigate(`/checkuserprofile/${userId}`);
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


  const isLoggedIn = !!localStorage.getItem('token');

  const handleReportClick = (jobId) => {
    if (!isLoggedIn) {
      toast.error('Please log in first!');
      return;
    }
    setSelectedJobId(jobId);
    setShowReportDialog(true);
  };

  const handleWithdrawClick = async (jobId) => {
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`${Fronted_API_URL}/job/withdraw/${jobId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      } else {
        toast.success(`Withdraw Successful!`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            navigate(`/appliedjobs`);
          }
        });
        setShowWithdrawDialog(false)
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(error.message);
    }
  };


  if (loading) {
    return (
      <Loader />
    );
  }

  if (!jobData) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-600">Error: Job data could not be fetched.</p>
      </div>
    );
  }


  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/5 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-3/4 m-auto border-2 mt-2 md:px-2 px-2 mb-4">
          <div className="col-span-2 flex md:justify-between justify-center px-1 py-3 items-center flex-wrap gap-2">
            {/* Posted By Section (Always Visible) */}
            <div className="flex gap-1">
              <div
                className="flex gap-2 cursor-pointer px-4 py-1 bg-gray-200 items-center rounded-full text-gray-700 hover:bg-gray-300 transition border border-gray-300 md:text-sm text-xs"
                onClick={() => handleViewUserProfile(jobData.user?._id)}
              >
                {jobData.user?.profilePhoto ? (
                  <img
                    src={jobData.user?.profilePhoto}
                    className="h-6 w-6 border rounded-full object-cover"
                    alt="Profile"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a5 5 0 00-5 5v1a5 5 0 0010 0V7a5 5 0 00-5-5zM4 21v-2a6 6 0 0112 0v2a1 1 0 01-1 1H5a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="font-medium text-gray-800">Posted By:</span>
                <span className="text-blue-600 hover:underline">{jobData.user?.firstName}</span>
              </div>

              <div
                className="flex gap-2 cursor-pointer px-4 py-1 bg-gray-200 items-center rounded-full text-gray-700 hover:bg-gray-300 transition border border-gray-300 md:text-sm text-xs"
                onClick={() => handleReportClick(jobData._id)}
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-800">Report</span>
              </div>

              {applicationStatus && (
                <div
                  className="flex gap-2 cursor-pointer px-4 py-1 bg-gray-200 items-center rounded-full text-gray-700 hover:bg-gray-300 transition border border-gray-300 md:text-sm text-xs"
                  onClick={() => setShowWithdrawDialog(true)}
                >
                  <DocumentArrowDownIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-800">Withdraw</span>
                </div>
              )}
            </div>

            {/* Modal for Closing Job */}
            <Transition.Root show={showWithdrawDialog} as={Fragment}>
              <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setShowWithdrawDialog(false)}>
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
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                              Withdraw Application
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to withdraw your application from this job? This action cannot be undone.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            onClick={() => handleWithdrawClick(jobData._id)}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setShowWithdrawDialog(false)}
                            ref={cancelButtonRef}
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

            {/* Application Status & Buttons */}
            {applicationStatus === "applied" ? (
              <p className="text-blue-600 font-medium">Already Applied.</p>
            ) : applicationStatus === "selected" ? (
              <div>
                <p className="text-green-600 font-medium text-center">Congratulations! You have been selected for this job.</p>
                <button
                  onClick={() => {
                    if (verifyFile) {
                      window.open(verifyFile, "_blank"); // Open the employer's document in a new tab
                    } else {
                      toast.error("No document available");
                    }
                  }}
                  className="mt-2 mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Selected Document
                </button>
                {!verified && (
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {uploading ? "Uploading..." : "Upload Confirmation Document"}
                  </button>
                )}
                {/* Show the "View Employee Document" Button if there's a document available */}
                {verified && (
                  <button
                    onClick={() => window.open(employeeDoc, "_blank")} // Open the employee's document in a new tab
                    className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    View Confirmation Document
                  </button>
                )}
              </div>
            ) : applicationStatus === "rejected" ? (
              <p className="text-red-600 font-medium">Your application was rejected.</p>
            ) : applicationStatus === "on hold" ? (
              <p className="text-yellow-600 font-medium">Your application is on hold.</p>
            ) : (
              <button
                onClick={handleApply}
                disabled={jobData?.status === "inactive"}
                className={`w-full md:w-auto text-center rounded-full border border-transparent ${jobData?.status === "inactive" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} py-2 px-7 text-md font-light text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                Apply
              </button>
            )}
          </div>

          {isDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Select Document</h2>
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
                    disabled={!selectedFile || uploading}
                    className={`px-4 py-2 rounded-md text-white ${uploading || !selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    {uploading ? "Uploading..." : "Confirm Selection"}
                  </button>

                </div>
              </div>
            </div>
          )}


          {/* Uncomment this */}
          {showReportDialog && selectedJobId && (
            <ReportJob
              jobId={selectedJobId}
              isLoggedIn={isLoggedIn}
              onReportSuccess={closeReportDialog}  // Close after reporting
              onCancel={() => setShowReportDialog(false)}
            />
          )}


          <section className="bg-white p-3 md:p-5 mb-2 w-full transition-all duration-300 ease-in-out">
            <JobHeaderCard jobData={jobData} />

            <div className="flex mt-4 flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-3">
              <p className="text-md md:text-xl font-bold text-gray-900">
                {jobData?.companyName || "Role not specified"}
              </p>
              <span className="text-sm md:text-md font-normal text-blue-700 bg-blue-100 px-4 py-1 rounded-full shadow-sm">
                {jobData?.location || "N/A"}
              </span>
            </div>

            <hr />

            <InfoCardGrid jobData={jobData} getDate={getDate} />

            {/* Description */}
            <JobDescriptionSection jobData={jobData} />


            {/* Divider */}
            {/* <div className="my-8 border-t border-gray-200" /> */}
          </section>

        </div>

        {profileIncomplete && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg z-50 max-w-xl w-full">
              <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                To increase your chances of getting selected, please complete your profile.
              </p>
              <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                {missingFields.map((field, index) => (
                  <li key={index}>{field} is missing</li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => navigate("/editprofile")}
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>

    </>
  );
}


{/* <section class="bg-white py-4 antialiased md:py-6">
  <div class="mx-auto px-1 2xl:px-0">

    <div class="py-4 md:py-8">
      <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
        <div class="space-y-4">
          <div class="flex space-x-4 gap-[20%]">
            <div className="w-24 h-24 rounded-full border-4 border-blue-700 flex items-center justify-center bg-blue-100">
              {!imgError && jobData?.companyLogoUrl ? (
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={jobData.companyLogoUrl}
                  alt="Company"
                  onError={() => setImgError(true)}
                />
              ) : (
                <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
              )}
            </div>
            <div className="flex flex-col">
              <dl class="block sm:hidden">
                <dt class="mb-1 text-gray-700 font-normal">Job ID</dt>
                <dd class="font-medium text-sm text-gray-900">{jobData?.jobUniqueId}</dd>
              </dl>
              <dl class="block sm:hidden">
                <dt class="mb-1 text-gray-700 font-normal">CTC</dt>
                <dd class="font-medium text-sm text-gray-900">{jobData?.ctc}</dd>
              </dl>
            </div>
          </div>
          <dl class="hidden sm:block">
            <dt class="mb-1 text-gray-700 font-normal">Job ID</dt>
            <dd class="font-medium text-sm text-gray-900">{jobData?.jobUniqueId}</dd>
          </dl>
          <dl class="hidden sm:block">
            <dt class="mb-1 text-gray-700 font-normal">CTC</dt>
            <dd class="font-medium text-sm text-gray-900">{jobData?.ctc}</dd>
          </dl>


          <dl>
            <a href={jobData?.jobLink} target="_blank" rel="noopener noreferrer">
              <p className="text-blue-500 gap-1 hover:underline hover:underline-offset-2 hover:text-blue-700 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>

                <span className="font-medium">Job Link</span>{" "}
              </p>
            </a>
          </dl>

        </div>
        <div class="space-y-4">
          <dl class="">
            <dt class="mb-1 text-gray-700 font-normal">Experience Required (Years)</dt>
            <dd class="font-medium text-sm text-gray-900">{jobData?.experienceRequired}</dd>
          </dl>
          <dl>
            <dt class="mb-1 text-gray-700 font-normal">Number of Referrals</dt>
            <dd class="font-medium text-sm text-gray-900">{jobData?.noOfReferrals}</dd>
          </dl>
          <dl>
            <dt class="mb-1 mb-1 text-gray-700 font-normal">End Date</dt>
            <dd class="flex items-center space-x-4 font-medium text-sm text-gray-900">
              <div>
                <div class="text-sm">
                  <p class="mb-0.5 font-medium text-gray-900">{getDate(jobData?.endDate)}</p>
                </div>
              </div>
            </dd>
          </dl>
          <dl>
            <dt class="mb-1 text-gray-700 font-normal">Work Mode</dt>
            <dd class="flex items-center gap-1 font-medium text-sm text-gray-900">
              <svg class="hidden h-5 w-5 shrink-0 text-gray-400  lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
              </svg>
              {jobData?.workMode}
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 border-b-2 border-t border-gray-300/80 py-3 md:py-4 lg:grid-cols-4 xl:gap-6">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden bg-gray-200 rounded-full p-1 h-7 w-7 shrink-0 text-gray-600 lg:inline">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>

        <h3 class="mb-1 text-blue-700 font-bold">Job Role</h3>
        <span class="flex items-center font-medium text-sm text-gray-900"
        >{jobData?.jobRole}
        </span>
      </div>

      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden bg-gray-200 rounded-full p-1 h-7 w-7 shrink-0 text-gray-600 lg:inline">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
        </svg>

        <h3 class="mb-1 text-blue-700 font-bold">Employement Type</h3>
        <span class="flex items-center font-medium text-sm text-gray-900"
        >{jobData?.employmentType}
        </span>
      </div>

      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="hidden bg-gray-200 rounded-full p-1 h-7 w-7 shrink-0 text-gray-600 lg:inline">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>

        <h3 class="mb-1 text-blue-700 font-bold">Company</h3>
        <span class="flex items-center font-medium text-sm text-gray-900"
        >{jobData?.companyName}
        </span>
      </div>


      <div>
        <svg class="hidden bg-gray-200 rounded-full p-1 h-7 w-7 shrink-0 text-gray-600 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
        </svg>
        <h3 class="mb-1 text-blue-700 font-bold">Location</h3>
        <span class="flex items-center font-medium text-sm text-gray-900"
        >{jobData?.location}
        </span>
      </div>

    </div>

    <div className="col-span-2 pb-4">
      <label className="block text-sm font-bold text-blue-700">Job Description</label>
      <div
        className="mt-1 text-sm text-justify block w-full rounded-none"
        dangerouslySetInnerHTML={{ __html: jobData?.jobDescription }}
      />
    </div>

  </div>
</section> */}