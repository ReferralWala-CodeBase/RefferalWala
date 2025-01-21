import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { UserMinusIcon, UserPlusIcon, BellIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaFilter, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
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
      <div className="container mx-auto px-4 py-6">
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-6 mx-auto max-w-full">


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
            <div className='className="mb-5 border py-5 px-2 rounded-lg"'>
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
          <div>
            {/* Toggle Switch */}
            <div className="flex justify-between items-end py-5 mx-4">

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
                className="grid grid-cols-1 gap-x-3 gap-y-8 lg:grid-cols-2 xl:gap-x-3 px-4"
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
                      className="overflow-hidden rounded-xl bg-white shadow-xl shadow-gray-400 h-100 flex flex-col justify-between group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="flex items-center text-white gap-x-4 border-b border-gray-900/5 bg-gradient-to-r from-blue-500 to-gray-50 p-6 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <img
                          src={job.companyLogoUrl || 'data:image/png;base64,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'}
                          alt="img"
                          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                        />
                        <div className="text-sm font-medium leading-6">{job.companyName}</div>
                        <button
                          onClick={() => handleView(job._id)}
                          className="relative ml-auto inline-flex justify-center rounded-full bg-orange-500 py-2 px-4 text-sm font-light text-white shadow-sm hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform group-hover:scale-110"
                        >
                          Apply
                        </button>
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

                        <hr />

                        <div className='flex justify-between mt-3'>
                          <button className='py-1 px-2 text-xs rounded-full bg-gray-200'>Share</button>
                          <button className='py-1 px-2 text-xs rounded-full bg-gray-200'>Report</button>
                        </div>
                      </dl>
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

