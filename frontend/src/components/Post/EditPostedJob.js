import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarNavigation from '../SidebarNavigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "../Navbar";
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import DOMPurify from 'dompurify';

export default function EditJob() {
  const { jobId } = useParams(); // Extract jobId from URL
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    jobRole: '',
    companyName: '',
    experienceRequired: '',
    location: '',
    jobLink: '',
    jobUniqueId: '',
    noOfReferrals: '',
    workMode: 'remote',
    employmentType: 'full-time',
    ctc: '',
    endDate: '',
    jobDescription: '',
    status: ''
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const response = await fetch(`${Fronted_API_URL}/job/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized, remove the token and navigate to login
            localStorage.removeItem('token');
            navigate('/user-login');
          } else {
            throw new Error('Failed to fetch job data');
          }
        }

        const data = await response.json();
        setFormData(data);  // Populate form with existing job data
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error(error.message);
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJobEditSubmit = async (e) => {
    e.preventDefault();

    // Add userId from local storage to formData
    const bearerToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const updatedFormData = { ...formData, userId, status: 'active' };

    const today = new Date().toISOString().split('T')[0];
    const jobEndDate = new Date(updatedFormData.endDate).toISOString().split('T')[0];

    if (jobEndDate === today) {
      toast.error("Please change the end date from today's date!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Stop execution
    }

    try {
      const response = await fetch(`${Fronted_API_URL}/job/update/${jobId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Unauthorized, remove the token and navigate to login
          localStorage.removeItem('token');
          navigate('/user-login');
        } else {
          throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
        }
      }

      const responseData = await response.json();
      toast.success("Job updated successfully!", {
        position: "top-right",
        autoClose: 3000, // 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate(`/postedjobslist`);
    } catch (error) {
      console.error('Error updating job:', error.message);
      toast.error(error.message);
    }
  };

  function getDate(endDate_param) {
    var tempDate = endDate_param + "";
    var date = '';
    for (let i = 0; i < tempDate.length; i++) {
      if (/^[a-zA-Z]$/.test(tempDate[i]))
        break;
      else
        date += tempDate[i];
    }
    return date;
  }

  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const quillInitializedRef = useRef(false);

  useEffect(() => {
    if (quillRef.current && !quillInitializedRef.current) {
      try {

        // Ensure container is LTR
        quillRef.current.style.direction = 'ltr';
        quillRef.current.style.textAlign = 'left';
        quillRef.current.setAttribute('dir', 'ltr');
        quillRef.current.classList.add('ltr-quill-container');

        // Initialize Quill
        editorRef.current = new Quill(quillRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              ["link"],
              [{ align: [] }],
              // Removed RTL option
              [{ indent: "-1" }, { indent: "+1" }],
              ["clean"],
            ],
          },
        });

        // Apply LTR settings to editor
        editorRef.current.root.style.direction = 'ltr';
        editorRef.current.root.style.textAlign = 'left';
        editorRef.current.root.setAttribute('dir', 'ltr');

        // Set initial content if available
        if (formData?.jobDescription) {
          editorRef.current.clipboard.dangerouslyPasteHTML(0, formData.jobDescription);
          editorRef.current.formatText(0, editorRef.current.getLength(), 'direction', 'ltr');
        }

        // Define text change handler
        const handleTextChange = () => {
          const updatedContent = editorRef.current.root.innerHTML;
          const sanitizedContent = DOMPurify.sanitize(updatedContent);
          if (formData?.jobDescription !== sanitizedContent) {
            setFormData(prev => ({ ...prev, jobDescription: sanitizedContent }));
          }
        };

        // Listen for text changes
        editorRef.current.on('text-change', handleTextChange);

        quillInitializedRef.current = true;
      } catch (error) {
        console.error('Error initializing Quill:', error);
      }
    }

    // Update content when formData changes
    if (editorRef.current && formData?.jobDescription) {
      const currentContent = editorRef.current.root.innerHTML;
      if (currentContent !== formData.jobDescription) {
        try {
          // Remove text change listener before updating
          editorRef.current.off('text-change');

          // Set new content safely
          editorRef.current.setContents([]);
          editorRef.current.clipboard.dangerouslyPasteHTML(0, formData.jobDescription);
          editorRef.current.formatText(0, editorRef.current.getLength(), 'direction', 'ltr');

          // Re-add text change listener
          editorRef.current.on('text-change', () => {
            const updatedContent = editorRef.current.root.innerHTML;
            const sanitizedContent = DOMPurify.sanitize(updatedContent);
            if (formData?.jobDescription !== sanitizedContent) {
              setFormData(prev => ({ ...prev, jobDescription: sanitizedContent }));
            }
          });
        } catch (error) {
          console.error('Error setting content:', error);
        }
      }
    }
  }, [formData]);


  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-0 sm:px-1 m-auto">
          <h3 className="mt-3 text-base font-semibold leading-7 text-gray-900">Edit Job</h3>
          <form onSubmit={handleJobEditSubmit}>
            <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">Job Role</label>
                <input
                  type="text"
                  id="jobRole"
                  name="jobRole"
                  value={formData?.jobRole}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="jobLink" className="block text-sm font-medium text-gray-700">Job Link</label>
                <input
                  type="text"
                  id="jobLink"
                  name="jobLink"
                  value={formData?.jobLink}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="jobUniqueId" className="block text-sm font-medium text-gray-700">Job ID</label>
                <input
                  type="text"
                  id="jobUniqueId"
                  name="jobUniqueId"
                  value={formData?.jobUniqueId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData?.companyName}
                  onChange={handleChange}
                  required
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="experienceRequired" className="block text-sm font-medium text-gray-700">Experience Required (Years)</label>
                <input
                  type="text"
                  id="experienceRequired"
                  name="experienceRequired"
                  value={formData?.experienceRequired}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData?.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">Work Mode</label>
                <select
                  id="workMode"
                  name="workMode"
                  value={formData?.workMode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData?.employmentType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label htmlFor="ctc" className="block text-sm font-medium text-gray-700">CTC (INR-Lakhs)</label>
                <select
                  id="ctc"
                  name="ctc"
                  value={formData?.ctc}
                  onChange={handleChange}

                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select CTC</option>
                  <option value="3-5 LPA">3-5 LPA</option>
                  <option value="5-8 LPA">5-8 LPA</option>
                  <option value="8-12 LPA">8-12 LPA</option>
                  <option value="12-15 LPA">12-15 LPA</option>
                  <option value="15-20 LPA">15-20 LPA</option>
                  <option value="20-25 LPA">20-25 LPA</option>
                  <option value="25+ LPA">25+ LPA</option>
                </select>
              </div>

              <div>
                <label htmlFor="noOfReferrals" className="block text-sm font-medium text-gray-700">Number of Referrals</label>
                <input
                  type="number"
                  id="noOfReferrals"
                  name="noOfReferrals"
                  value={formData?.noOfReferrals}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={getDate(formData?.endDate)}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="col-span-2 mt-6">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <div className="border border-gray-300 rounded-md">
                {/* Quill container with inline styles */}
                <div ref={quillRef} className="quill-editor" style={{
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  direction: "ltr"

                }}></div>

              </div>
            </div>

            <div className="col-span-2 mt-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update Job
              </button>
            </div>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
}
