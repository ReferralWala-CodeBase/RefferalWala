import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import person from "../assets/person.png";
import {
  UsersIcon,
  UserIcon,
  UserGroupIcon,
  HeartIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PhoneIcon,
  HomeIcon
} from "@heroicons/react/24/outline";

const navigation = [
  // { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  // { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
  { name: "Profile", href: "/viewprofile", icon: UserIcon, current: false },
  // { name: "Projects", href: "#", icon: FolderIcon, current: false },
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
    name: "Jobs Status",
    href: "/appliedjobs",
    initial: "S",
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
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarNa() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const bearerToken = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
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

    fetchProfileData();
  }, [Fronted_API_URL]);

  const handleSignOut = async () => {
    localStorage.clear();

    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        console.log("Cache cleared successfully.");
      } catch (error) {
        console.error("Error clearing cache:", error);
      }
    }
    navigate("/user-login");
  };

  return (
    <>
      <Disclosure>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 mt-16 custom-scrollbar">
            {/* <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
            </div> */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-8">
                <li>
                  <div className="text-xs pt-3 font-semibold leading-6 text-gray-400">
                    Overview
                  </div>
                  <ul role="list" className="-mx-2 space-y-1 ">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Posts
                  </div>
                  <ul role="list" className="-mx-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <Link
                          to={team.href}
                          className={classNames(
                            team.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <span
                            className={classNames(
                              team.current
                                ? "text-indigo-600 border-indigo-600"
                                : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    General
                  </div>
                  <ul role="list" className="-mx-2 space-y-1 ">
                    {sidenavigationlogout.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <Disclosure.Button
                  as="button"
                  onClick={handleSignOut}
                  className="inline-flex mb-4 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoggedIn? "Sign Out" : "Sign In"}
                </Disclosure.Button>
              </ul>
            </nav>
          </div>
        </div>

        {/* <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div> */}
      </Disclosure>
    </>
  );
}
