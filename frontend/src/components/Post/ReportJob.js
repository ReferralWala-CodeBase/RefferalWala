import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from "react-icons/fa";

const ReportJob = ({ jobId, isLoggedIn, onReportSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const bearerToken = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Automatically open the dialog if logged in or navigate to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user-login');
    } else {
      setIsDialogOpen(true);  // Open the dialog immediately when component is mounted
    }
  }, [isLoggedIn, navigate]);

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting.');
      return;
    }

    try {
      const response = await fetch(
        `${Fronted_API_URL}/job-reports/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobId, reportReason, userId: userId }),
        });

      if (response.ok) {
        setIsDialogOpen(false);
        setReportReason('');
        // if (onReportSuccess) onReportSuccess();
        toast.success("Job Reported Successfully.");
      } else {
        toast.error('Failed to report job. Please try again.');
      }
    } catch (error) {
      console.error('Error reporting job:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Header */}
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4 border-b pb-3">
              Report Job
            </h3>

            {/* Textarea */}
            <textarea
              className="w-full p-3 border rounded-md focus:ring focus:ring-gray-300"
              placeholder="Enter the reason for reporting this job"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4">
              <button
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ml-2"
                onClick={handleSubmitReport}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ReportJob;
