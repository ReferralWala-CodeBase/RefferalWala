import { Users, Send, Briefcase, ClipboardCheck } from "lucide-react";

const DashboardStats = ({ profileData }) => {
  return (
    <div className="bg-white rounded-lg mt-2 lg:w-2/2 px-2 py-3 md:px-4 md:mr-2">
      <h3 className="text-small font-semibold text-gray-900 mb-4">Dashboard</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {profileData?.getreferral === 0 && (
          <StatCard Icon={Users} title="Total Referrals Received" value={profileData?.getreferral || 0} />
        )}

        {profileData?.givereferral === 0 && (
          <StatCard Icon={Send} title="People You Have Referred" value={profileData?.givereferral || 0} />
        )}

        {profileData?.totalJobCount === 0 && (
          <StatCard Icon={Briefcase} title="Total Jobs Posted" value={profileData?.totalJobCount} />
        )}

        {profileData?.appliedJobs === 0 && (
          <StatCard Icon={ClipboardCheck} title="Total Jobs Applied For" value={profileData?.appliedJobs?.length || 0} />
        )}

      </div>
    </div>
  );
};

const StatCard = ({ Icon, title, value }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg border-gray-300 hover:shadow-xl transition-shadow duration-300">
      <div className="w-8 h-8 flex items-center justify-center text-xl mr-5">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
