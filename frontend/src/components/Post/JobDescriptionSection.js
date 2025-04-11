import { DocumentTextIcon } from "@heroicons/react/24/outline";

const JobDescriptionSection = ({ jobData }) => {
    return (
        <div className="mt-4 border-t-2 py-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Job Description</h2>
            </div>
            <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed whitespace-pre-line">
                {jobData?.jobDescription || "No description available for this job."}
            </p>
        </div>
    );
};

export default JobDescriptionSection;
