import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { UserMinusIcon, UserPlusIcon, BellIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import postdata from "../../postdata.json"
import Navbar from '../Navbar';
import JobLocationFilter from './JobFilter';
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBuilding, FaFilter } from "react-icons/fa"

import React from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PostedJobsCard() {
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
  const bearerToken = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata",
  ];
  const companies = [
    "LSEG", "Boeing", "Synchron", "Google", "Cognizant", "Microsoft", "Meta",
  ];

  useEffect(() => {
    const fetchJobs = async () => {

      try {
        const response = await fetch('https://referralwala-deployment.vercel.app/job/all', {
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
    const fetchFollowingList = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`https://referralwala-deployment.vercel.app/user/${userId}/following`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch following users');
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
        `https://referralwala-deployment.vercel.app/user/follow/${targetUserId}`,
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
      } else {
        console.error("Follow request failed");
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
        `https://referralwala-deployment.vercel.app/user/unfollow/${targetUserId}`,
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
      } else {
        console.error("Unfollow request failed");
      }
    } catch (error) {
      console.error("Error unfollowing the user:", error);
    }
  };

  const navigate = useNavigate();
  const handleView = (jobId) => {
    if (localStorage.getItem('token') === null) {
      navigate('/user-login')
    }

    else {
      navigate(`/appliedjobdetails/${jobId}`);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto px-4 py-6">
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-6 mx-auto max-w-8xl">
          <button
            onClick={toggleFilterVisibility}
            className="md:hidden mb-4 px-4 py-1 text-xs bg-blue-500 text-white rounded"
          >
            {filterVisible ? "Hide Filters" : "Show Filters"}
          </button>

          <div
            className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-lg border border-gray-200 ${filterVisible ? "block" : "hidden"
              } md:block`}
          >
            {/* Main Heading */}
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-500 text-xl" />
              <h1 className="text-xl font-bold text-gray-800">You can Filter your Search</h1>
            </div>

            {/* Filter by Location */}
            <div className="mb-8">
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
              <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-sm">
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
            <div>
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
              <ul className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-sm">
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
            <div className="flex justify-end items-end py-5 mx-4">
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
                className="grid grid-cols-1 gap-x-3 gap-y-8 lg:grid-cols-3 xl:gap-x-4 px-4"
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
                        className="flex items-center text-white gap-x-4 border-b border-gray-900/5 bg-gradient-to-r from-black to-blue-500 p-6 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <img
                          alt="img"
                          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                        />
                        <div className="text-sm font-medium leading-6">{job.companyName}</div>
                        <button
                          onClick={() => handleView(job._id)}
                          className="relative ml-auto inline-flex justify-center rounded-full bg-white py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform group-hover:scale-110"
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
                      </dl>
                    </motion.li>
                  ))
                )}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

