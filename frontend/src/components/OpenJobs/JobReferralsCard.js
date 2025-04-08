import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';




const JobCardCarousel = () => {


    
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const navigate = useNavigate();
const Fronted_API_URL = process.env.REACT_APP_API_URL;


useEffect(() => {
    const fetchJobs = async () => {
      try {
     
        setLoading(true);
  
        const params = new URLSearchParams({
          page: 1,
          limit: 8,
        });
  
        const response = await fetch(`${Fronted_API_URL}/job/all?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
  
        const data = await response.json();
        setJobs(data.jobPosts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs(); 
  }, []);

    return (
        <section className="py-2">

            
            <h3 className="text-xl mt-4 font-semibold text-gray-800 mb-2">Don’t miss out — thousands are being referred. Your turn is next!</h3>
            {/* <p className="text-gray-700 leading-relaxed mb-4">
                Explore jobs tailored to your skills and interests.
            </p> */}

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                    nextEl: ".swiper-next",
                    prevEl: ".swiper-prev",
                }}
                className="pb-5"
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {jobs.map((job) => (
                    <SwiperSlide key={job?._id}>
                        <div className="bg-white py-8 h-[180px] flex flex-col justify-between">
                        <div>
  <div className="flex items-center gap-3 m-3">
  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
  </div>
    <div>
      <h4 className="text-lg font-bold text-gray-900">{job?.jobRole}</h4>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        {job?.companyName}
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        <MapPinIcon className="w-4 h-4 text-gray-500" />
        {job?.location}
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        <BriefcaseIcon className="w-4 h-4 text-gray-500" />
        {job?.experienceRequired}+ years
      </p>
    </div>
  </div>

                            </div>
                            <button
              onClick={() => navigate(`/appliedjobdetails/${job._id}`)}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-1 rounded-md text-sm font-medium hover:brightness-110 transition-all duration-200"
            >
              View Details
            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-2">
                <button className="swiper-prev bg-gray-200 text-gray-800 p-3 rounded-full  hover:bg-gray-300 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>

                </button>
                <button className="swiper-next bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:brightness-110 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>

                </button>
            </div>
        </section>
    );
};

export default JobCardCarousel;
