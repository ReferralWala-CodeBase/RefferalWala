import React from "react";
import { Search } from "lucide-react";
import Navbar from "../Navbar";

const jobListings = [
    {
        title: "IT Audit",
        location: "Bangalore",
        snippet:
            "Job Title: Associate Consultant/ Consultant /Assistant Manager  Skills: IT Audit + Code Review \n Location: Bengaluru \n\n Overview: KPMG in India, a professional services firm, is the Indian member firm affiliated with KPMG International and was established in September...",
        link: "https://in.jooble.org/away/-3207373484830119814?p=1&pos=1&cid=137&ckey=it&jobAge=105&relb=175&brelb=115&scr=4739.685695652173&bscr=3114.6506&aq=-5925940174930022804&elckey=-1864545100897530500",
        company: "KPMG India",
        updated: "2025-03-21",
    },
    {
        title: "Software Engineer",
        location: "Hyderabad",
        snippet:
            "Looking for a skilled Software Engineer with experience in Java and React. Join our dynamic team and build innovative solutions...",
        link: "https://example.com/job/software-engineer",
        company: "Infosys",
        updated: "2025-03-22",
    },
    {
        title: "Software Engineer",
        location: "Hyderabad",
        snippet:
            "Looking for a skilled Software Engineer with experience in Java and React. Join our dynamic team and build innovative solutions...",
        link: "https://example.com/job/software-engineer",
        company: "Infosys",
        updated: "2025-03-22",
    },

    {
        title: "Software Engineer",
        location: "Hyderabad",
        snippet:
            "Looking for a skilled Software Engineer with experience in Java and React. Join our dynamic team and build innovative solutions...",
        link: "https://example.com/job/software-engineer",
        company: "Infosys",
        updated: "2025-03-22",
    },
];

const Jobs = () => {
    return (
        <section>
            <Navbar />
            <div className="flex flex-col lg:flex-row h-screen bg-gray-50 md:p-4 p-2 gap-4 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-full lg:w-1/4 bg-white md:block hidden p-3 rounded-xl shadow-sm h-full overflow-auto">
                    <div className="mb-3">
                        <h3 className="text-sm font-medium text-gray-900">Post anonymously as</h3>
                        <p className="text-xs text-gray-500">attends Kalinga Institute of Industrial Technology</p>
                    </div>
                    <button className="w-full bg-indigo-600 text-white text-sm py-2 rounded-lg font-medium transition hover:bg-indigo-700">
                        Create Post
                    </button>
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">My Bowls</h4>
                        <p className="text-xs text-gray-500">Career Advice for Students</p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 h-full overflow-auto md:p-4 p-2 bg-white rounded-xl shadow-sm">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search for jobs..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                    <div className="space-y-4">
                        {jobListings.map((job, index) => (
                            <div key={index} className="bg-gray-100 p-3 shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                                <p className="text-xs text-gray-500">{job.company} - {job.location}</p>
                                <p className="mt-2 text-sm text-gray-700">{job.snippet}</p>
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
                        ))}
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="w-full lg:w-1/4  md:block hidden bg-white p-3 rounded-xl shadow-sm h-full overflow-auto">
                    <h4 className="text-sm font-medium text-gray-900">Bowls for you</h4>
                    <ul className="mt-2">
                        {["Consulting India", "Referral and Opportunities", "Tech India"].map((bowl, index) => (
                            <li key={index} className="mb-2 flex justify-between items-center text-sm">
                                <span className="text-gray-800">{bowl}</span>
                                <button className="border border-gray-400 px-3 py-1 rounded-lg text-xs font-medium transition hover:bg-gray-200">
                                    Follow
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </section>
    );
};

export default Jobs;
