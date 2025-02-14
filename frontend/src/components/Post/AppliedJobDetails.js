import React, { useState, useEffect } from 'react';
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
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [verifyFile, setVerifyFile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [usertofollow, setUsertofollow] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);

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
        setApplicationStatus(statusData.status);
        setVerified(!!statusData.employee_doc);
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

      // Check for profile completeness
      if (
        !profile.firstName ||
        !profile.lastName ||
        !profile.mobileNumber ||
        !profile.aboutMe
      ) {
        setProfileIncomplete(true); // Show dialog box for profile completion
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

      toast.success("Successfully applied for the job!");
      navigate('/appliedjobs');
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
        toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successfully`);

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
        <div className="w-10/12 md:w-3/4 m-auto">
        <div className="col-span-2 flex justify-between p-4 items-center flex-wrap gap-2">
  {/* Posted By Section (Always Visible) */}
  <div
    className="flex gap-2 cursor-pointer px-4 py-2 bg-gray-200 items-center rounded-full text-gray-700 hover:bg-gray-300 transition border border-gray-300"
    onClick={() => handleViewUserProfile(jobData.user?._id)}
  >
    <img
      src={jobData?.companyLogoUrl}
      className="h-6 w-6 border rounded-full object-cover"
      alt=""
    />
    <span className="font-medium text-gray-800">Posted By:</span>
    <span className="text-blue-600 hover:underline">{jobData.user?.firstName}</span>
  </div>

  {/* Application Status & Buttons */}
  {applicationStatus === "applied" ? (
    <p className="text-blue-600 font-medium">You have applied for this job.</p>
  ) : applicationStatus === "selected" ? (
    <div>
      <p className="text-green-600 font-medium text-center">You have been selected for this job!</p>
      <button
        onClick={() => setIsDocumentOpen(true)}
        className="mt-2 mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Selected Document
      </button>
      {!verified && (
        <button
          onClick={() => setIsDialogOpen(true)}
          className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {uploading ? "Uploading..." : "Uploading Selected Document"}
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
      className="w-full md:w-auto text-center rounded-full border border-transparent bg-blue-600 py-2 px-7 text-md font-light text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Apply
    </button>
  )}
</div>

          <section class="bg-white py-4 antialiased md:py-6">
            <div class="mx-auto px-1 2xl:px-0">
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
              <div class="py-4 md:py-8">
                <div class="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                  <div class="space-y-4">
                    <div class="flex space-x-4 gap-[20%]">
                      <img class="h-24 w-24 border-4 border-blue-700 rounded-full" src={jobData?.companyLogoUrl} alt="Company" />
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
                      <dt class="mb-1 text-gray-700 font-normal">Job Link</dt>
                      <dd class="flex items-center gap-1 font-medium hover:text-blue-500 cursor-pointer transition text-sm text-gray-900">

                        {jobData?.jobLink}
                      </dd>
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

                <hr className='mt-3 mb-3 text-gray-700' />

                <div className="col-span-2 pb-4">
                  <label className="block text-sm font-bold text-blue-700">Job Description</label>
                  <div className="mt-1 text-sm text-justify block w-full rounded-none">{jobData?.jobDescription}</div>
                </div>
                <button type="button" data-modal-target="accountInformationModal2" data-modal-toggle="accountInformationModal2" class="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">
                  <svg class="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                  </svg>
                  Apply
                </button>
              </div>

            </div>
          </section>
        </div>

        {profileIncomplete && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg z-50 max-w-xl w-full">
              <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please fill in your profile details, including your mobile number,skills, description and other information, before applying for a job.
              </p>
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


