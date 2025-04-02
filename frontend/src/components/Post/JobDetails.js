import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import jobListings from "./jobListings";

const JobDetails = () => {
    const { id } = useParams();
    const job = jobListings.find((j) => j.id === parseInt(id));

    if (!job) {
        return <p className="text-center text-gray-500 text-lg mt-10">Job not found.</p>;
    }

    return (
        <section>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md mt-6">
                <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                <p className="mt-2 text-gray-700">{job.snippet}</p>
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Updated: {job.updated}</span>
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition hover:bg-blue-700"
                    >
                        Apply Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default JobDetails;
