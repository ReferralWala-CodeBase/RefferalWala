import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { FaGithub, FaLinkedin, FaGlobe, FaInstagram, FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { UsersIcon, PaperAirplaneIcon, BriefcaseIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

import Navbar from "../Navbar";
import SidebarNavigation from '../SidebarNavigation';
import Loader from '../Loader';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import person from '../../assets/person.png'

const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`p-4 rounded-lg shadow-md text-white flex items-center ${color}`}>
        <Icon className="w-8 h-8 mr-3" />
        <div>
            <p className="text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);


export default function Dashboard() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const Fronted_API_URL = process.env.REACT_APP_API_URL;
    const [stats, setStats] = useState({
        totalJobsPosted: 0,
        totalJobsApplied: 0,
        totalReferralsReceived: 0,
        totalReferralsGiven: 0
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const bearerToken = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                const response = await fetch(`${Fronted_API_URL}/job/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/user-login');
                    } else {
                        throw new Error('Failed to fetch profile data');
                    }
                }
                const data = await response.json();
                if (data.length > 0) {
                    setProfileData(data[0]?.user || {});
                    setStats({
                        totalJobsPosted: data.length, // Count of total job posts
                        totalJobsApplied: data[0]?.user?.appliedJobs?.length || 0, // Count of applied jobs
                        totalReferralsReceived: data[0]?.user?.getreferral || 0, // Total referrals received
                        totalReferralsGiven: data[0]?.user?.givereferral || 0, // Total referrals given
                    });
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error(error.message);
            }
        };

        fetchProfileData();
    }, [navigate, Fronted_API_URL]);

    useEffect(() => {
        const fetchProfileCompletion = async () => {
            try {
                const bearerToken = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");
                const response = await fetch(`${Fronted_API_URL}/user/profile-completion/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch profile completion");
                }
                const data = await response.json();
                setProfileCompletion(data.profileCompletion);
            } catch (error) {
                console.error("Error fetching profile completion:", error);
            }
        };

        fetchProfileCompletion();
    }, [Fronted_API_URL]);

    if (!profileData) {
        return <Loader />;
    }

    return (
        <>
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="flex mt-[navbar-height] bg-[#edede7]">
                <div className="w-1/12 md:w-1/4 fixed lg:relative">
                    <SidebarNavigation />
                </div>
                <div className="w-full md:w-4/4 px-0 sm:px-6 m-auto">
                    <div className="p-3 sm:mr-0 mt-2 font-sans rounded-md bg-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <StatCard icon={UsersIcon} title="Total Referrals Received" value={stats.totalReferralsReceived} color="bg-purple-500" />
                            <StatCard icon={PaperAirplaneIcon} title="People You Have Referred" value={stats.totalReferralsGiven} color="bg-blue-500" />
                            <StatCard icon={BriefcaseIcon} title="Total Jobs Posted" value={stats.totalJobsPosted} color="bg-green-500" />
                            <StatCard icon={ClipboardDocumentCheckIcon} title="Total Jobs Applied For" value={stats.totalJobsApplied} color="bg-[rgb(139,199,65)]" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg p-6 shadow-md col-span-1 text-center">


                                <div className="relative w-48 h-48 mx-auto rounded-full flex items-center justify-center">
                                    <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        {/* Background Circle */}
                                        <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="5" fill="none" />
                                        {/* Progress Circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="rgb(86, 1, 142)"
                                            strokeWidth="5"
                                            fill="none"
                                            strokeDasharray="283"  // Full circumference (2 * π * 45)
                                            strokeDashoffset={`${283 - (profileCompletion / 100) * 283}`}
                                            strokeLinecap="round"
                                            className="transition-all duration-500 ease-in-out"
                                        />
                                    </svg>

                                    {/* Inner White Circle */}
                                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center">
                                        <img
                                            src={profileData?.profilePhoto || person}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                                        />
                                    </div>

                                    {/* Profile Completion Percentage */}
                                    {/* {profileCompletion !== null && (
                                        <div className="absolute bottom-4 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                            {profileCompletion}%
                                        </div>
                                    )} */}
                                </div>


                                <h3 className="text-lg font-semibold mt-2">{profileData ? `${profileData.firstName} ${profileData.lastName}` : person}</h3>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-md col-span-2">
                                <h4 className="font-semibold text-gray-600 mb-4">Referralwala Stats</h4>
                                <div className="h-52 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                                    📊 Graph Placeholder
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

