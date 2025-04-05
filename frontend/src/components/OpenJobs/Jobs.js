import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [showFull, setShowFull] = useState(false);
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
    
    const filteredJobs = jobs.filter(
        (job) =>
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    return (
        <section>
            <Navbar />
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen bg-gray-50 md:p-4 p-1 gap-2 overflow-hidden">

                <aside className="w-full lg:w-1/3 bg-white p-2 h-full overflow-auto">

                    <div className="relative mb-3 flex items-center">
                        <input
                            type="text"
                            placeholder="Search for jobs..."
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

                    <div className="space-y-1">
                        {filteredJobs.length > 0 ? (
                            filteredJobs?.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            navigate(`/job/${job.id}`);
                                        } else {
                                            setSelectedJob(job);
                                        }
                                    }}
                                    // selected and non selected design if needed to be updated
                                    className={`p-2 border-2 transition ease-in-out rounded-md hover:border-blue-500 cursor-pointer ${selectedJob?.id === job.id ? "bg-white" : "bg-white"
                                        }`}
                                >


                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 p-2 bg-white">
                                        <img
  src={job.company?.logo || "https://via.placeholder.com/50"}
  alt={job.company?.name}
  className="w-8 h-8 object-cover rounded-full border border-gray-300"
/>
<h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
   </div>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>

                                    </div>

                                    <div className="flex gap-1 items-center px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>

                                        <p className="text-xs font-normal text-gray-500  mb-[3px]">
                                            {job.location}
                                        </p>
                                    </div>



                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1 items-center px-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                            </svg>

                                            <p className="text-xs font-normal text-gray-500">{job.company?.name}</p>


                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No jobs found.</p>
                        )}
                    </div>
                </aside>

                <main className="hidden lg:flex flex-1 h-full overflow-auto md:p-8 p-5 bg-gray-50 rounded-xl border">
                    {selectedJob && (
                        <div className="max-w-4xl w-full">
                            <header className="border-b pb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                    <img
  src={selectedJob?.company?.logo || "https://via.placeholder.com/50"}
  alt={selectedJob?.title}
  className="w-16 h-16 object-cover rounded-full border border-gray-300"
/>

                                        <h1 className="text-4xl font-bold text-gray-900">{selectedJob?.title}</h1>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-8">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                        </svg>
                                        <a
                                            href={selectedJob?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-light transition hover:bg-blue-700"
                                        >
                                            Apply Now
                                        </a>

                                    </div>

                                </div>

                                <p className="text-lg text-gray-600 mt-1">
                                    <span className="font-semibold">  {selectedJob?.company?.name}</span> · {selectedJob?.location}
                                </p>
                                <div className="flex gap-2 items-center mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                    </svg>

                                    <p className="text-sm text-gray-500">Last updated: {selectedJob?.postDate}</p>
                                </div>
                            </header>

                            <section className="mt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Employment Type</p>
                                    <p className="text-gray-900 font-medium">{selectedJob?.employmentType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Experience</p>
                                    <p className="text-gray-900 font-medium">{selectedJob?.experience}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Salary</p>
                                    <p className="text-gray-900 font-medium">{selectedJob?.salary}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Application Deadline</p>
                                    <p className="text-gray-900 font-medium">{selectedJob?.applicationDeadline}</p>
                                </div>
                            </section>

                            <section className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">Job Overview</h3>
                                <p className={`mt-2 text-gray-700 leading-relaxed ${showFull ? "" : "line-clamp-2"}`}>
                                    {selectedJob?.snippet}
                                </p>
                                {!showFull && (
                                    <button
                                        className="text-indigo-600 hover:underline mt-2"
                                        onClick={() => setShowFull(true)}
                                    >
                                        Show More
                                    </button>
                                )}
                            </section>

                            {/* <section className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">Required Skills</h3>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {selectedJob?.skills?.map((skill, index) => (
                                        <span key={index} className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section> */}
{/* 
                            <section className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">Responsibilities</h3>
                                <ul className="mt-3 space-y-2 text-gray-700">
                                    {selectedJob?.responsibilities?.map((task, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </section> */}

                            {/* <section className="mt-6">
                                <h3 className="text-xl font-semibold text-gray-800">Perks & Benefits</h3>
                                <ul className="mt-3 space-y-2 text-gray-700">
                                    {selectedJob?.perks?.map((perk, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </section> */}

                            <footer className="mt-4 flex items-center gap-6 border-t pt-2 pb-2">
                                <a
                                    href={selectedJob?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-medium transition hover:bg-blue-700"
                                >
                                    Apply Now
                                </a>
                                <a
                                    href={`mailto:${selectedJob?.contactEmail}`}
                                    className="text-blue-600 text-lg font-medium underline hover:text-blue-800"
                                >
                                    Contact Recruiter
                                </a>
                            </footer>
                        </div>
                    )}
                </main>


            </div>
        </section>
    );
};

export default Jobs;
