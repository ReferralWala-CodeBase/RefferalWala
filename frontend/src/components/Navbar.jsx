// /* eslint-disable no-unused-vars */
// import { useState, useEffect, Fragment } from "react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";
// import profile from "../assets/profile-icon-user.png";

// const navigation = [
//   { name: "Login", href: "/user-login", current: true },
//   { name: "About Us", href: "/about-us" },
//   { name: "Contact Us", href: "/contact-us" },
//   { name: "Privacy Policy", href: "/privacy-policy" },
//   { name: "Terms & Conditions", href: "/terms-conditions" },
// ];

// const userNavigation = [
//   // display the email here
//   // {email here }
//   { name: "Your Profile", href: "/profile-user" },
//   { name: "Settings", href: "/settings" },
//   { name: "Sign out", href: "/logout" },
// ];

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Navbar() {
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       setLoggedIn(true);
//     }
//   }, []);

//   return (
//     <Disclosure as="header" className="bg-white shadow">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
//             <div className="relative flex h-16 justify-between">
//               <div className="relative z-10 flex px-2 lg:px-0">
//                 <div className="flex flex-shrink-0 items-center">
//                   <h1 className="font-bold tracking-[2px] text-sm text-blue-600">
//                     Referral Wala
//                   </h1>
//                 </div>
//               </div>
//               <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
//                 <div className="w-full sm:max-w-xs">
//                   <label htmlFor="search" className="sr-only">
//                     Search
//                   </label>
//                   <div className="relative">
//                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                       <MagnifyingGlassIcon
//                         className="h-5 w-5 text-gray-400"
//                         aria-hidden="true"
//                       />
//                     </div>
//                     <input
//                       id="search"
//                       name="search"
//                       className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                       placeholder="Search"
//                       type="search"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="relative z-10 flex items-center lg:hidden">
//                 <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
//                   <span className="absolute -inset-0.5" />
//                   <span className="sr-only">Open menu</span>
//                   {open ? (
//                     <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </Disclosure.Button>
//               </div>
//               <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
//                 {loggedIn ? (
//                   <>
//                     <button
//                       type="button"
//                       className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                       <span className="absolute -inset-1.5" />
//                       <span className="sr-only">View notifications</span>
//                       <BellIcon className="h-6 w-6" aria-hidden="true" />
//                     </button>

//                     <Menu as="div" className="relative ml-4 flex-shrink-0">
//                       <div>
//                         <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//                           <span className="absolute -inset-1.5" />
//                           <span className="sr-only">Open user menu</span>
//                           <img
//                             className="h-8 w-8 rounded-full"
//                             src={profile}
//                             alt="User"
//                           />
//                         </Menu.Button>
//                       </div>
//                       <Transition
//                         as={Fragment}
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                           {userNavigation.map((item) => (
//                             <Menu.Item key={item.name}>
//                               {({ active }) => (
//                                 <Link
//                                   to={item.href}
//                                   className={classNames(
//                                     active ? "bg-gray-100" : "",
//                                     "block px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   {item.name}
//                                 </Link>
//                               )}
//                             </Menu.Item>
//                           ))}
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   </>
//                 ) : (
//                   <>
//                     <Menu as="div" className="relative ml-4 flex-shrink-0">
//                       <div>
//                         <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
//                           <span className="absolute -inset-1.5" />
//                           <span className="sr-only">Open menu</span>
//                           <img
//                             className="h-8 w-8 rounded-full"
//                             src={profile}
//                             alt="Guest"
//                           />
//                         </Menu.Button>
//                       </div>
//                       <Transition
//                         as={Fragment}
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                           {navigation.map((item) => (
//                             <Menu.Item key={item.name}>
//                               {({ active }) => (
//                                 <Link
//                                   to={item.href}
//                                   className={classNames(
//                                     active ? "bg-gray-100" : "",
//                                     "block px-4 py-2 text-sm text-gray-700"
//                                   )}
//                                 >
//                                   {item.name}
//                                 </Link>
//                               )}
//                             </Menu.Item>
//                           ))}
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
//             <div className="space-y-1 px-2 pb-3 pt-2">
//               {loggedIn
//                 ? userNavigation.map((item) => (
//                     <Disclosure.Button
//                       key={item.name}
//                       as="a"
//                       href={item.href}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
//                     >
//                       {item.name}
//                     </Disclosure.Button>
//                   ))
//                 : navigation.map((item) => (
//                     <Disclosure.Button
//                       key={item.name}
//                       as="a"
//                       href={item.href}
//                       className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
//                     >
//                       {item.name}
//                     </Disclosure.Button>
//                   ))}
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }

/* eslint-disable no-unused-vars */
import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import profile from "../assets/profile-icon-user.png";
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: "Login", href: "/user-login", current: true },
  { name: "Sign up", href: "/signup", current: false },
  // { name: "About Us", href: "/about-us" },
  // { name: "Contact Us", href: "/contact-us" },
  // { name: "Privacy Policy", href: "/privacy-policy" },
  // { name: "Terms & Conditions", href: "/terms-conditions" },
];

const userNavigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Profile", href: "/viewprofile", icon: UsersIcon, current: false },
  { name: "Homepage", href: "/", icon: CalendarIcon, current: false },
  { name: "Followers", href: "/followerlist", icon: DocumentDuplicateIcon, current: false },
  { name: "Following", href: "/followinglist", icon: ChartPieIcon, current: false },
  { name: "Sign out", href: "#" },
];

const sidenavigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Profile", href: "/viewprofile", icon: UsersIcon, current: false },
  { name: "Homepage", href: "/", icon: CalendarIcon, current: false },
  { name: "Followers", href: "/followerlist", icon: DocumentDuplicateIcon, current: false },
  { name: "Following", href: "/followinglist", icon: ChartPieIcon, current: false },
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
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ searchQuery, setSearchQuery }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem("token");

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

    setLoggedIn(false);
    navigate("/user-login");
  };

  return (
    <Disclosure as="header" className="bg-blue-800 shadow sticky top-0 z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <h1 className="font-bold tracking-[2px] text-sm text-blue-600">
                    ReferralWala
                  </h1>
                </div>
              </div>
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
                      placeholder="Search..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center lg:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                {loggedIn ? (
                  <>
                    <button
                      type="button"
                      className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <Link to="/notifications">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </Link>
                    </button>

                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={profile}
                            alt="User"
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
                          {userNavigation.map((item) =>
                            item.name === "Sign out" ? (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    onClick={handleSignOut}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ) : (
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
                            )
                          )}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
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
          { /* Here the small screen*/}
          <Disclosure.Panel
            as="nav"
            className={classNames(
              "lg:hidden absolute top-0 left-0 h-screen w-64 bg-white shadow-md transform transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full"
            )}
            aria-label="Global"
          >
            <div className="flex h-full flex-col gap-y-5 overflow-y-auto px-4 pb-2">

              {/* Navigation Items */}
              <nav className="flex-1 mt-16">
                <ul role="list" className="space-y-1 mb-5">
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
                        <item.icon
                          className={classNames(
                            item.current ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
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

                <div className="text-xs font-semibold leading-6 text-gray-400 ml-4">Your teams</div>
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
              </nav>

              {/* Sign Out */}
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

        </>
      )}
    </Disclosure>
  );
}
