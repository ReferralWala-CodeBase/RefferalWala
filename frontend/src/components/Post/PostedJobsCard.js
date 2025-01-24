import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { UserMinusIcon, UserPlusIcon, BellIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaFilter, FaMapMarkerAlt, FaSpinner,FaBookmark, FaRegBookmark ,FaShareAlt } from "react-icons/fa";
import postdata from "../../postdata.json"
import Navbar from '../Navbar';
import JobLocationFilter from './JobFilter';
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from 'react';
import JobPostModal from './JobPostModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PostedJobsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [wishlistJobs, setWishlistJobs] = useState([]);
  const bearerToken = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();


  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata",
  ];
  const companies = [
    "LSEG", "Boeing", "Synchron", "Google", "Cognizant", "Microsoft", "Meta",
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${Fronted_API_URL}/job/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        const activeJobs = data.filter((job) => job.status === 'active');
        setJobs(activeJobs);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
  const fetchWishlistJobs = async () => {
    try {
      const response = await fetch(`${Fronted_API_URL}/job/wishlist/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const wishlistJobIds = data.wishlist.map((job) => job._id);
        setWishlistJobs(wishlistJobIds); 
      } else {
        toast.error("Failed to fetch wishlist jobs.");
      }
    } catch (error) {
      console.error("Error fetching wishlist jobs:", error);
      toast.error("Failed to fetch wishlist jobs.");
    }
  };
  fetchWishlistJobs();
}, []);
  
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

  // Fetch the list of users the logged-in user is following
  useEffect(() => {
    const fetchFollowingList = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${Fronted_API_URL}/user/${userId}/following`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch following users');
        }
        const data = await response.json();
        setFollowingList(data.following || []); // Set the list of followed users

      } catch (error) {
        console.error("Error fetching following list:", error);
      }
    };

    fetchFollowingList();
  }, [bearerToken, userId]);
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
        toast.success("UnFollowed Successfully.");
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

  function handleFilter(keyWordTobeSearched, selectedItems) {
    if (selectedItems.length === 0)
      return true;
    let i = 0
    while (i < selectedItems.length) {
      if (keyWordTobeSearched === selectedItems[i].toString().toLowerCase())
        return true;
      i++
    }
    return false;
  }



  // Filter locations based on the search term
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationSelect = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleLocationRemove = (location) => {
    setSelectedLocations(selectedLocations.filter(item => item !== location));
  };


  //Filter company based on companySearchTerm

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  const handleCompanySearchChange = (e) => {
    setCompanySearchTerm(e.target.value);
  };

  const handleCompanySelect = (company) => {
    if (!selectedCompanies.includes(company)) {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleCompanyRemove = (company) => {
    setSelectedCompanies(selectedCompanies.filter(item => item !== company));
  };

  const toggleFilterVisibility = () => setFilterVisible(!filterVisible);

  const filteredJobs = jobs && Object.fromEntries(
    Object.entries(jobs).filter(([id, job]) => {
      return !job.hidden && (
        job?.companyName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.jobRole?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.location?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.workMode?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) && handleFilter(job.location.toString().toLowerCase(), selectedLocations)
        && handleFilter(job.companyName.toString().toLowerCase(), selectedCompanies);
    })
  );

  const [isTableView, setIsTableView] = useState(false);

  const toggleView = () => setIsTableView((prev) => !prev);

  // Notify parent about the selected locations
  // React.useEffect(() => {
  //   onFilterChange(selectedLocations);
  // }, [selectedLocations, onFilterChange]);

  return (
    <div className="min-h-screen bg-gray-100/70">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto px-4 py-2">
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-1 mx-auto max-w-full">
          <button
            onClick={toggleFilterVisibility}
            className="md:hidden mb-4 px-4 py-1 text-xs bg-blue-500 text-white rounded"
          >
            {filterVisible ? "Hide Filters" : "Show Filters"}
          </button>

          <div
            className={`w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 ${filterVisible ? "block" : "hidden"
              } md:block`}
          >
            {/* Main Heading */}
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-500 text-lg" />
              <h1 className="text-md font-bold text-gray-800">You can Filter your Search</h1>
            </div>

            {/* Filter by Location */}
            <div className="mb-5 border py-5 px-2 rounded-lg">
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <FaMapMarkerAlt className="text-blue-500 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
              </div>
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-xs">
                {locations
                  .filter((loc) =>
                    loc.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((loc) => (
                    <li
                      key={loc}
                      onClick={() => handleLocationSelect(loc)}
                      className={`px-3 py-2 cursor-pointer rounded-lg transition ${selectedLocations.includes(loc)
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      {loc}
                    </li>
                  ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {loc}
                    <button
                      onClick={() => handleLocationRemove(loc)}
                      className="text-white hover:text-red-300 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Filter by Company */}
            <div className="mb-5 border py-5 px-2 rounded-lg">
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <FaBuilding className="text-blue-500 text-lg" />
                <h3 className="text-lg font-semibold text-gray-800">Company</h3>
              </div>
              <input
                type="text"
                placeholder="Search companies..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                className="w-full mb-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-xs">
                {companies
                  .filter((comp) =>
                    comp.toLowerCase().includes(companySearchTerm.toLowerCase())
                  )
                  .map((comp) => (
                    <li
                      key={comp}
                      onClick={() => handleCompanySelect(comp)}
                      className={`px-3 py-2 cursor-pointer rounded-lg transition ${selectedCompanies.includes(comp)
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      {comp}
                    </li>
                  ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCompanies.map((comp) => (
                  <span
                    key={comp}
                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {comp}
                    <button
                      onClick={() => handleCompanyRemove(comp)}
                      className="text-white hover:text-red-300 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Job Cards Section */}
          <div className='w-full max-w-4xl'>
            {/* Toggle Switch */}
            <div className="flex justify-between items-end py-5 mx-2">

              <button onClick={() => setIsModalOpen(true)} className='py-1 px-5 bg-orange-400 text-white text-md font-light rounded-lg'>Add Post</button>
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

            {/* Conditional View Rendering */}
            {isTableView ? (
              // Table View
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
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <FaSpinner className="animate-spin text-xl" />
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-red-500">{error}</td>
                      </tr>
                    ) : (
                      Object.entries(filteredJobs).map(([id, job]) => (
                        <tr key={job._id} className="hover:bg-gray-100">
                          <td className="py-3 px-4">{job.companyName}</td>
                          <td className="py-3 px-4">{job.jobRole}</td>
                          <td className="py-3 px-4">{job.location}</td>
                          <td className="py-3 px-4">{job.workMode}</td>
                          <td className="py-3 px-4">{getDate(job.endDate)}</td>
                          <td className="py-3 px-4">
                            <span>{job.user.firstName || "anonymous"}</span>
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
                          <td className="py-3 px-4">
  {wishlistJobs.includes(job._id) ? (
    <FaBookmark
      onClick={() => handleRemoveFromWishlist(job._id)}
      className="cursor-pointer text-yellow-500 w-6 h-6"
      title="Remove from Wishlist"
    />
  ) : (
    <FaRegBookmark
      onClick={() => handleAddToWishlist(job._id)}
      className="cursor-pointer text-gray-500 w-6 h-6 hover:text-yellow-500 transition"
      title="Add to Wishlist"
    />
  )}
</td>
<td className="py-3 px-4">
<FaShareAlt
     // onClick={() => handleShare(job._id)}  // Add your share function here
     className="cursor-pointer text-gray-500 w-6 h-6 ml-1 hover:text-indigo-500 transition"
     title="Share"
      />
</td>


                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Card View
              <ul
                role="list"
                className="grid grid-cols-1 gap-x-2 gap-y-8 lg:grid-cols-3 xl:gap-x-3 px-4"
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-xl" />
                  </div>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  Object.entries(filteredJobs).map(([id, job]) => (
                    <motion.li
                      key={job._id}
                      className="relative max-w-lg w-full rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Top Section */}
                      <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-200"></div>
                      <div className="absolute mt-8 top-2 right-2">
                        <div className="bg-white rounded-full shadow-md p-1">
                          <img
                            src={job.companyLogoUrl}
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
                        <p className="text-sm text-gray-500 mt-1">{job.companyName}</p>
                      </div>

                      {/* Apply Button */}



                      <div className="mt-1 px-2">
                        <button
                          onClick={() => handleView(job._id)}
                          className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                        >
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        {wishlistJobs.includes(job._id) ? (
    <FaBookmark
      onClick={() => handleRemoveFromWishlist(job._id)}
      className="cursor-pointer text-yellow-500 w-6 h-6 ml-1"
      title="Remove from Wishlist"
    />
  ) : (
    <FaRegBookmark
      onClick={() => handleAddToWishlist(job._id)}
      className="cursor-pointer text-gray-500 w-6 h-6 ml-1 hover:text-yellow-500 transition"
      title="Add to Wishlist"
    />
  )}
    <FaShareAlt
     // onClick={() => handleShare(job._id)}  // Add your share function here
     className="cursor-pointer text-gray-500 w-6 h-6 ml-1 hover:text-indigo-500 transition"
     title="Share"
      />
                      </motion.div>
                      <dl className="px-6 py-4 text-sm leading-6">
                        <div className="flex justify-between gap-x-4 py-2">
                          <dt className="text-gray-500">Job Role</dt>
                          <dd className="text-gray-700 group-hover:text-indigo-600">{job.jobRole}</dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-2">
                          <dt className="text-gray-500">Location</dt>
                          <dd className="text-gray-700 group-hover:text-indigo-600">{job.location}</dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-2">
                          <dt className="text-gray-500">Work Mode</dt>
                          <dd className="text-gray-700 group-hover:text-indigo-600">{job.workMode}</dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-2">
                          <dt className="text-gray-500">Last Date to Apply</dt>
                          <dd className="text-gray-700 group-hover:text-indigo-600">{getDate(job.endDate)}</dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-2">
                          <dt className="text-gray-500">Posted by</dt>
                          <dd className="text-gray-700 flex items-center space-x-2">
                            <span className="group-hover:text-indigo-600">{job.user.firstName || "anonymous"}</span>
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
                          </dd>
                        </div>
=======
                      </div>
>>>>>>> Stashed changes

                      <hr className='mt-2' />

<<<<<<< Updated upstream
                        <div className='flex justify-between mt-3'>
                          
                          <button className='py-1 px-2 text-xs rounded-full bg-gray-200'>Report</button>
                        </div>
                      </dl>
=======
=======
                      </div>

                      <hr className='mt-2' />

>>>>>>> Stashed changes
                      <div className='flex justify-between mt-1 px-2 py-3'>
                        <button className='py-1 px-2 text-xs rounded-full bg-gray-200'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                        </button>
                        <button className='py-1 px-2 text-xs rounded-full bg-gray-200'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        </button>
                      </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    </motion.li>
                  ))
                )}
              </ul>

            )}
          </div>

          {/* Right Side  */}
          <div className="hidden lg:block w-1/5 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div>
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recruiter List</h3>
              </div>

              <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-sm">
                <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <span className="text-gray-700">John Doe</span>
                  <span className="text-gray-500 text-xs">HR Manager</span>
                </li>
                <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <span className="text-gray-700">Jane Smith</span>
                  <span className="text-gray-500 text-xs">Recruiter</span>
                </li>
                <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <span className="text-gray-700">Michael Brown</span>
                  <span className="text-gray-500 text-xs">Talent Acquisition</span>
                </li>
                <li className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
                  <span className="text-gray-700">Emily Davis</span>
                  <span className="text-gray-500 text-xs">Senior Recruiter</span>
                </li>
              </ul>

            </div>

            {/* Company List Section */}
            <div className="mt-6">
              <div className="flex items-center gap-2 border-b pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Company List</h3>
              </div>
              <ul className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar text-sm">
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">TechCorp Solutions</span>
                  <span className="text-gray-500 text-xs">IT</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">Innovatech Ltd.</span>
                  <span className="text-gray-500 text-xs">Software</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">BrightFuture Inc.</span>
                  <span className="text-gray-500 text-xs">Education</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">Green Energy Co.</span>
                  <span className="text-gray-500 text-xs">Energy</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">HealthPlus Services</span>
                  <span className="text-gray-500 text-xs">Healthcare</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">SmartBuild Group</span>
                  <span className="text-gray-500 text-xs">Construction</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">Alpha Retail</span>
                  <span className="text-gray-500 text-xs">Retail</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">NextGen Logistics</span>
                  <span className="text-gray-500 text-xs">Logistics</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">CreativeDesign Studio</span>
                  <span className="text-gray-500 text-xs">Design</span>
                </li>
                <li className="p-2 hover:bg-gray-100 rounded flex justify-between">
                  <span className="text-gray-700">BlueOcean Tech</span>
                  <span className="text-gray-500 text-xs">Technology</span>
                </li>
              </ul>
            </div>
          </div>



        </div>
      </div>

      <JobPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

