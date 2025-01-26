import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        body: JSON.stringify({ jobId, reportReason, userId: localStorage.getItem('userId') }),
      });

      if (response.ok) {
        toast.success('Job reported successfully!');
        setIsDialogOpen(false);
        setReportReason('');
        if (onReportSuccess) onReportSuccess();
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
          <div className="bg-white p-6 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-2">Report Job</h3>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter the reason for reporting this job"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="py-1 px-3 bg-gray-500 text-white rounded mr-2"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="py-1 px-3 bg-red-500 text-white rounded"
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
