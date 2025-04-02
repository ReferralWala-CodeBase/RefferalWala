import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import jobListings from "./jobListings";

const Jobs = () => {
    const [selectedJob, setSelectedJob] = useState(jobListings[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const filteredJobs = jobListings.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase())
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
                            className="ml-2 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium transition hover:bg-indigo-700"
                        >
                            Search
                        </button>
                    </div>

                    <div className="space-y-1">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) {
                                            navigate(`/job/${job.id}`);
                                        } else {
                                            setSelectedJob(job);
                                        }
                                    }}
                                    className={`p-2 border cursor-pointer ${selectedJob?.id === job.id ? "bg-white" : "bg-gray-100"
                                        }`}
                                >
                                    <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                                    <p className="text-xs text-gray-500">{job.company} - {job.location}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No jobs found.</p>
                        )}
                    </div>
                </aside>

                <main className="hidden lg:flex flex-1 h-full overflow-auto md:p-4 p-2 bg-gray-50 rounded-xl border">
                    {selectedJob && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h1>
                            <p className="text-sm text-gray-500">{selectedJob.company} - {selectedJob.location}</p>
                            <p className="mt-2 text-gray-700">{selectedJob.snippet}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Updated: {selectedJob.updated}</span>
                                <a
                                    href={selectedJob.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition hover:bg-blue-700"
                                >
                                    Apply Now
                                </a>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
};

export default Jobs;
