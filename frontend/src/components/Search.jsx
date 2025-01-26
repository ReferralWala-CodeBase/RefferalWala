import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { UserMinusIcon, UserPlusIcon, BellIcon } from "@heroicons/react/24/solid";
import { FaBuilding, FaFilter, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";


export default function Search() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTableView, setIsTableView] = useState(false);
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const toggleView = () => setIsTableView((prev) => !prev);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const Fronted_API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [ShowJobData, setShowJobData] = useState(false);

    useEffect(() => {
        if (location.state?.jobData) {
            setData(location.state.jobData);
            setShowJobData(true);
        } else if (location.state?.userData) {
            setData(location.state.userData);
        }
    }, [location.state]);

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

    // Handle unfollow request
    const handleUnfollow = async (targetUserId) => {
        if (!userId) return;

        try {
            const response = await fetch(
                `${Fronted_API_URL}/user/unfollow/${targetUserId}`,
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
                setFollowingList((prevList) => prevList.filter(user => user._id !== targetUserId)); // Remove the unfollowed user from the list
                toast.success("Unfollowed Successfully.");
            } else {
                console.error("Unfollow request failed");
                const errorData = await response.json();
                if (response.status === 401) {
                    // Unauthorized, remove the token and navigate to login
                    localStorage.removeItem('token');
                    navigate('/user-login');
                } else {
                    throw new Error(errorData.message || response.statusText);
                }
            }
        } catch (error) {
            console.error("Error unfollowing the user:", error);
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
            return await response.json(); // Return the fetched data directly
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

    return (
        <div>
            <Navbar className="sticky top-0 z-50" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <h1>Search Results</h1>
            {location.state?.jobData && (
                // Toggle Switch - Visible only when jobData is present
                <div className="flex justify-between items-end py-5 mx-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isTableView}
                            onChange={toggleView}
                            className="sr-only peer"
                        />
                        <div className="relative w-12 h-6 bg-gray-400 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full transition-colors duration-300 peer-checked:bg-blue-600">
                            <motion.span
                                className="absolute top-[1.5px] left-[1.5px] h-5 w-5 bg-white border border-gray-300 dark:border-gray-600 rounded-full shadow-md"
                                initial={{ x: 0 }}
                                animate={{ x: isTableView ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </label>
                </div>
            )}

            {data ? (
                // If ShowJobData is false, show user data
                !ShowJobData ? (
                    <ul>
                        {data.map((user, index) => (
                            <li key={index}>
                                {user.firstName || "No First Name"} {user.lastName || "No Last Name"} - {user.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        {/* If ShowJobData is true, show job data */}
                        {isTableView ? (
                            // Table View for Job Data
                            <div className="overflow-x-auto px-4">
                                <table className="min-w-full bg-white shadow-lg rounded-lg">
                                    <thead className="bg-indigo-600 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Company Name</th>
                                            <th className="py-3 px-4 text-left">Job Role</th>
                                            <th className="py-3 px-4 text-left">Location</th>
                                            <th className="py-3 px-4 text-left">Work Mode</th>
                                            <th className="py-3 px-4 text-left">Last Date to Apply</th>
                                            <th className="py-3 px-4 text-left">Posted By</th>
                                            <th className="py-3 px-4 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((job) => (
                                            <tr key={job._id} className="hover:bg-gray-100">
                                                <td className="py-3 px-4">{job.companyName}</td>
                                                <td className="py-3 px-4">{job.jobRole}</td>
                                                <td className="py-3 px-4">{job.location}</td>
                                                <td className="py-3 px-4">{job.workMode}</td>
                                                <td className="py-3 px-4">{getDate(job.endDate)}</td>
                                                <td className="py-3 px-4">
                                                    <span>{job.user?.firstName || "anonymous"}</span>
                                                    {followingList.some((user) => user._id === job.user._id) ? (
                                                        <UserMinusIcon
                                                            onClick={() => handleUnfollow(job.user._id)}
                                                            className="cursor-pointer text-red-500 w-6 h-6"
                                                            title="Unfollow"
                                                        />
                                                    ) : (
                                                        <UserPlusIcon
                                                            onClick={() => handleFollow(job.user._id)}
                                                            className="cursor-pointer text-blue-500 w-6 h-6"
                                                            title="Follow"
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleView(job._id)}
                                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                                    >
                                                        Apply
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Card View for Job Data
                            <ul role="list" className="grid grid-cols-1 gap-x-3 gap-y-8 lg:grid-cols-2 xl:gap-x-3 px-4">
                                {data.filter((item) => !item.firstName).map((job) => (
                                    <li key={job._id} className="bg-white p-4 rounded-lg shadow-lg">
                                        <h3 className="font-semibold">{job.companyName}</h3>
                                        <p>{job.jobRole}</p>
                                        <p>{job.location}</p>
                                        <p>{job.workMode}</p>
                                        <p>{getDate(job.endDate)}</p>
                                        <p>
                                            <span>{job.user?.firstName || "anonymous"}</span>
                                            {followingList.some((user) => user._id === job.user._id) ? (
                                                <UserMinusIcon
                                                    onClick={() => handleUnfollow(job.user._id)}
                                                    className="cursor-pointer text-red-500 w-6 h-6"
                                                    title="Unfollow"
                                                />
                                            ) : (
                                                <UserPlusIcon
                                                    onClick={() => handleFollow(job.user._id)}
                                                    className="cursor-pointer text-blue-500 w-6 h-6"
                                                    title="Follow"
                                                />
                                            )}
                                        </p>
                                        <button
                                            onClick={() => handleView(job._id)}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                        >
                                            Apply
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )
            ) : (
                <p>No results found.</p>
            )}



        </div >
    );
}
