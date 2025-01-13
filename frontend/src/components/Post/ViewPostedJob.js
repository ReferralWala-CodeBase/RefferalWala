import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  XCircleIcon
} from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import SidebarNavigation from '../SidebarNavigation';
import { FaSpinner } from "react-icons/fa";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ViewPostedJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const [jobData, setJobData] = useState(null);

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
          throw new Error('Failed to fetch job data');
        }

        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error(error.message);
      }
    };

    fetchJobData();
  }, [jobId]);

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

  const inactivate = async () => {

    const bearerToken = localStorage.getItem('token');

    const userId = localStorage.getItem('userId');



    const updatedJobData = {

      userId,

      status: 'inactive' // Set the status field to 'inactive'

    };



    try {

      const response = await fetch(`${Fronted_API_URL}/job/update/${jobId}`, {

        method: 'PUT',

        headers: {

          Authorization: `Bearer ${bearerToken}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify(updatedJobData),

      });



      if (!response.ok) {

        const errorData = await response.json();

        throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);

      }



      const responseData = await response.json();

      toast.success("Job status updated to inactive successfully!", {

        position: "top-right",

        autoClose: 3000, // 3 seconds

        hideProgressBar: false,

        closeOnClick: true,

        pauseOnHover: true,

        draggable: true,

        progress: undefined,

        onClose: () => {

          navigate(`/postedjobslist`);

        }

      });

      console.log('Response:', responseData);

    } catch (error) {

      console.error('Error fetching job data:', error);

      toast.error(error.message);

    }

  };



  if (!jobData) {
    return
      <div className="flex justify-center items-center">
      <FaSpinner className="animate-spin text-xl" />
    </div>;
  }

  return (
    <>
  <Navbar/>
    
  <div>
    <SidebarNavigation />
    <main className="py-2 lg:pl-72">
                   <div className="lg:flex lg:justify-between bg-gray-800 p-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">
          {jobData.jobRole}
        </h2>
        <h3 className="text-xl leading-7 text-white sm:truncate sm:text-xl sm:tracking-tight">
          @{jobData.companyName}
        </h3>
        <div className="mt-2 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {jobData.workMode}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {jobData.location}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {jobData.ctc} LPA
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            Closing on {getDate(jobData.endDate)}
          </div>
        </div>
     
        <div className="col-span-2 py-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Job Description</label>
            {jobData.jobDescription}
         </div>
         <div className="col-span-2 pb-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Experience Required (Years)</label>
            {jobData.experienceRequired}
          </div>
          <div className="col-span-2 pb-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Employment Type</label>
            {jobData.employmentType}
          </div>
          <div className="col-span-2 pb-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Number of Referrals</label>
            {jobData.noOfReferrals}
          </div> 
          <div className="col-span-2 pb-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Job Link</label>
            {jobData.jobLink}
          </div>
          <div className="col-span-2 pb-4 text-white">
            <label className="block text-sm font-medium text-gray-500">Job ID</label>
            {jobData.jobUniqueId}
          </div>
        
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="sm:block">
          <button
            type="button"
            onClick={() => navigate(`/editpostedjob/${jobId}`)}
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Edit
          </button>
          
        </span>
        <span className="sm:ml-3">
          <button
          type="button"
           onClick={inactivate}
           className="inline-flex items-center rounded-md bg-white/10 mx-1 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          > <XCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Close 

            </button>
        </span>
     
      </div>
     




     </div>
            
      </main>
    </div> 
    </>
  

  );
}
