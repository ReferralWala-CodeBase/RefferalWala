import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import jobListings from "./jobListings";
import { useNavigate } from "react-router-dom";

const JobDetails = () => {
    const { id } = useParams();
    const job = jobListings.find((j) => j.id === parseInt(id));
    const [showFull, setShowFull] = useState(false);

    const navigate = useNavigate();

    if (!job) {
        return <p className="text-center text-gray-500 text-lg mt-10">Job not found.</p>;
    }

    return (
        <section className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto p-3 mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 text-blue-600 text-sm font-medium underline hover:text-blue-800"
                >
                    ← Go Back
                </button>

                <hr />
                <header className="border-b pb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <img
                                src={job.image || "https://via.placeholder.com/50"}
                                alt={job.title}
                                className="w-16 h-16 object-cover rounded-full border border-gray-300"
                            />
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        </div>
                        <div className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </div>

                    </div>                    <p className="text-lg text-gray-600 mt-1">
                        <span className="font-semibold">{job.company}</span> · {job.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Last updated: {job.updated}</p>
                </header>

                {/* Job Overview */}
                <section className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Job Overview</h3>
                    <p className={`mt-2 text-gray-700 leading-relaxed ${showFull ? "" : "line-clamp-2"}`}>
                        {job.snippet}
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

                {/* Job Metadata */}
                <section className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500 text-sm">Employment Type</p>
                        <p className="text-gray-900 font-medium">{job.employmentType || "Not specified"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Experience Required</p>
                        <p className="text-gray-900 font-medium">{job.experience || "Not mentioned"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Salary</p>
                        <p className="text-gray-900 font-medium">{job.salary || "Negotiable"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Application Deadline</p>
                        <p className="text-gray-900 font-medium">{job.applicationDeadline || "Not specified"}</p>
                    </div>
                </section>

                {job.skills && job.skills.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">Required Skills</h2>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {job.skills.map((skill, index) => (
                                <span key={index} className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">Responsibilities</h2>
                        <ul className="mt-3 space-y-2 text-gray-700">
                            {job.responsibilities.map((task, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                                    {task}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {job.perks && job.perks.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800">Perks & Benefits</h2>
                        <ul className="mt-3 space-y-2 text-gray-700">
                            {job.perks.map((perk, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                                    {perk}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}


                <div className="mt-6 flex items-center gap-4">
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition hover:bg-blue-700"
                    >
                        Apply Now
                    </a>
                    <a
                        href={`mailto:${job.contactEmail}`}
                        className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                    >
                        Contact Recruiter
                    </a>
                </div>

            </div>
        </section>

    );
};

export default JobDetails;
