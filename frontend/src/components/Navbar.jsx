import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import profile from "../assets/profile-icon-user.png";
import {
  PhoneIcon, // Contact Us (Phone Representation)
  ShieldCheckIcon, // Privacy Policy (Security Representation)
  DocumentTextIcon, // Terms & Conditions (Document Representation)
  KeyIcon, // Login (Arrow entering a rectangle)
  IdentificationIcon, // Signup (User with a plus sign)
  ChartPieIcon,
  UsersIcon,
  UserIcon,
  UserGroupIcon,
  InformationCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { BriefcaseIcon } from "lucide-react";

const navigation = [
  { name: "Login", href: "/user-login", current: true },
  { name: "Sign up", href: "/signup", current: false },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-conditions" },
];

const userNavigation = [
  // { name: "Homepage", href: "/", icon: HomeIcon, current: false },
  // { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Profile", href: "/viewprofile", icon: UserIcon, current: false },
  // {
  //   name: "Followers",
  //   href: "/followerlist",
  //   icon: DocumentDuplicateIcon,
  //   current: false,
  // },
  // {
  //   name: "Following",
  //   href: "/followinglist",
  //   icon: ChartPieIcon,
  //   current: false,
  // },
  {
    name: "Post Job",
    href: "/postjob",
    icon: ChartPieIcon,
    current: false,
  },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-conditions" },
  { name: "Sign out", href: "#" },
];

const sidenavigation = [
  // { name: "Homepage", href: "/", icon: HomeIcon, current: false },
  // { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Profile", href: "/viewprofile", icon: UserIcon, current: false },
  {
    name: "Followers",
    href: "/followerlist",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Following",
    href: "/followinglist",
    icon: UserGroupIcon,
    current: false,
  },
];
const teams = [
  {
    id: 1,
    name: "Post New Job",
    href: "/postjob",
    initial: "P",
    current: false,
  },
  {
    id: 2,
    name: "View Posted Jobs",
    href: "/postedjobslist",
    initial: "V",
    current: false,
  },
  {
    id: 3,
    name: "Applied Jobs",
    href: "/appliedjobs",
    initial: "A",
    current: false,
  },
  {
    id: 4,
    name: "Wishlisted Jobs",
    href: "/wishlistjobslist",
    initial: "W",
    current: false,
  },
];

const sidenavigationlogout = [
  // { name: "Homepage", href: "/", icon: HomeIcon, current: false },
  { name: "About Us", icon: InformationCircleIcon, href: "/about-us" },
  { name: "Contact Us", icon: PhoneIcon, href: "/contact-us" },
  { name: "Privacy Policy", icon: ShieldCheckIcon, href: "/privacy-policy" },
  {
    name: "Terms & Conditions",
    icon: DocumentTextIcon,
    href: "/terms-conditions",
  },
  { name: "Login", icon: KeyIcon, href: "/user-login" },
  { name: "Sign up", icon: IdentificationIcon, href: "/signup" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ searchQuery, setSearchQuery }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [personQuery, setPersonQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const [profileData, setProfileData] = useState(null);
  const hamburger = loggedIn
    ? [...sidenavigationlogout, ...sidenavigation]
    : sidenavigationlogout;
  const bearerToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const filteredSidenavigationLogout = loggedIn
    ? sidenavigationlogout.filter(
        (item) => item.name !== "Login" && item.name !== "Sign up"
      )
    : sidenavigationlogout;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${Fronted_API_URL}/user/profile/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    if (userId && bearerToken) fetchProfileData(); // Ensure they exist before calling
  }, [userId, bearerToken]);

  useEffect(() => {
    if (openNotifications) {
      fetchNotifications();
    }
  }, [openNotifications]);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userId");
    const bearerToken = localStorage.getItem("token");
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${Fronted_API_URL}/user/notifications/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      // console.log("Fetched notifications:", data); // Log data to check the response
      setNotifications(data || []); // Ensure we set the notifications array correctly
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNotificationClick = (postId) => {
    // console.log("Navigating to post ID:", postId); // Log the postId for debugging
    // Navigate to the job details page based on the postId
    navigate(`/appliedjobdetails/${postId}`);
  };

  // const handleSearch = async (type) => {
  //   try {
  //     const response = await fetch(`${Fronted_API_URL}/user/search`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query: searchQuery || personQuery }), // Trim space from front and end
  //     });

  //     const data = await response.json(); // Parse the JSON response
  //     const jobResults = data?.jobResults || [];
  //     const userResults = data?.userResults || [];

  //     // Handle cases where both are empty
  //     if (jobResults.length === 0 && userResults.length === 0) {
  //       toast.error("No results found!");
  //       return;
  //     }

  //     // Navigate based on available results
  //     if (jobResults.length > 0) {
  //       if (type === "job") {
  //         navigate("/", { state: { jobData: jobResults, searchQuery } });
  //       }
  //     } else if (userResults.length > 0) {
  //       if (type === "person") {
  //         navigate("/search", { state: { userData: userResults } });
  //       }
  //     }

  //     setSearchResults([...jobResults, ...userResults]); // Optional: Store results if needed
  //   } catch (error) {
  //     console.error("Error searching:", error);
  //     toast.error("Something went wrong. Please try again.");
  //   }
  // };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${Fronted_API_URL}/user/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }), // Trim space from front and end
      });

      const data = await response.json(); // Parse the JSON response
      const jobResults = data?.jobResults || [];
      const userResults = data?.userResults || [];

      // Handle cases where both are empty
      if (jobResults.length === 0 && userResults.length === 0) {
        toast.error("No results found!");
        return;
      }

      // Navigate based on available results
      if (jobResults.length > 0) {
        navigate("/", { state: { jobData: jobResults, searchQuery } });
      } else if (userResults.length > 0) {
        navigate("/search", { state: { userData: userResults } });
      }

      setSearchResults([...jobResults, ...userResults]); // Optional: Store results if needed
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSignOut = async () => {
    localStorage.clear();

    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      } catch (error) {
        console.error("Error clearing cache:", error);
      }
    }

    setLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <Disclosure as="header" className="bg-blue-800 shadow sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
              <div className="relative flex h-16 justify-start md:justify-between">
                <div className="relative z-10 flex items-center lg:hidden">
                  <Disclosure.Button className="relative flex items-center justify-end w-full cursor-default rounded-md p-2 text-gray-400 focus:outline-none">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XMarkIcon
                        className="bg-blue-700 text-white rounded-full p-1 h-6 w-6 mb-4 cursor-pointer absolute left-52"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bars3Icon
                        className="block h-6 w-6 cursor-pointer"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="relative z-10 flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Link
                      to="/"
                      onClick={() => console.log("Navigating to Home!")}
                    >
                      <h1 className="font-bold tracking-wider text-sm lg:text-lg text-white">
                        ReferralWala
                      </h1>
                    </Link>
                  </div>
                </div>
                {/* <div className="hidden md:block">
                  <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                    <div className="w-full sm:max-w-lg flex items-center bg-gradient-to-r from-indigo-50 to-white shadow-md ring-1 ring-gray-300 rounded-full overflow-hidden">

                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 transition duration-300" aria-hidden="true" />
                        </div>
                        <input
                          id="search-jobs"
                          name="search-jobs"
                          className="block w-full bg-transparent border-none py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 focus:outline-none"
                          placeholder="Search Jobs"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch("job");
                            }
                          }}
                        />
                      </div>

                 
                      <div className="h-6 w-px bg-gray-300"></div>

                    
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 transition duration-300" aria-hidden="true" />
                        </div>
                        <input
                          id="search-people"
                          name="search-people"
                          className="block w-full bg-transparent border-none py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 focus:outline-none"
                          placeholder="Search People"
                          type="search"
                          value={personQuery}
                          onChange={(e) => setPersonQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch("person");
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                  <div className="w-full sm:max-w-sm">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-500 group-hover:text-indigo-500 transition duration-300"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full rounded-full border-0 bg-gradient-to-r from-indigo-50 to-white py-1 pl-10 pr-3 text-gray-900 shadow-md ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 transition-all duration-300 hover:ring-indigo-400 focus:shadow-lg"
                        placeholder="Search Jobs and People.."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                  <Link to={"/jobs"}>
                    <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded-full shadow hover:scale-105 hover:shadow-md transition-all duration-300 mr-2">
                      <BriefcaseIcon className="w-4 h-4" />
                      Jobs
                    </button>
                  </Link>

                  <div className="flex-shrink-0 mr-2">
                    <button
                      onClick={() => {
                        if (!bearerToken || !userId) {
                          toast.error(
                            <div>
                              <p>Please log in to post a job.</p>
                              <button
                                onClick={() => navigate("/user-login")}
                                type="button"
                                className="relative inline-flex items-center gap-x-2 rounded-full border border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 mr-2"
                              >
                                Log In
                              </button>
                            </div>
                          );
                          return; // Prevent further action if not logged in
                        }

                        // Navigate to the post job page if logged in
                        navigate("/postjob");
                      }}
                      type="button"
                      className="relative inline-flex items-center gap-x-2 rounded-full border border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 mr-2"
                    >
                      <PlusIcon
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      Post Job
                    </button>
                  </div>
                  {loggedIn ? (
                    <>
                      {/* 🔔 Notifications Button */}
                      <button
                        type="button"
                        onClick={() => setOpenNotifications(true)}
                        className="relative flex-shrink-0 rounded-full bg-gradient-to-r from-gray-100 to-gray-300 p-1.5 text-gray-500 shadow-md transition duration-300 hover:text-gray-700 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* 👤 Profile Button (Navigates to /viewprofile) */}
                      <Link
                        to="/viewprofile"
                        className="relative ml-4 flex rounded-full bg-gradient-to-r from-gray-100 to-gray-300 p-1 shadow-md transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
                      >
                        <img
                          className="h-8 w-8 rounded-full border-0 border-gray-800"
                          src={profileData?.profilePhoto || profile}
                          alt="User"
                        />
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* 👤 Guest Profile Button (Shows Dropdown) */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="sr-only">Open menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={profile}
                              alt="Guest"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {navigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Here the small screen*/}
            <Disclosure.Panel
              as="nav"
              className={classNames(
                "lg:hidden absolute top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300",
                open ? "translate-x-0" : "-translate-x-full"
              )}
              aria-label="Global"
            >
              <div className="flex h-full flex-col gap-y-5 overflow-y-auto px-4 pb-2">
                {/* Overview Section */}
                <nav className="flex-1 mt-9">
                  {loggedIn && (
                    <>
                      <div className="text-xs font-semibold leading-6 text-gray-400 ml-2">
                        Overview
                      </div>
                      <ul role="list" className="space-y-1">
                        {sidenavigation.map((item) => (
                          <li key={item.name}>
                            <Disclosure.Button
                              as={Link}
                              to={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                              )}
                            >
                              {item.icon && (
                                <item.icon
                                  className={classNames(
                                    item.current
                                      ? "text-indigo-600"
                                      : "text-gray-400 group-hover:text-indigo-600",
                                    "h-6 w-6"
                                  )}
                                  aria-hidden="true"
                                />
                              )}
                              {item.name}
                            </Disclosure.Button>
                          </li>
                        ))}
                        {/* Notifications */}
                        <li>
                          <Disclosure.Button
                            as={Link}
                            to="/notifications"
                            className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <BellIcon className="h-6 w-6 text-gray-400 group-hover:text-indigo-600" />
                            Notifications
                          </Disclosure.Button>
                        </li>
                      </ul>
                    </>
                  )}

                  {/* Posts Section (Only if logged in) */}
                  {loggedIn && teams.length > 0 && (
                    <>
                      <div className="text-xs font-semibold leading-6 text-gray-400 ml-2">
                        Posts
                      </div>
                      <ul role="list" className="mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <Disclosure.Button
                              as={Link}
                              to={team.href}
                              className={classNames(
                                team.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                              )}
                            >
                              <span
                                className={classNames(
                                  team.current
                                    ? "text-indigo-600 border-indigo-600"
                                    : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                  "flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-medium bg-white"
                                )}
                              >
                                {team.initial}
                              </span>
                              {team.name}
                            </Disclosure.Button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* General Section - Always Show sidenavigationlogout */}
                  <>
                    <div className="text-xs font-semibold leading-6 text-gray-400 ml-2 mt-5">
                      General
                    </div>
                    <ul role="list" className="space-y-1">
                      {filteredSidenavigationLogout.map((item) => (
                        <li key={item.name}>
                          <Disclosure.Button
                            as={Link}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                            )}
                          >
                            {item.icon && (
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "h-6 w-6"
                                )}
                                aria-hidden="true"
                              />
                            )}
                            {item.name}
                          </Disclosure.Button>
                        </li>
                      ))}
                    </ul>
                  </>
                </nav>

                {/* Sign Out Button (Only when logged in) */}
                {loggedIn && (
                  <Disclosure.Button
                    as="button"
                    onClick={handleSignOut}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign Out
                  </Disclosure.Button>
                )}
              </div>
            </Disclosure.Panel>

            {/* Notification Page */}
            <Transition.Root show={openNotifications} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50 "
                onClose={setOpenNotifications}
              >
                <div className="fixed inset-0 bg-gray-500 mt-16 bg-opacity-75 transition-opacity overflow-hidden" />
                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                          <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                            <div className="px-4 sm:px-6 flex justify-between items-center">
                              <Dialog.Title className="text-lg font-medium text-gray-900">
                                Notifications
                              </Dialog.Title>
                              <button
                                type="button"
                                className=" rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpenNotifications(false)}
                              >
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                              {notifications.length > 0 ? (
                                <ul className="mt-4 space-y-2">
                                  {notifications.map((notification, index) => (
                                    <li
                                      key={index}
                                      className="p-3 bg-gray-100 rounded-md shadow-md text-sm text-gray-700 cursor-pointer"
                                      onClick={() =>
                                        handleNotificationClick(
                                          notification.post._id
                                        )
                                      }
                                    >
                                      {notification.message ||
                                        "New Notification"}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="text-sm text-gray-500">
                                  No notifications available
                                </div>
                              )}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </>
        )}
      </Disclosure>

      {/* <div className="block md:hidden mt-2 mb-2 bg-transparent">
        <div className="relative z-0 flex flex-col sm:flex-row items-center justify-center px-2 sm:absolute sm:inset-0">
          <div className="w-full sm:max-w-lg flex items-center bg-gradient-to-r from-indigo-50 to-white shadow-md ring-1 ring-gray-300 rounded-full overflow-hidden">

        
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 transition duration-300" aria-hidden="true" />
              </div>
              <input
                id="search-jobs"
                name="search-jobs"
                className="block w-full bg-transparent border-none py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 focus:outline-none"
                placeholder="Search Jobs"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch("job");
                  }
                }}
              />
            </div>

       
            <div className="h-6 w-px bg-gray-300"></div>

         
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 transition duration-300" aria-hidden="true" />
              </div>
              <input
                id="search-people"
                name="search-people"
                className="block w-full bg-transparent border-none py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0 focus:outline-none"
                placeholder="Search People"
                type="search"
                value={personQuery}
                onChange={(e) => setPersonQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch("person");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
