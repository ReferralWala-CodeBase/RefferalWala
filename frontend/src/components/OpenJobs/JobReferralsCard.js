import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const jobData = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp Inc.",
        description: "Build amazing UIs with React and Tailwind CSS.",
        image: "https://source.unsplash.com/50x50/?developer",
    },
    {
        id: 2,
        title: "Backend Engineer",
        company: "CloudStack",
        description: "Work with Node.js, databases, and cloud infrastructure.",
        image: "https://source.unsplash.com/50x50/?backend",
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Designio",
        description: "Design smooth and modern user interfaces and flows.",
        image: "https://source.unsplash.com/50x50/?designer",
    },
    {
        id: 4,
        title: "Project Manager",
        company: "AgileWorks",
        description: "Manage agile teams and deliver projects on time.",
        image: "https://source.unsplash.com/50x50/?manager",
    },
    {
        id: 5,
        title: "DevOps Engineer",
        company: "PipelinePro",
        description: "Automate deployment pipelines and monitor systems.",
        image: "https://source.unsplash.com/50x50/?devops",
    },
];

const JobCardCarousel = () => {
    return (
        <section className="py-2">

            <hr />
            <h3 className="text-xl mt-4 font-semibold text-gray-800 mb-2">You might be interested in</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                Explore jobs tailored to your skills and interests.
            </p>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation={{
                    nextEl: ".swiper-next",
                    prevEl: ".swiper-prev",
                }}
                className="pb-10"
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {jobData.map((job) => (
                    <SwiperSlide key={job.id}>
                        <div className="bg-white py-8 h-[180px] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={job.image}
                                        alt={job.title}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                                        <p className="text-sm text-gray-500">{job.company}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-1">{job.description}</p>
                            </div>
                            <button className="mt-4 w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-1 rounded-md text-sm font-medium hover:brightness-110 transition-all duration-200">
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
