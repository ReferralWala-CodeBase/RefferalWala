import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import JobCardCarousel from "./JobReferralsCard";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [showFull, setShowFull] = useState(false);
    const [active, setActive] = useState("left");

    const Fronted_API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${Fronted_API_URL}/rapidjob/all-rapid-jobs`);
                const data = await response.json();
                setJobs(data.data);
                setSelectedJob(data.data[0]);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);


    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const response = await fetch(`${Fronted_API_URL}/rapidinternship/all-rapid-internships`);
                const data = await response.json();
                setInternships(data.data);
                setSelectedInternship(data.data[0]);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchInternships();
    }, []);

    const filteredJobs = jobs.filter(
        (job) =>
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredInternships = internships.filter(
        (internship) =>
            internship.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentList = active === "left" ? filteredJobs : filteredInternships;
    const selectedItem = active === "left" ? selectedJob : selectedInternship;


    return (
        <section>
            <Navbar />
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen bg-gray-50 md:p-4 p-1 gap-2 overflow-hidden">

                <aside className="w-full lg:w-1/3 bg-white p-2 h-full flex flex-col">

                    {/* Search Bar */}
                    <div className="p-2 border-b bg-white sticky top-0 z-10">
                        <div className="relative mb-3 flex items-center">
                            <input
                                type="text"
                                placeholder={`Search for ${active === "left" ? "jobs" : "internships"}...`}
                                className="w-full p-2 pl-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>

                        {/* Toggle Buttons */}
                        <div className="flex items-center justify-center py-2 mb-2">
                            <div className="flex relative rounded-full overflow-hidden bg-gray-200 shadow-inner">
                                <button
                                    onClick={() => setActive("left")}
                                    className={`px-6 py-2 font-medium transition-all duration-300 
          ${active === "left"
                                            ? "bg-[#2563eb] text-white"
                                            : "bg-transparent text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Jobs (FTE)
                                </button>
                                <button
                                    onClick={() => setActive("right")}
                                    className={`px-6 py-2 font-medium transition-all duration-300 
          ${active === "right"
                                            ? "bg-[#2563eb] text-white"
                                            : "bg-transparent text-gray-700 hover:bg-gray-300"
                                        }`}
                                >
                                    Internships
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable List Section */}
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {currentList.length > 0 ? (
                            currentList.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        if (window.innerWidth < 726) {
                                            window.open(item.url, "_blank");
                                        } else {
                                            active === "left" ? setSelectedJob(item) : setSelectedInternship(item);
                                        }
                                    }}
                                    className={`p-2 border-2 transition ease-in-out rounded-md hover:border-blue-500 cursor-pointer ${selectedItem?.id === item.id ? "bg-white" : "bg-white"}`}
                                >
                                    {/* Item content here */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 p-2 bg-white">
                                            <img
                                                src={item.company?.logo || "https://via.placeholder.com/50"}
                                                alt={item.company?.name}
                                                className="w-8 h-8 object-cover rounded-full border border-gray-300"
                                            />
                                            <h2 className="text-lg font-semibold text-gray-800">{item?.title}</h2>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 items-center px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <p className="text-xs font-normal text-gray-500 mb-[3px]">
                                            {item?.location}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1 items-center px-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                            </svg>
                                            <p className="text-xs font-normal text-gray-500">{item.company?.name}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No {active === "left" ? "jobs" : "internships"} found.</p>
                        )}
                    </div>
                </aside>

                <main className="hidden lg:flex flex-1 h-full overflow-auto md:p-8 p-5 bg-gray-50 rounded-xl border">
                    {selectedItem && (
                        <div className="max-w-4xl w-full">
                            <header className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <img
                                            src={selectedItem.company?.logo || "https://via.placeholder.com/50"}
                                            alt={selectedItem?.title}
                                            className="w-16 h-16 object-cover rounded-full border border-gray-300"
                                        />

                                        <h1 className="text-4xl font-bold text-gray-900">{selectedItem?.title}</h1>
                                    </div>
                                    <div className="flex gap-2 items-center">

                                        <a
                                            href={selectedItem.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-light transition hover:bg-blue-700"
                                        >
                                            Apply Now
                                        </a>

                                    </div>

                                </div>

                                <p className="text-lg text-gray-600 mt-3">
                                    <span className="font-semibold"> 💻 {selectedItem?.company?.name}</span>
                                </p>
                                <p className="text-lg text-gray-600 mt-1"> 📍 {selectedItem?.location}</p>
                                <div className="flex gap-2 items-center mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>

                                    <p className="text-sm text-gray-500">
                                        Last updated: {selectedItem?.postDate && new Date(selectedItem.postDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>

                                </div>
                            </header>


                            {/* <footer className="mt-2 flex items-center gap-6 pt-2 pb-2">

                                <a
                                    href={`mailto:${selectedJob?.contactEmail}`}
                                    className="text-blue-600 text-lg font-medium underline hover:text-blue-800"
                                >
                                    Get Reffered
                                </a>
                            </footer> */}

                            <JobCardCarousel />

                        </div>
                    )}
                </main>


            </div>
        </section>
    );
};

export default Jobs;
