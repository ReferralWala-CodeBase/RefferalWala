import {
    CurrencyRupeeIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    UsersIcon,
    CalendarIcon,
    IdentificationIcon,
    ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

const iconMap = {
    CTC: <CurrencyRupeeIcon className="w-5 h-5 text-gray-900" />,
    "Experience Required": <BriefcaseIcon className="w-5 h-5 text-gray-900" />,
    "Work Mode": <GlobeAltIcon className="w-5 h-5 text-gray-900" />,
    "No. of Referrals": <UsersIcon className="w-5 h-5 text-gray-900" />,
    "End Date": <CalendarIcon className="w-5 h-5 text-gray-900" />,
    "Job ID": <IdentificationIcon className="w-5 h-5 text-gray-900" />
};

const InfoCard = ({ label, value }) => (
    <div className="flex items-center gap-3 p-2 rounded-xl shadow-md border-2 bg-white text-white hover:scale-[1.02] transition-transform duration-200">
        <div className="bg-white text-gray-900 bg-opacity-20 p-2 rounded-full">
            {iconMap[label]}
        </div>
        <div className="flex flex-col text-gray-900">
            <span className="text-xs font-medium opacity-90">{label}</span>
            <span className="text-sm font-semibold">{value || "N/A"}</span>
        </div>
    </div>
);

const InfoCardGrid = ({ jobData, getDate }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8 text-sm md:text-base mb-8">
            <InfoCard label="CTC" value={jobData?.ctc} />
            <InfoCard label="Experience Required" value={`${jobData?.experienceRequired} Years`} />
            <InfoCard label="Work Mode" value={jobData?.workMode} />
            <InfoCard label="No. of Referrals" value={jobData?.noOfReferrals} />
            <InfoCard label="End Date" value={getDate(jobData?.endDate)} />
            <InfoCard label="Job ID" value={jobData?.jobUniqueId} />

            {/* View Job Link */}
            <div className="flex items-center justify-start p-3 border-2 rounded-xl shadow-md bg-white hover:scale-[1.02] transition-transform duration-200">
                <a
                    href={jobData?.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-900 font-medium hover:underline"
                    title="Open job link in a new tab"
                >
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    View Job
                </a>
            </div>
        </div>
    );
};

export default InfoCardGrid;
