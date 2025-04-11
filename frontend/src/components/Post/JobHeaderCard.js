import { useState } from "react";
import { BuildingOfficeIcon, BriefcaseIcon } from "@heroicons/react/24/solid";

const JobHeaderCard = ({ jobData }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 py-2 w-full mx-auto">
            {/* Company Logo */}
            <div className="w-24 h-24 flex-shrink-0 rounded-full border-4 border-blue-700 bg-blue-100 flex items-center justify-center overflow-hidden shadow-md">
                {!imgError && jobData?.companyLogoUrl ? (
                    <img
                        src={jobData.companyLogoUrl}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
                )}
            </div>
            <div className="flex flex-col items-start sm:items-start space-y-2 text-left w-full">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                    {jobData?.jobRole || "Role not specified"}
                </h2>

                <span className="text-sm md:text-md font-medium text-gray-800 bg-gray-200 px-4 py-1 rounded-full shadow-sm">
                    {jobData?.employmentType || "N/A"}
                </span>
            </div>
        </div>
    );
};

export default JobHeaderCard;
