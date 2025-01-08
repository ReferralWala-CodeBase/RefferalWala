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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata",
    // Add all 100 locations here
  ];
  const companies = [
    "LSEG", "Boeing", "Synchron", "Google", "Cognizant", "Microsoft", "Meta",
    // Add all 100 locations here
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
        // Filter only active jobs
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
  }, []);
  
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
      toast.error(error.message);
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
          {/* <button
            onClick={toggleFilterVisibility}
            className="md:hidden mb-4 px-4 py-1 text-xs bg-blue-500 text-white rounded"
          >
            {filterVisible ? "Hide Filters" : "Show Filters"}
          </button> */}

          {/* <div className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow ${filterVisible ? "block" : "hidden"
            } md:block`}>
            <h3 className="text-xl font-semibold mb-4">Filter by Location</h3>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            />
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {locations
                .filter((loc) =>
                  loc.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((loc) => (
                  <li
                    key={loc}
                    onClick={() => handleLocationSelect(loc)}
                    className={`px-4 py-2 cursor-pointer rounded ${selectedLocations.includes(loc)
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {loc}
                  </li>
                ))}
            </ul>
            <div className="mt-4">
              {selectedLocations.map((loc) => (
                <span
                  key={loc}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2"
                >
                  {loc}{" "}
                  <button
                    onClick={() => handleLocationRemove(loc)}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Filter by Company</h3>
            <input
              type="text"
              placeholder="Search companies..."
              value={companySearchTerm}
              onChange={(e) => setCompanySearchTerm(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
            />
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {companies
                .filter((comp) =>
                  comp.toLowerCase().includes(companySearchTerm.toLowerCase())
                )
                .map((comp) => (
                  <li
                    key={comp}
                    onClick={() => handleCompanySelect(comp)}
                    className={`px-4 py-2 cursor-pointer rounded ${selectedCompanies.includes(comp)
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {comp}
                  </li>
                ))}
            </ul>
            <div className="mt-4">
              {selectedCompanies.map((comp) => (
                <span
                  key={comp}
                  className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2"
                >
                  {comp}{" "}
                  <button
                    onClick={() => handleCompanyRemove(comp)}
                    className="ml-1 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div> */}

          {/* Job Cards Section */}
          <ul role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-4 xl:gap-x-8">
            {loading ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin text-xl" />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              Object.entries(filteredJobs).map(([id, job]) => (
                <li key={job._id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md h-80 flex flex-col justify-between">
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <img
                      src='data:image/png;base64,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'
                      alt="img"
                      className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                    />
                    <div className="text-sm font-medium leading-6 text-gray-900">{job.companyName}</div>
                    <button
                      onClick={() => handleView(job._id)}

                      className=" relative ml-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Apply
                    </button>
                  </div>
                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-500">Job Role</dt>
                      <dd className="text-gray-700">{job.jobRole}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-500">Location</dt>
                      <dd className="text-gray-700">{job.location}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-500">Work Mode</dt>
                      <dd className="text-gray-700">{job.workMode}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-500">Last Date to apply </dt>
                      <dd className="text-gray-700">{getDate(job.endDate)}</dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">

                      <dt className="text-gray-500">Posted by</dt>
                      <dd className="text-gray-700 flex items-center space-x-2">
                        {/* <span>{job.user.firstName || "anonymous"}</span> */}
                        <span>{job.user?.firstName || "anonymous"}</span>

                        {/* Directly compare if the job user is in the following list */}
                        {followingList.some(user => user._id === job.user._id) ? (
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
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

