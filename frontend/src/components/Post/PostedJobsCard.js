import { useEffect, useRef, useState } from 'react';
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import Navbar from '../Navbar';
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReportJob from './ReportJob';
import React from 'react';
import JobPostModal from './JobPostModal';
import { LocationExport } from '../Location';
import Loader from '../Loader';
import SmallScreenNav from './SmallScreenNav';
import CtcRangeSlider from './CtcRangerSlider';
import no_data_img from "../../assets/no_data_img.jpg";
import noSignal from "../../assets/noSignal.jpg";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PostedJobsCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedCtc, setSelectedCtc] = useState("");
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
  const [wishlistJobs, setWishlistJobs] = useState([]);
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const bearerToken = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const Logo_Dev_Secret_key = process.env.REACT_APP_LOGO_DEV_SECRET_KEY; // Logo dev secret key
  const navigate = useNavigate();
  const [companySuggestions, setCompanySuggestions] = useState([]);




  const [isLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const [isLocationDropdownVisible, setLocationDropdownVisible] = useState(false);
  const [isCompanyDropdownVisible, setCompanyDropdownVisible] = useState(false);


  const [selectedExperience, setSelectedExperience] = useState("");

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state?.searchQuery]);

  const handleCtcFilterChange = (value) => {
    setSelectedCtc(value);
  };

  const handleCtcFilter = (jobCtc, selectedCtc) => {
    if (!selectedCtc) return true; // No filter applied, return all jobs

    return jobCtc === selectedCtc; // Direct match
  };

  const handleLocationFilter = (jobLocation, selectedLocations) => {
    // If no location is selected, return true (no filtering)
    if (!selectedLocations || selectedLocations.length === 0) return true;

    // Lowercase the job location for case-insensitive comparison
    const lowerJobLocation = jobLocation.toLowerCase();

    // Check if the job's location contains any selected city's or state's name
    return selectedLocations.some(loc => {
      return lowerJobLocation.includes(loc.city.toLowerCase()) ||
        lowerJobLocation.includes(loc.state.toLowerCase());
    });
  };

  const handleExperienceChange = (value) => {
    setSelectedExperience(value);
  };


  const handleExperienceFilter = (jobExperience, selectedExperience) => {
    // No filter applied: return true for all jobs
    if (!selectedExperience) return true;

    // Map the selected experience range to numeric boundaries.
    // Adjust the boundaries based on your requirements.
    const experienceRangeMapping = {
      "0-1 year": [0, 1],
      "2-5 years": [2, 5],
      "6-10 years": [6, 10],
      "10+ years": [10, Infinity]
    };

    // Retrieve the min and max for the selected range.
    const [minExp, maxExp] = experienceRangeMapping[selectedExperience] || [0, Infinity];

    // Convert jobExperience to a number.
    // If job.experienceRequired is stored as "3" or "3 yrs", parseFloat works correctly.
    const numericExp = parseFloat(jobExperience);

    // Return true if the job's experience is within the inclusive range.
    return numericExp >= minExp && numericExp <= maxExp;
  };


  const fetchCompanies = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setCompanySuggestions([]); // Clear suggestions when input is less than 2 characters
      return;
    }

    try {
      const response = await fetch(
        `https://api.logo.dev/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${Logo_Dev_Secret_key}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch company suggestions");

      const data = await response.json();
      setCompanySuggestions(data.length > 0 ? data : []);
    } catch (error) {
      console.error(error);
      setCompanySuggestions([]);
    }
  };

  // Handle input change and fetch API
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCompanySearchTerm(value);
    fetchCompanies(value); // Fetch companies on every keystroke
    setCompanyDropdownVisible(true);
  };

  // Handle company selection
  const handleCompanySelect = (comp) => {
    if (!selectedCompanies.includes(comp.name)) {
      setSelectedCompanies([...selectedCompanies, comp.name]);
    }
    setCompanySearchTerm(""); // Clear input after selection
    setCompanyDropdownVisible(false); // Hide dropdown
  };


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
        // const activeJobs = data.filter((job) => job.status === 'active');
        // setJobs(activeJobs);
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [Fronted_API_URL]);

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
  }, [Fronted_API_URL, bearerToken, userId]);

  //wishlist functions--
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
          // toast.error("Failed to fetch wishlist jobs.");
        }
      } catch (error) {
        console.error("Error fetching wishlist jobs:", error);
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
        toast.warning("Removed from wishlist!");
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
        setFollowingList((prevList) => prevList.filter(user => user._id !== targetUserId));
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

  // const handleView = async (jobId) => {
  //   if (localStorage.getItem('token') === null) {
  //     navigate('/user-login');
  //   } else {
  //     try {
  //       const profile = await fetchProfileData();
  //       if (
  //         profile.firstName == null ||
  //         profile.lastName == null ||
  //         profile.mobileNumber == null ||
  //         profile.education?.length === 0 ||
  //         profile.skills?.length === 0 ||
  //         !profile.resume ||
  //         !profile.aboutMe
  //       ) {
  //         setProfileIncomplete(true);
  //       } else {
  //         setProfileIncomplete(false);
  //         navigate(`/appliedjobdetails/${jobId}`)
  //       }
  //     } catch (error) {
  //       console.error('Error in handleView:', error);
  //     }
  //   }
  // };

  const handleView = (jobId) => {
    navigate(`/appliedjobdetails/${jobId}`);
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



  const isLoggedIn = !!localStorage.getItem('token');

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


  // Function to handle sharing
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


  // Filter locations based on the search term
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationSelect = (loc) => {
    if (!selectedLocations.some((selected) => selected.city === loc.city)) {
      setSelectedLocations((prev) => [...prev, loc]);
    }

    setLocationDropdownOpen(false);
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

  // const handleCompanySelect = (company) => {
  //   if (!selectedCompanies.includes(company)) {
  //     setSelectedCompanies([...selectedCompanies, company]);
  //   }

  //   setCompanyDropdownOpen(false);
  // };

  const handleCompanyRemove = (company) => {
    setSelectedCompanies(selectedCompanies.filter(item => item !== company));
  };


  const handleOutsideClick = (ref, callback) => {
    document.addEventListener("click", (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    });
  };

  const locationRef = useRef(null);
  const companyRef = useRef(null);

  handleOutsideClick(locationRef, () => setLocationDropdownOpen(false));
  handleOutsideClick(companyRef, () => setCompanyDropdownOpen(false));

  const filteredJobs = jobs && Object.fromEntries(
    Object.entries(jobs).filter(([id, job]) => {
      return (
        !job.hidden &&
        (
          job?.companyName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          job?.jobRole?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          job?.location?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          job?.workMode?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        ) &&
        handleLocationFilter(job.location, selectedLocations) &&
        handleFilter(job.companyName.toString().toLowerCase(), selectedCompanies) &&
        handleCtcFilter(job.ctc, selectedCtc) &&
        handleExperienceFilter(job.experienceRequired, selectedExperience)
      );
    })
  );


  const [isTableView, setIsTableView] = useState(false);

  const toggleView = () => setIsTableView((prev) => !prev);

  const handleLocationFocus = () => setLocationDropdownVisible(true);
  const handleCompanyFocus = () => setCompanyDropdownVisible(true);
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setLocationDropdownVisible(false);
      setCompanyDropdownVisible(false);
    }
  };

  // Add this useEffect to handle clicks outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);



  // Notify parent about the selected locations
  // React.useEffect(() => {
  //   onFilterChange(selectedLocations);
  // }, [selectedLocations, onFilterChange]);

  return (
    <div className="min-h-screen bg-gray-100/70">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <SmallScreenNav />
      <div className="x-auto md:px-3 px-0 md:py-2 py-1">
        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-1 mx-auto max-w-full">

        <div className="w-full md:w-1/4 bg-white p-4 rounded-2xl shadow-lg border border-gray-300 md:block hidden">
            <div className="flex items-center gap-2 mb-4 justify-center">
              <h1 className="text-lg font-bold text-gray-900">Filters</h1>
            </div>

            {/* Location Filter */}
            <div className="mb-3 border pt-3 px-3 rounded-lg dropdown relative bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">📍 Locations</h2>
              <input
                type="text"
                placeholder="Search locations..."
                value={searchTerm}
                onFocus={() => (setCompanyDropdownVisible(false), setLocationDropdownVisible(true))}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
              />
              {isLocationDropdownVisible && (
                <ul className="absolute left-0 w-full space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-xs border border-gray-300 rounded-lg bg-white shadow-md z-10">
                  {LocationExport.filter((loc) =>
                    loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    loc.state.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((loc) => (
                    <li
                      key={loc.city}
                      onClick={() => handleLocationSelect(loc)}
                      className={`px-3 py-2 cursor-pointer rounded-md transition ${
                        selectedLocations.some((selected) => selected.city === loc.city)
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {loc.city}, {loc.state}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc.city}
                    className="inline-flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-xs gap-1 shadow-md"
                  >
                    {loc.city}, {loc.state}
                    <button
                      onClick={() => setSelectedLocations(selectedLocations.filter((item) => item.city !== loc.city))}
                      className="text-white hover:text-red-300 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Company Filter */}
            <div className="mb-3 border py-3 px-3 rounded-lg dropdown relative bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">🏢 Companies</h2>
              <input
                type="text"
                placeholder="Search companies..."
                value={companySearchTerm}
                onFocus={() => (setLocationDropdownVisible(false), setCompanyDropdownVisible(true))}
                onChange={handleInputChange}
                className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
              />
              {isCompanyDropdownVisible && companySearchTerm.length >= 2 && companySuggestions.length > 0 && (
                <ul className="absolute left-0 w-full space-y-1 max-h-40 overflow-y-auto custom-scrollbar text-xs border border-gray-300 rounded-lg bg-white shadow-md z-10">
                  {companySuggestions.map((comp) => (
                    <li
                      key={comp.name}
                      onClick={() => handleCompanySelect(comp)}
                      className={`px-3 py-2 cursor-pointer rounded-md transition ${
                        selectedCompanies.includes(comp.name)
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <img src={comp.logo_url} alt={comp.name} className="h-6 w-6 object-contain mr-2" />
                        {comp.name}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCompanies.map((comp) => (
                  <span
                    key={comp}
                    className="inline-flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-xs gap-1 shadow-md"
                  >
                    {comp}
                    <button
                      onClick={() => setSelectedCompanies(selectedCompanies.filter((item) => item !== comp))}
                      className="text-white hover:text-red-300 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div className="mb-3 border py-3 px-3 rounded-lg bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">📅 Experience</h2>
              <select
                value={selectedExperience}
                onChange={(e) => handleExperienceChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Experience</option>
                <option value="0-1 year">0-1 year</option>
                <option value="2-5 years">2-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>

            {/* CTC Filter */}
            <div className="mb-3 border py-3 px-3 rounded-lg bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">💰 CTC (in LPA)</h2>
              <select
                value={selectedCtc}
                onChange={(e) => handleCtcFilterChange(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Salary Range</option>
                <option value="3-5 LPA">3-5 LPA</option>
                <option value="5-8 LPA">5-8 LPA</option>
                <option value="8-12 LPA">8-12 LPA</option>
                <option value="12-15 LPA">12-15 LPA</option>
                <option value="15-20 LPA">15-20 LPA</option>
                <option value="20-25 LPA">20-25 LPA</option>
                <option value="25+ LPA">25+ LPA</option>
              </select>
            </div>
          </div>


          {/* Job Cards Section */}
          <div className='w-full max-w-6xl h-[90vh] overflow-y-auto'>
            {/* Toggle Switch */}
            {/* <div className="flex justify-between items-end py-5 mx-2">

              <button onClick={() => navigate('/postjob')} className='py-1 px-5 bg-orange-400 text-white text-md font-light rounded-lg'>Add Post</button>
            </div> */}

            {/* Conditional View Rendering */}
            <ul
              role="list"
              className="grid grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-3 xl:gap-x-3 px-4"
            >
              {loading ? (
                <Loader />
              ) : error ? (
                <p className="text-red-500 flex justify-center mx-auto">
                  <img
                    src={noSignal}
                    alt="Server Error"
                    className="mb-4 w-36"
                  />
                </p>
              ) : filteredJobs.length === 0 ? (
              <p className="text-red-500 flex justify-center mx-auto"> 
                <img
                src={no_data_img}
                alt="No data found"
                className="mb-4 w-36"
                /> 
              </p>
              ) : (
                Object.entries(filteredJobs).map(([id, job]) => (
                  <motion.li
                    key={job._id}
                    className="relative max-w-lg w-full rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
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
                      <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full inline-block mx-2 mb-2">
                        {job.employmentType}
                      </span>

                      {/* Job Title */}
                      <h3 onClick={() => handleView(job._id)} className="text-lg font-semibold text-blue-600 hover:underline">
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

                          <p className="text-xs text-gray-700 mt-1">{job.experienceRequired} yrs</p>
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


                      </div>

                      <div className='flex justify-end gap-1 mt-1 px-2 py-3'>
                        <button className='p-1 text-xs rounded-full bg-gray-200' onClick={() => handleShare(job._id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>

                        </button>
                        {/* <button className="p-1 text-xs rounded-full bg-gray-200" onClick={() => handleReportClick(job._id)}>
                          <ExclamationTriangleIcon className="h-5 w-5 text-gray-700" />
                        </button> */}
                      </div>
                    </div>

                    {/* {showReportDialog && selectedJobId === job._id && (
                      <ReportJob
                        jobId={selectedJobId}
                        isLoggedIn={isLoggedIn}
                        onReportSuccess={handleReportSuccess}
                        onCancel={() => setShowReportDialog(false)}
                      />
                    )} */}

                  </motion.li>
                ))
              )}
            </ul>
          </div>


        </div>
      </div>

      <JobPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Uncomment this */}
      {/* {showReportDialog && selectedJobId && (
        <ReportJob
          jobId={selectedJobId}
          isLoggedIn={isLoggedIn}
          onReportSuccess={handleReportSuccess}
          onCancel={() => setShowReportDialog(false)}
        />
      )} */}

      {profileIncomplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg z-50 max-w-xl w-full">
            <h2 className="text-lg font-semibold text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please fill in your profile details, including your mobile number and company information, before applying for a job.
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
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
    </div>
  );
}

