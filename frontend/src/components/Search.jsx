import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { UserMinusIcon, UserPlusIcon, BellIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { FaBuilding, FaFilter, FaMapMarkerAlt, FaSpinner, FaTimes } from "react-icons/fa";
import ReportJob from './Post/ReportJob';
import SidebarNavigation from '../components/SidebarNavigation';
import busi from "../assets/company.png";

export default function Search() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTableView, setIsTableView] = useState(false);
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const Fronted_API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [wishlistJobs, setWishlistJobs] = useState([]);
    const [ShowJobData, setShowJobData] = useState(false);
    const [jobs, setJobs] = useState([]);
    const isLoggedIn = !!localStorage.getItem('token');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const [followingStatus, setFollowingStatus] = useState({});


    useEffect(() => {
        console.log("userId" + userId);
        if (location.state?.jobData) {
            setData(location.state.jobData);
            setShowJobData(true);
        } else if (location.state?.userData) {
            setData(location.state.userData);
        }
    }, [location.state, data]);

    console.log(data);

    function getDate(endDate_param) {
        var tempDate = endDate_param + "";
        var date = '';
        for (let i = 0; i < tempDate.length; i++) {
            if (/^[a-zA-Z]$/.test(tempDate[i]))
                break;
            else
                date += tempDate[i];
        }
        return date;
    }

    const handleReportClick = (jobId) => {
        if (!isLoggedIn) {
            toast.error('Please log in first!');
            return;
        }
        setSelectedJobId(jobId);
        setShowReportDialog(true);
    };

    const handleReportSuccess = () => {
        toast.success("Job Reported Successfully.");
        setShowReportDialog(false);
        setSelectedJobId(null);
    };

    const handleAddToWishlist = async (jobId) => {
        try {
            const response = await fetch(
                `${Fronted_API_URL}/job/wishlist/add`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, jobId }),
                }
            );
            if (response.ok) {
                setWishlistJobs((prev) => [...prev, jobId]);
                toast.success("Successfully added to wishlist!");
            }
        } catch (error) {
            toast.error("Failed to add to wishlist.");
        }
    };
    const handleRemoveFromWishlist = async (jobId) => {
        try {
            const response = await fetch(
                `${Fronted_API_URL}/job/wishlist/remove`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, jobId }),
                }
            );
            if (response.ok) {
                setWishlistJobs((prev) => prev.filter((id) => id !== jobId)); // Remove job ID from local state
                toast.success("Successfully removed from wishlist!");
            }
        } catch (error) {
            toast.error("Failed to remove from wishlist.");
        }
    };

    // Handle follow request
    const handleFollow = async (targetUserId) => {
        if (!userId) return;

        try {
            const response = await fetch(
                `${Fronted_API_URL}/user/follow/${targetUserId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                }
            );
            if (response.ok) {
                setIsFollowing(true);
                setFollowingList((prevList) => [...prevList, { _id: targetUserId }]); // Add the followed user to the list
                toast.success("Followed Successfully.");
            } else {
                console.error("Follow request failed");
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }
        } catch (error) {
            console.error("Error following the user:", error);
        }
    };

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
            const data = await response.json();
            setIsFollowing(data.followers?.includes(userId) || false);
            return data;
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error(error.message);
            throw error; // Rethrow the error to handle it in the calling function
        }
    };

    const handleView = async (jobId) => {
        if (localStorage.getItem('token') === null) {
            navigate('/user-login');
        } else {
            try {
                const profile = await fetchProfileData(); // Fetch profile data
                if (
                    profile.firstName == null ||
                    profile.lastName == null ||
                    profile.mobileNumber == null ||
                    profile.education?.length === 0 ||
                    profile.skills?.length === 0 ||
                    !profile.resume ||
                    !profile.aboutMe
                ) {
                    toast.success("Fill your mandatory profile fields first");
                } else {
                    navigate(`/appliedjobdetails/${jobId}`);
                }
            } catch (error) {
                console.error('Error in handleView:', error);
            }
        }
    };

    const handleShare = async (jobId) => {
        if (!jobId || typeof jobId !== 'string') {
            console.error('Invalid Job ID:', jobId);
            toast.error('Job ID is invalid. Please try again.');

            return;
        }

        const currentUrl = `${window.location.origin}/appliedjobdetails/${jobId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Job Details',
                    text: 'Check out this job on ReferralWala!',
                    url: currentUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                toast.success("Link Copied.");
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                toast.error('Error copying to clipboard:', error);

            }
        }
    };

    const handleShowJob = async (applicantId) => {
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
                } else {
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

    const handleViewUserProfile = (userId) => {
        navigate(`/checkuserprofile/${userId}`);
    };

    return (
        <div>
            <Navbar className="sticky top-0 z-50" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex mt-[navbar-height]">
                <div className="w-1/12 md:w-1/4 fixed lg:relative">
                    <SidebarNavigation />
                </div>
                <div className="w-11/12 md:w-3/4 px-2 sm:px-6 m-auto">
                    <h1 class="text-xl font-semibold text-gray-900 mb-6 mt-5">Search Results</h1>
                    {data ? (
                        // If ShowJobData is false, show user data
                        !ShowJobData ? (
                            <ul>
                                <div className="flex flex-wrap gap-4">
                                    {data.map((user) => {
                                        const isFollowing = followingStatus[user._id] || user.followers?.includes(userId); // Check if the current user is in the follower list

                                        return (
                                            <div
                                                key={user._id}
                                                className="p-4 sm:p-6 border rounded-lg shadow-md w-full max-w-xs sm:max-w-3xl bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                                onClick={() => handleViewUserProfile(user._id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    {/* Profile Image */}
                                                    <img
                                                        className="h-12 w-12 md:h-20 md:w-20 rounded-full border-2 p-1 border-gray-500 shadow-md object-cover"
                                                        src={user.profilePhoto || "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                                                        alt="avatar"
                                                    />

                                                    {/* User Details */}
                                                    <div className="flex-1 ml-3 sm:ml-4">
                                                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                                                        <p className="text-[11px] sm:text-sm text-gray-500">{user.email}</p>
                                                        <p className="text-[11px] sm:text-sm text-gray-500">{user.mobileNumber}</p>
                                                        <p className="text-[11px] sm:text-sm text-gray-500">
                                                            {user.presentCompany?.role ? `${user.presentCompany?.role} at ` : ''}{user.presentCompany?.companyName || ''}
                                                        </p>
                                                    </div>

                                                    {/* Action Button */}
                                                    <div>
                                                        {isFollowing ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleShowJob(user._id)
                                                                }}
                                                                className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow hover:bg-indigo-700 text-xs sm:text-sm"
                                                            >
                                                                Posted Job
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFollow(user._id); // Follow the user
                                                                    setFollowingStatus((prevStatus) => ({ ...prevStatus, [user._id]: true })); // Update state to show "Posted Job"
                                                                }}
                                                                className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow hover:bg-indigo-700 text-xs sm:text-sm"
                                                            >
                                                                Follow
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        );
                                    })}
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
                                                                key={job._id}
                                                                onClick={() => handleViewDetails(job._id)}
                                                                className="p-4 border rounded-md bg-gray-100 shadow-sm flex items-center justify-between cursor-pointer"
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
                                                                    <p className="text-sm sm:text-base text-gray-500">End Date: {new Date(job.endDate).toLocaleDateString("en-GB")}</p>
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

                            </ul>
                        ) : (
                            <>
                                <ul
                                    role="list"
                                    className="grid grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-3 xl:gap-x-3 px-4"
                                >

                                    {data.filter((item) => !item.firstName).map((job) => ((
                                        <motion.li
                                            key={job._id}
                                            className="relative max-w-md w-full rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute top-2 left-2 z-10">
                                                <button className="flex items-center justify-center w-8 h-8 hover:text-red-600 hover: transition">

                                                    {wishlistJobs.includes(job._id) ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                            className="w-8 h-8 text-red-500"
                                                            onClick={() => handleRemoveFromWishlist(job._id)}
                                                        >
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                            className="w-5 h-5 text-white"
                                                            onClick={() => handleAddToWishlist(job._id)}
                                                        >
                                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Top Section */}
                                            <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                                            <div className="absolute mt-8 top-2 right-2">
                                                <div className="bg-white rounded-full shadow-md p-1">
                                                    <img
                                                        src={job.companyLogoUrl || busi}
                                                        alt={`${job.companyName} Logo`}
                                                        className="h-20 w-20 object-cover rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-3 max-w-lg w-full">
                                                {/* Work Mode Tag */}
                                                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                                                    {job.workMode}
                                                </span>

                                                {/* Job Title */}
                                                <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                                                    {job.jobRole}
                                                </h3>

                                                {/* Company Name */}
                                                <div className='flex justify-between mt-2'>
                                                    <div className='flex gap-1 items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                                                        </svg>

                                                        <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>
                                                    </div>

                                                    <div className='flex gap-1 items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                        </svg>

                                                        <p className="text-xs text-gray-700 mt-1">{job.experienceRequired}</p>
                                                    </div>
                                                </div>

                                                <div className='flex justify-between mt-2'>
                                                    <div className='flex gap-1 items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 mt-1">{job.ctc}</p>
                                                    </div>

                                                    <div className='flex gap-1 items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                        </svg>
                                                        <p className="text-xs text-gray-700 mt-1">{job.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Apply Button */}


                                            <hr className='mt-2' />
                                            <div className='flex justify-between items-center'>
                                                <div className="mt-1 px-2">
                                                    <button
                                                        onClick={() => handleView(job._id)}
                                                        className="flex text-xs gap-2 items-center justify-center px-4 py-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                                                    >
                                                        View details
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {profileIncomplete && (

                                                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">

                                                            <div className="bg-white p-6 rounded-md shadow-md">

                                                                <h2 className="text-lg font-semibold text-gray-900">

                                                                    Complete Your Profile

                                                                </h2>

                                                                <p className="mt-2 text-sm text-gray-600">

                                                                    Please fill in your profile details, including your mobile number

                                                                    and company information, before Applying for a job.

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
                                                </div>

                                                <div className='flex justify-end gap-1 mt-1 px-2 py-3'>
                                                    <button className='p-1 text-xs rounded-full bg-gray-200' onClick={() => handleShare(job._id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                                    </svg>

                                                    </button>
                                                    <button className="p-1 text-xs rounded-full bg-gray-200" onClick={() => handleReportClick(job._id)}>
                                                        <ExclamationTriangleIcon className="h-5 w-5 text-gray-700" />
                                                    </button>
                                                </div>
                                            </div>

                                            {showReportDialog && selectedJobId === job._id && (
                                                <ReportJob
                                                    jobId={selectedJobId}
                                                    isLoggedIn={isLoggedIn}
                                                    onReportSuccess={handleReportSuccess}
                                                    onCancel={() => setShowReportDialog(false)}
                                                />
                                            )}

                                        </motion.li>
                                    ))
                                    )}
                                </ul>
                            </>
                        )
                    ) : (
                        <p>No results found.</p>
                    )}

                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div >
    );
}
