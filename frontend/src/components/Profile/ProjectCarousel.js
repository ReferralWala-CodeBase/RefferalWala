import { useState } from "react";
import { FaLaptopCode, FaGithub, FaGlobe } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Dialog } from "@headlessui/react";

const ProjectCarousel = ({ projects = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const itemsPerPage = 3;

    const nextSlide = () => {
        if (currentIndex + itemsPerPage < projects.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const prevSlide = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    const openModal = (project) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-3 relative">
            <h3 className="text-small font-semibold text-gray-900 mb-4">Projects</h3>
            {projects.length ? (
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.slice(currentIndex, currentIndex + itemsPerPage).map((project, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-teal-200 text-teal-700 rounded-full flex items-center justify-center text-2xl">
                                        <FaLaptopCode size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{project.projectName || "Project Name"}</h4>
                                        <p className="text-gray-500 text-sm">
                                            {project.details.length > 20 ? (
                                                <>
                                                    {project.details.slice(0, 20)}...
                                                    <button
                                                        onClick={() => openModal(project)}
                                                        className="text-blue-600 text-xs underline ml-1"
                                                    >
                                                        Show More
                                                    </button>
                                                </>
                                            ) : (
                                                project.details
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center mt-4">
                                    {project.repoLink && (
                                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center">
                                            <FaGithub className="mr-2" />
                                            <span className="font-medium">Repository</span>
                                        </a>
                                    )}
                                    {project.liveLink && (
                                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center">
                                            <FaGlobe className="mr-2" />
                                            <span className="font-medium">Live Link</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {projects.length > itemsPerPage && (
                        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
                            <button
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className="p-2 bg-gray-800 text-white rounded-full disabled:opacity-50 mx-2"
                            >
                                <IoIosArrowBack size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentIndex + itemsPerPage >= projects.length}
                                className="p-2 bg-gray-800 text-white rounded-full disabled:opacity-50 mx-2"
                            >
                                <IoIosArrowForward size={24} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No projects added.</p>
            )}

            {/* Modal for full details */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed bg-black/30 inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-md">
                    <h4 className="text-lg font-semibold text-gray-800">{selectedProject?.projectName}</h4>
                    <p className="text-gray-600 text-xs md:text-sm mt-2">{selectedProject?.details}</p>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="mt-3 bg-gray-800 text-white px-4 py-1 text-sm rounded-full"
                    >
                        Close
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectCarousel;
