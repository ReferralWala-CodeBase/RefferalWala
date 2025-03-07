import React, { useState, useEffect, useRef, Fragment } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck, FaCheckCircle } from 'react-icons/fa';
import Navbar from "../Navbar";
import { PencilIcon, UserMinusIcon, UserPlusIcon, EyeIcon } from '@heroicons/react/20/solid';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { LocationExport } from "../Location";
import { FaTimes } from "react-icons/fa";
import Loader from '../Loader';

export default function EditProfile() {
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL;
  const Logo_Dev_Secret_key = process.env.REACT_APP_LOGO_DEV_SECRET_KEY;
  const Cloudinary_URL = process.env.REACT_APP_CLOUDINARY_URL;
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    profilePhoto: '',
    education: [{ level: '', schoolName: '', yearOfPassing: '' }],
    // experience: [{ companyName: '', position: '', yearsOfExperience: '' }],
    experience: [{ companyName: '', position: '', dateOfJoining: '', dateOfLeaving: '' }],
    presentCompany: [{ role: '', companyName: '', location: '', currentCTC: '', CompanyEmailVerified: false, companyEmail: '', dateOfJoining: '' }],
    preferences: [{ preferredCompanyName: '', preferredCompanyURL: '', preferredPosition: '', expectedCTCRange: '' }],
    project: [{ name: "", repoLink: "", liveLink: "", description: "" }],
    links: {
      github: '',
      portfolio: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      other: ''
    },
    skills: [],
    achievements: [],
    resume: '',
    aboutMe: ''
  });

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [newEducation, setNewEducation] = useState({ level: '', schoolName: '', yearOfPassing: '' });
  const [newExperience, setNewExperience] = useState({ companyName: '', position: '', dateOfJoining: '', dateOfLeaving: '' });
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [preferencecompanySuggestions, setPreferenceCompanySuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalCompany, setOriginalCompany] = useState('');
  const [originalCompanyEmail, setOriginalCompanyEmail] = useState('');
  const [isCompanyEmailVerified, setIsCompanyEmailVerified] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", repoLink: "", liveLink: "", description: "" });
  const [newPreferences, setNewPreferences] = useState({ preferredCompanyName: '', preferredPosition: '', expectedCTCRange: '' });
  const [showForm, setShowForm] = useState(false); // To show the input form
  const [isVerified, setIsVerified] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false); // Resume Confrim
  const [showCompanyChangeModal, setShowCompanyChangeModal] = useState(false);
  const [showloader, setShowLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [originalMobileno, setOriginalMobileno] = useState(''); // for phone verification
  // const [isPhoneVerified, setIsPhoneVerified] = useState(null); // for phone verification
  // const [showPhoneOtpModal, setPhoneShowOtpModal] = useState(false); // for phone verification

  const [openResume, setResumeOpen] = useState(false);
  // const cancelButtonRef = useRef(null);

  const openModal = () => {
    setResumeOpen(true);
  };

  // Close modal function
  const handleCloseModal = () => {
    setResumeOpen(false);
  };


  const handleDeactivate = async () => {
    try {
      const bearerToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const newStatus = profileData?.isActivate ? false : true; // Toggle the status

      const response = await fetch(`${Fronted_API_URL}/user/deactivate/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActivate: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`);
      navigate('/viewprofile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message);

    };
  }

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setResendTimer(60);

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${Fronted_API_URL}/user/resend-otp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: profileData?.presentCompany.companyEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Resend OTP sent successfully!!!.");
      } else {
        toast.error(data.message || "OTP send failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

  };


  const handleOtpChange = (e) => {
    setOtp(e.target.value); // Update OTP state
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${Fronted_API_URL}/user/verifyCompanyEmail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",

          },
          body: JSON.stringify({ email: profileData?.presentCompany.companyEmail, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Company Email verified successfully! ");
        setIsVerified(true);
        setIsCompanyEmailVerified(true);
        setProfileData(prevState => ({
          ...prevState,
          presentCompany: {
            ...prevState.presentCompany,
            CompanyEmailVerified: true // ✅ Directly setting it to true
          }
        }));


        setOriginalCompanyEmail(profileData?.presentCompany?.companyEmail);
        setShowOtpModal(false);
      } else {
        toast.error(data.message || "Company Email verification failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    finally{
      setOtp("");
    }
  };

  const handleCompanyVerification = async (e) => {
    // Prevent default form submission behavior
    // e.preventDefault();
    const bearerToken = localStorage.getItem('token');

    // //Company Email validation
    // const companyEmail = profileData?.presentCompany.companyEmail;
    // const companyName = profileData?.presentCompany.companyName.toLowerCase().replace(/\s+/g, ''); // Remove spaces from company name

    // // Extract the domain part after '@'
    // const companyDomain = companyEmail.split('@')[1];
    // const companyNameFromDomain = companyDomain.split('.')[0].toLowerCase();

    // const inputEmail = profileData?.presentCompany.companyEmail;

    // const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${companyNameFromDomain}\\.`);

    // if (!emailRegex.test(inputEmail) || !companyNameFromDomain.includes(companyName)) {
    //   toast.error("Email does not belong to the company's domain or does not match the company name.");
    //   return;
    // }

    setResendTimer(30);
    setShowOtpModal(true);

    try {
      const response = await fetch(`${Fronted_API_URL}/user/sendOTP`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: profileData?.presentCompany.companyEmail }),
      });

      const data = await response.json();

      setIsCompanyEmailVerified(false);
      setProfileData(prevState => ({
        ...prevState,
        presentCompany: {
          ...prevState.presentCompany,
          CompanyEmailVerified: false
        }
      }));

      if (response.ok) {
        toast.success("OTP sent successfully!");
      } else {
        if (response.status === 400) {
          toast.error(data.message || "Email is already verified.");
        } else {
          toast.error(data.message || "OTP send failed. Try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };


  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...profileData?.achievements];
    updatedAchievements[index] = value;
    setProfileData({ ...profileData, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    setProfileData({
      ...profileData,
      achievements: [...profileData?.achievements, ''] // Add a new empty input for achievements
    });
  };

  const removeAchievement = (index) => {
    const newAchievements = profileData?.achievements.filter((_, i) => i !== index);
    setProfileData({ ...profileData, achievements: newAchievements });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profileData?.skills];
    updatedSkills[index] = value;
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  // Add a new skill input field
  const addSkill = () => {
    setProfileData({
      ...profileData,
      skills: [...profileData?.skills, ""] // Add a new empty input for skills
    });
  };

  // Remove a skill from the list
  const removeSkill = (index) => {
    const updatedSkills = profileData?.skills.filter((_, i) => i !== index);
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const addProject = () => {
    setProfileData((prevData) => ({
      ...prevData,
      project: [...prevData.project, newProject], // Add newProject to project array
    }));
    setNewProject({ name: "", repoLink: "", liveLink: "", description: "" }); // Reset form
    setShowProjectForm(false);
  };

  const removeProject = (index) => {
    setProfileData((prevData) => {
      const updatedProjects = [...prevData.project];
      updatedProjects.splice(index, 1);
      return { ...prevData, project: updatedProjects };
    });
  };

  const handleChangeNew = async (e) => {
    const { name, value } = e.target;
    setNewPreferences({ ...newPreferences, [e.target.name]: e.target.value });

    if (name === "preferredCompanyName" && value.length > 2) {
      setLoading(true);

      try {
        const response = await fetch(`https://api.logo.dev/search?q=${value}`, {
          headers: { Authorization: `Bearer ${Logo_Dev_Secret_key}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company suggestions");
        }

        const data = await response.json();

        setPreferenceCompanySuggestions(data.length > 0 ? data : []);

      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setPreferenceCompanySuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Clear suggestions if input length is less than 3
      setPreferenceCompanySuggestions([]);
    }
  };

  // Add new preference to the list
  const handleAddPreference = () => {
    if (
      !newPreferences.preferredCompanyName.trim() ||
      !newPreferences.preferredPosition.trim() ||
      !newPreferences.expectedCTCRange.trim()
    ) {
      alert("Please fill all fields before adding a preference.");
      return;
    }

    setProfileData((prevData) => ({
      ...prevData,
      preferences: [...prevData.preferences, newPreferences],
    }));

    // Reset input fields and hide form
    setNewPreferences({
      preferredCompanyName: "",
      preferredPosition: "",
      expectedCTCRange: "",
    });
    setShowForm(false); // Hide form after submission
  };

  // Remove a preference
  const handleRemovePreference = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      preferences: prevData.preferences.filter((_, i) => i !== index),
    }));
  };

  // Remove the Resume
  const removeResume = () => {
    setProfileData((prevData) => ({
      ...prevData,
      resume: '', // Clear the resume from state
    }));
    setOpenConfirmModal(false);
  };


  // Fetching the existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`${Fronted_API_URL}/user/profile/${userId}`, {
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
            throw new Error('Failed to fetch profile data');
          }
        }

        const data = await response.json();
        setProfileData(data);
        setShowLoader(true);
        setOriginalCompany(data?.presentCompany?.companyName);
        setOriginalCompanyEmail(data?.presentCompany?.companyEmail);
        setIsCompanyEmailVerified(data?.presentCompany?.CompanyEmailVerified);
        // setOriginalMobileno(data?.mobileNumber);   //Phone verify
        // setIsPhoneVerified(data?.mobileNumberVerified)  //Phone verify
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, []);


  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber" && !/^\d*$/.test(value)) {
      // If value is not numeric, don't update the state
      return;
    }
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };


  const handlePresentChange = async (e) => {
    const { name, value } = e.target;

    setProfileData((prevState) => {
      return {
        ...prevState,
        presentCompany: {
          ...prevState.presentCompany,
          [name]: value,
        },
        [name]: name !== "companyName" && name !== "location" ? value : prevState[name], // Update non-company fields
      };
    });

    // Fetch suggestions for companyName or location if value length > 2
    if (value.length > 2) {
      setLoading(true);

      try {
        if (name === "companyName") {
          // Fetch company suggestions using the external API
          const response = await fetch(`https://api.logo.dev/search?q=${value}`, {
            headers: { Authorization: `Bearer ${Logo_Dev_Secret_key}` },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch company suggestions");
          }

          const data = await response.json();
          setCompanySuggestions(data.length > 0 ? data : []);
        } else if (name === "location") {
          // Filter locations based on user input
          const filteredLocations = LocationExport.filter((loc) =>
            `${loc.city}, ${loc.state}`.toLowerCase().includes(value.toLowerCase())
          );

          setLocationSuggestions(
            filteredLocations.map((loc) => ({
              description: `${loc.city}, ${loc.state}`,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setCompanySuggestions([]);
        setLocationSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Clear suggestions if input length is less than 3
      setCompanySuggestions([]);
      setLocationSuggestions([]);
    }
  };

  const confirmCompanyChange = (confirm) => {
    setProfileData((prevState) => ({
      ...prevState,
      presentCompany: confirm
        ? { role: "", companyName: profileData?.presentCompany?.companyName, location: "", currentCTC: "", CompanyEmailVerified: false, companyEmail: "", dateOfJoining: "" }
        : { ...prevState.presentCompany, companyName: originalCompany },
    }));

    if (confirm) {
      setIsCompanyEmailVerified(false);
      setOriginalCompany(false);
      setIsEditing(true);
    }


    setShowCompanyChangeModal(false);
  };



  const handlePreferenceChange = async (e, index) => {
    const { name, value } = e.target;

    // Update preference state
    const updatedPreferences = [...profileData?.preferences];
    updatedPreferences[index] = {
      ...updatedPreferences[index],
      [name]: value,
    };

    setProfileData((prevState) => ({
      ...prevState,
      preferences: updatedPreferences,
    }));

    // Fetch suggestions if input length > 2
    if (name === "preferredCompanyName" && value.length > 2) {
      setLoading(true);

      try {
        const response = await fetch(`https://api.logo.dev/search?q=${value}`, {
          headers: { Authorization: `Bearer ${Logo_Dev_Secret_key}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company suggestions");
        }

        const data = await response.json();

        setPreferenceCompanySuggestions((prevSuggestions) => {
          const newSuggestions = [...prevSuggestions];
          newSuggestions[index] = data.length > 0 ? data : [];
          return newSuggestions;
        });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setPreferenceCompanySuggestions((prevSuggestions) => {
          const newSuggestions = [...prevSuggestions];
          newSuggestions[index] = [];
          return newSuggestions;
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Clear suggestions when input is less than 3 characters
      setPreferenceCompanySuggestions((prevSuggestions) => {
        const newSuggestions = [...prevSuggestions];
        newSuggestions[index] = [];
        return newSuggestions;
      });
    }
  };

  const handleSuggestionClick = (company) => {

    setProfileData((prevState) => ({
      ...prevState,
      presentCompany: {
        ...prevState.presentCompany,
        companyName: company.name,
        companyLogoUrl: company.logo_url || null,
      },
    }));

    setCompanySuggestions([]); // Clear suggestions
    setShowCompanyChangeModal(true);

  };

  const handlePreferencecompanyClick = (company) => {
    setNewPreferences((prev) => ({
      ...prev,
      preferredCompanyName: company.name,
      preferredCompanyURL: company.logo_url || null,
    }));

    // Clear suggestions after selection
    setPreferenceCompanySuggestions([]);
  };


  const handleSelectSuggestion = (location) => {
    setProfileData((prevState) => ({
      ...profileData,
      presentCompany: {
        ...prevState.presentCompany,
        location: location.description,
      },
    }));
    setLocationSuggestions([]); // Clear suggestions after selection
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in the Experience form
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  // Add new Education entry
  const addEducation = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
    setShowEducationForm(false);
    setNewEducation({ level: '', schoolName: '', yearOfPassing: '' });

  };

  // Add new Experience entry
  const addExperience = () => {
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
    setShowExperienceForm(false);
    setNewExperience({ companyName: '', position: '', dateOfJoining: '', dateOfLeaving: '' });

  };

  const removeEducation = (index) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Remove Experience entry
  const removeExperience = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bearerToken = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`${Fronted_API_URL}/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success("Profile updated successfully");
      navigate('/viewprofile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Show the image preview
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);

        // Upload to Cloudinary
        const uploadResponse = await uploadImageToCloudinary(file);
        const uploadedImageUrl = uploadResponse.secure_url;

        if (!uploadedImageUrl) {
          throw new Error("Failed to upload image");
        }

        // Update profileData with the Cloudinary URL (not the file object)
        setProfileData((prevData) => ({
          ...prevData,
          profilePhoto: uploadedImageUrl,
        }));

      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    }
  };



  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Referrwala Image'); // Replace with upload preset name

    const response = await fetch(`${Cloudinary_URL}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed');
    }

    return data; // Return data containing URL and other metadata
  };

  const handleCompanyEmail = () => {
    if (profileData?.presentCompany?.companyEmail !== originalCompanyEmail) {
      setIsCompanyEmailVerified(false);
    }
  };

  const validation = () => {

    const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    const yearPattern = /^(19|20)\d{2}$/; // 1990-2099
    const mobilePattern = /^\d{10}$/; // 10-digit mobile number
    const numericPattern = /^\d+$/; // Only numbers

    // **Mobile Number Validation**
    if (profileData?.mobileNumber && !mobilePattern.test(profileData?.mobileNumber)) {
      return toast.error("Please enter a valid 10-digit mobile number.");
    }

    // **Year of Passing Validation**
    for (const edu of profileData?.education ?? []) {
      if (edu.yearOfPassing && !yearPattern.test(edu.yearOfPassing)) {
        return toast.error("Please enter a valid year of passing.");
      }
    }

    // **Repo & Live Link Validation**
    for (const proj of profileData?.project ?? []) {
      if ((proj.repoLink && !urlPattern.test(proj.repoLink)) ||
        (proj.liveLink && !urlPattern.test(proj.liveLink))) {
        return toast.error("Please enter valid URLs for repo or live links.");
      }
    }

    // **Social Media Links Validation**
    for (const [key, value] of Object.entries(profileData?.links ?? {})) {
      if (key !== "_id" && value && !urlPattern.test(value)) {
        return toast.error(`Please enter a valid URL for ${key}`);
      }
    }

    // **Resume Link Validation**
    // if (profileData?.resume && !urlPattern.test(profileData?.resume)) {
    //   return toast.error("Please enter a valid URL for the resume.");
    // }
  };

  const handleResumeChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          resume: reader.result.split(',')[1], // Store only the base64 part
        });
      };
      reader.readAsDataURL(file); // Read the file as a base64 string
    }
  };


  //sending sms to verify phone number
  // const handlePhoneVerification = async (e) => {
  //   // Prevent default form submission behavior
  //   e.preventDefault();

  //   try {
  //     const bearerToken = localStorage.getItem('token');
  //     const response = await fetch(`${Fronted_API_URL}/user/sendphoneOTP`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${bearerToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ mobileNumber: profileData?.mobileNumber }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setPhoneShowOtpModal(true);
  //       toast.success("OTP sent successfully!");
  //     } else {
  //       if (response.status === 400) {
  //         toast.error(data.message || "Phone is already verified.");
  //       } else {
  //         toast.error(data.message || "OTP send failed. Try again.");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred. Please try again.");
  //   }
  // };

  if (!showloader) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex md:bg-[#edede7] bg-none">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-full md:w-4/4 px-0 sm:px-6 mx-auto bg-white">
          <div className="flex justify-between w-full items-center mt-6 ">

            <h3 className="text-lg border w-full p-2 bg-gray-200/50 rounded-lg font-medium leading-7 text-gray-800 text-left">
              Edit Profile
            </h3>

            {/* <button
              onClick={() => setOpen(true)}
              className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {profileData?.isActivate === false ? (
                <UserPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              ) : (
                <UserMinusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              )}
              {profileData?.isActivate === false ? "Activate" : "Deactivate"}
            </button> */}
          </div>


          {/* Delete Confirmation Modal */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              initialFocus={cancelButtonRef}
              onClose={() => setOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete Account
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to deactivate your account?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          onClick={() => {
                            setOpen(false);
                            handleDeactivate();
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData?.firstName || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2 placeholder:text-sm placeholder:text-gray-500"
                  placeholder='Enter your first name'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData?.lastName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2 placeholder:text-sm placeholder:text-gray-500"
                  placeholder='Enter your last name'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={profileData?.email || ''}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2 placeholder:text-sm placeholder:text-gray-500"
                  placeholder='Enter your personal email address'
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2"
                  />
                </div>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-8 w-8 rounded-full shadow border-2 border-gray-500 p-1"
                  />
                ) : (<img
                  src={profileData?.profilePhoto}
                  alt="Profile"
                  className="h-16 w-16 rounded-full shadow border-2 border-gray-500 p-1"
                />)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>

                <div className="flex items-center">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={profileData?.mobileNumber || ''}
                    onChange={handleChange}
                    onBlur={validation}
                    className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2 placeholder:text-sm placeholder:text-gray-500"
                    required
                    placeholder='Enter your contact number'
                  />

                  {/* <input
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        presentCompany: {
                          ...profileData?.presentCompany,
                          companyEmail: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  /> */}


                  {/*
                  {profileData?.mobileNumber === originalMobileno &&
                    isPhoneVerified && (
                      <FaCheckCircle
                        className="ml-2"
                        style={{ color: "#009fe3" }}
                        size={30}
                        title="Verified"
                      />
                    )}
                  <button
                    type="button"
                    onClick={handlePhoneVerification}
                    className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Verify
                  </button>
                  */}
                </div>


              </div>

              {/* Phone OTP Modal */}
              {/* {showPhoneOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Verify OTP</h3>
                    <form onSubmit={handleOtpSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={profileData?.mobileNumber}
                          readOnly
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={handleOtpChange}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleOtpSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
                      >
                        Verify OTP
                      </button>
                    </form>
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-600 mt-4"><span className="text-blue-600 cursor-pointer underline">Resend OTP</span> in {resendTimer}s</p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-400"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )} */}


              <div>
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={profileData?.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-100/60 border border-gray-300 shadow-sm p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>


            </div>

            <hr className='mt-2 mb-2' />

            {/* Present Company */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Present Company</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={profileData?.presentCompany?.role || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData?.presentCompany,
                        role: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div className='relative'>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileData?.presentCompany?.companyName || ''}
                  onChange={handlePresentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />

                {companySuggestions.length > 0 && (
                  <ul className="absolute w-full mt-32 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto" style={{ top: '-100%' }}>
                    {companySuggestions.map((company, index) => (
                      <li
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(company)}
                      >
                        <div className="flex items-center">
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-6 w-6 object-contain mr-2"
                          />
                          <span>{company.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {showCompanyChangeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Change Company Name?
                    </h3>
                    <p className="text-gray-700">Changing the company name will erase all existing company details. Do you still want to proceed?</p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        onClick={() => confirmCompanyChange(false)}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        No
                      </button>
                      <button
                        onClick={() => confirmCompanyChange(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Yes, Change
                      </button>
                    </div>
                  </div>
                </div>
              )}


              <div>
                <label className="block text-sm font-medium text-gray-700">Company Email</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="companyEmail"
                    value={profileData?.presentCompany?.companyEmail || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        presentCompany: {
                          ...profileData?.presentCompany,
                          companyEmail: e.target.value,
                        },
                      })
                    }
                    onBlur={handleCompanyEmail}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                  {isCompanyEmailVerified && (
                    <FaCheckCircle
                      className="ml-2"
                      style={{ color: "#009fe3" }}
                      size={30}
                      title="Verified"
                    />
                  )}

                  <button
                    type="button"
                    // onClick={handleCompanyVerification}
                    onClick={() => {
                      if (isEditing) {
                        handleCompanyVerification(); // Trigger verification when changing
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="ml-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
                  >
                    {!!originalCompany ? (isEditing ? "Change" : "Edit") : "Verify"}
                  </button>
                </div>
              </div>

              {/* OTP Modal */}
              {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                  <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                    <button
                      onClick={() => {
                        setShowOtpModal(false);
                      }}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Verify OTP</h3>
                    <form onSubmit={handleOtpSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData?.presentCompany.companyEmail}
                          readOnly
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={handleOtpChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleOtpSubmit}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
                      >
                        Verify OTP
                      </button>
                    </form>
                    {/* Resend OTP Button */}
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-600 mt-4"><span className="text-blue-600 cursor-pointer underline">Resend OTP</span> in {resendTimer}s</p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-400"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={profileData?.presentCompany?.dateOfJoining || ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData?.presentCompany,
                        dateOfJoining: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />

              </div>


              <div className='relative'>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData?.presentCompany?.location || ''}
                  onChange={handlePresentChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
                {locationSuggestions.length > 0 && (
                  <ul className="absolute w-full mt-32 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-[250px] overflow-y-auto" style={{ top: '-100%' }}>
                    {locationSuggestions.map((location, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectSuggestion(location)}
                        className="cursor-pointer p-2 hover:bg-black-800 rounded-md"
                      >
                        {location.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current CTC (INR-Lakhs)</label>
                <input
                  type="number"
                  name="currentCTC"
                  min="0"
                  value={profileData?.presentCompany?.currentCTC || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData?.presentCompany,
                        currentCTC: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
            </div>


            {/* Education Section */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Education <span className="text-red-500">*</span></h3>
            {profileData?.education.map((edu, index) => (
              <div key={index} className="mt-3 flex items-center gap-6 flex-col sm:flex-row">
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="text"
                    name="level"
                    value={edu.level}
                    onChange={(e) => {
                      const updatedEducation = [...profileData?.education];
                      updatedEducation[index].level = e.target.value;
                      setProfileData({ ...profileData, education: updatedEducation });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={edu.schoolName}
                    onChange={(e) => {
                      const updatedEducation = [...profileData?.education];
                      updatedEducation[index].schoolName = e.target.value;
                      setProfileData({ ...profileData, education: updatedEducation });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="w-full sm:flex-1 flex items-center gap-3">
                  <div className="w-[80%] sm:flex-1">
                    <label className="block text-sm font-medium text-gray-700">Year of Passing</label>
                    <input
                      type="text"
                      name="yearOfPassing"
                      value={edu.yearOfPassing}
                      onChange={(e) => {
                        const updatedEducation = [...profileData?.education];
                        updatedEducation[index].yearOfPassing = e.target.value;
                        setProfileData({ ...profileData, education: updatedEducation });
                      }}
                      onBlur={validation}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  {/* Remove Button in Same Row */}
                  <FaTrash onClick={() => removeEducation(index)} className="m-2 sm:mt-5 mt-6 text-xl text-red-500 hover:text-red-700" />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowEducationForm(true)}
              className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
            >
              Add Education
            </button>

            {/* New Education Form */}
            {showEducationForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Education</h4>
                <div className="flex gap-6 mt-3 flex-col sm:flex-row">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <input
                      type="text"
                      name="level"
                      value={newEducation.level}
                      onChange={handleEducationChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={newEducation.schoolName}
                      onChange={handleEducationChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Year of Passing</label>
                    <input
                      type="text"
                      name="yearOfPassing"
                      value={newEducation.yearOfPassing}
                      onChange={handleEducationChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>
                <button
                  onClick={addEducation}
                  className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                  Add Education Entry
                </button>
              </div>
            )}

            {/* Experience Section */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Experience</h3>
            {profileData?.experience.map((exp, index) => (
              <div key={index} className="mt-3 flex items-center gap-6 flex-col sm:flex-row">
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={exp.companyName || ''}
                    onChange={(e) => {
                      const updatedExperience = [...profileData?.experience];
                      updatedExperience[index].companyName = e.target.value;
                      setProfileData({ ...profileData, experience: updatedExperience });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="w-full sm:flex-1">
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={exp.position || ''}
                    onChange={(e) => {
                      const updatedExperience = [...profileData?.experience];
                      updatedExperience[index].position = e.target.value;
                      setProfileData({ ...profileData, experience: updatedExperience });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>

                <div className="w-full sm:flex-1 flex items-center gap-3">
                  <div className="w-[80%] sm:flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={exp.dateOfJoining || ""}
                      onChange={(e) => {
                        const updatedExperience = [...profileData?.experience];
                        updatedExperience[index].dateOfJoining = e.target.value;
                        setProfileData({ ...profileData, experience: updatedExperience });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />

                  </div>
                  <div className="w-[80%] sm:flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Leaving</label>
                    <input
                      type="date"
                      name="dateOfLeaving"
                      value={exp.dateOfLeaving || ""}
                      onChange={(e) => {
                        const updatedExperience = [...profileData?.experience];
                        updatedExperience[index].dateOfLeaving = e.target.value;
                        setProfileData({ ...profileData, experience: updatedExperience });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  {/* Remove Button in Same Row */}
                  <FaTrash onClick={() => removeExperience(index)} className="m-2 mt-6 sm:mt-5 text-xl text-red-500 hover:text-red-700" />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowExperienceForm(true)}
              className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
            >
              Add Experience
            </button>

            {/* New Experience Form */}
            {showExperienceForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Experience</h4>
                <div className="flex gap-6 mt-3 flex-col sm:flex-row">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={newExperience.companyName}
                      onChange={handleExperienceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={newExperience.position}
                      onChange={handleExperienceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      value={newExperience.dateOfJoining || ""}
                      onChange={handleExperienceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date of Leaving</label>
                    <input
                      type="date"
                      name="dateOfLeaving"
                      value={newExperience.dateOfLeaving || ""}
                      onChange={handleExperienceChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>
                <button
                  onClick={addExperience}
                  className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                  Add Experience Entry
                </button>
              </div>
            )}

            {/* Projects*/}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Project</h3>
            {profileData?.project.map((project, index) => (
              <div key={index} className="relative mt-3 flex flex-col gap-6 p-4 border rounded-lg shadow-md bg-white">

                {/* Delete Button in the Top-Right Corner */}
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-2 right-2 text-black  "
                >
                  <FaTrash className="text-xl text-red-500 hover:text-red-700" />
                </button>
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Project Name */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      name="projectName"
                      value={project.projectName || ''}
                      onChange={(e) => {
                        const updatedProjects = [...profileData?.project];
                        updatedProjects[index].projectName = e.target.value;
                        setProfileData({ ...profileData, project: updatedProjects });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Repo Link */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Repo Link</label>
                    <input
                      type="text"
                      name="repoLink"
                      value={project.repoLink || ''}
                      onChange={(e) => {
                        const updatedProjects = [...profileData?.project];
                        updatedProjects[index].repoLink = e.target.value;
                        setProfileData({ ...profileData, project: updatedProjects });
                      }}
                      onBlur={validation}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Live URL */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Live URL</label>
                    <input
                      type="text"
                      name="liveLink"
                      value={project.liveLink || ''}
                      onChange={(e) => {
                        const updatedProjects = [...profileData?.project];
                        updatedProjects[index].liveLink = e.target.value;
                        setProfileData({ ...profileData, project: updatedProjects });
                      }}
                      onBlur={validation}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div className="flex">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="details"
                      value={project.details || ''}
                      onChange={(e) => {
                        const updatedProjects = [...profileData?.project];
                        updatedProjects[index].details = e.target.value;
                        setProfileData({ ...profileData, project: updatedProjects });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>

            ))}

            {/* Add Project Button */}
            <button
              type="button"
              onClick={() => setShowProjectForm(true)}
              className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
            >
              Add Project
            </button>

            {/* New Project Form */}
            {showProjectForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Project</h4>
                <div className="flex gap-6 mt-3 flex-col sm:flex-row">
                  {/* Project Name */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      name="projectName"
                      value={newProject.projectName}
                      onChange={handleProjectChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Repo Link */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Repo Link</label>
                    <input
                      type="text"
                      name="repoLink"
                      value={newProject.repoLink}
                      onChange={handleProjectChange}
                      onBlur={validation}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Live URL */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Live URL</label>
                    <input
                      type="text"
                      name="liveLink"
                      value={newProject.liveLink}
                      onChange={handleProjectChange}
                      onBlur={validation}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="details"
                    value={newProject.details}
                    onChange={handleProjectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>

                <button
                  onClick={addProject}
                  className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                  Add Project Entry
                </button>
              </div>
            )}


            {/* Preferences */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Preferences</h3>
            {profileData?.preferences.map((preference, index) => (
              <div key={index} className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-6 flex-col sm:flex-row">
                  {/* Preferred Company Name with Suggestions */}
                  <div className="w-full sm:flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700">Preferred Company Name</label>
                    <input
                      type="text"
                      name="preferredCompanyName"
                      value={preference.preferredCompanyName || ''}
                      onChange={(e) => handlePreferenceChange(e, index)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Preferred Position */}
                  <div className="w-full sm:flex-1">
                    <label className="block text-sm font-medium text-gray-700">Preferred Position</label>
                    <input
                      type="text"
                      name="preferredPosition"
                      value={preference.preferredPosition || ''}
                      onChange={(e) => handlePreferenceChange(e, index)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>

                  {/* Expected CTC Range */}
                  <div className="w-full sm:flex-1 flex items-center gap-3">
                    <div className="w-[80%] sm:flex-1">
                      <label className="block text-sm font-medium text-gray-700">Expected CTC Range</label>
                      <select
                        name="expectedCTCRange"
                        value={preference.expectedCTCRange || ''}
                        onChange={(e) => handlePreferenceChange(e, index)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                      >
                        <option value="">Select Salary Range</option>
                        <option value="0-3 LPA">0-3 LPA</option>
                        <option value="3-6 LPA">3-6 LPA</option>
                        <option value="6-10 LPA">6-10 LPA</option>
                        <option value="10-15 LPA">10-15 LPA</option>
                        <option value="15+ LPA">15+ LPA</option>
                      </select>
                    </div>

                    {/* Remove Button */}
                    <FaTrash
                      onClick={() => handleRemovePreference(index)}
                      className="ml-2 mt-5 text-xl cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Preference Button */}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
            >
              Add Preference
            </button>


            {/* New Preference Form */}
            {showForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Preference</h4>
                <div className="flex gap-6 mt-3  flex-col sm:flex-row">
                  <div className="relative flex-1">
                    <label className="block text-sm font-medium text-gray-700">Preferred Company Name</label>
                    <input
                      type="text"
                      name="preferredCompanyName"
                      value={newPreferences.preferredCompanyName}
                      onChange={handleChangeNew}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                    {preferencecompanySuggestions.length > 0 && (
                      <ul className="absolute w-full mt-32 space-y-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto" style={{ top: '-100%' }}>
                        {preferencecompanySuggestions.map((company, index) => (
                          <li
                            key={index}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                            onClick={() => handlePreferencecompanyClick(company)}
                          >
                            <div className="flex items-center">
                              <img
                                src={company.logo_url}
                                alt={company.name}
                                className="h-6 w-6 object-contain mr-2"
                              />
                              <span>{company.name}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Preferred Position</label>
                    <input
                      type="text"
                      name="preferredPosition"
                      value={newPreferences.preferredPosition}
                      onChange={handleChangeNew}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Expected CTC Range</label>
                    <select
                      name="expectedCTCRange"
                      value={newPreferences.expectedCTCRange}
                      onChange={handleChangeNew}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    >
                      <option value="">Select Salary Range</option>
                      <option value="0-3 LPA">0-3 LPA</option>
                      <option value="3-6 LPA">3-6 LPA</option>
                      <option value="6-10 LPA">6-10 LPA</option>
                      <option value="10-15 LPA">10-15 LPA</option>
                      <option value="15+ LPA">15+ LPA</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddPreference}
                  className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                  Add Preference Entry
                </button>
              </div>
            )}



            {/* Links */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Links</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['github', 'portfolio', 'linkedin', 'facebook', 'instagram', 'other'].map((link) => (
                <div key={link}>
                  <label className="block text-sm font-medium text-gray-700">
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={link}
                    value={profileData?.links?.[link] || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        links: {
                          ...profileData?.links,
                          [link]: e.target.value,
                        },
                      })
                    }
                    onBlur={validation}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
              ))}
            </div>

            {/* Achievements */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Achievements</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                {profileData?.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      name={`achievement-${index}`}
                      placeholder="Enter achievement"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                    />
                    {/* Trash Icon to Delete Achievement */}
                    <FaTrash
                      onClick={() => removeAchievement(index)}
                      className="ml-2 text-xl cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ))}
              </div>
              {/* Add Button for Achievements */}
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={addAchievement}
                  className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
                >
                  Add Achievement
                </button>
              </div>
            </div>

            {/* Skills */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Skills <span className="text-red-500">*</span></h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2 flex flex-wrap gap-4">
                {profileData?.skills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      name={`skill-${index}`}
                      placeholder="Enter skill"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm p-2"
                    />
                    {/* Trash Icon to Delete Skill */}
                    <FaTrash
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-xl cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ))}
              </div>

              {/* Add Button for Skills */}
              <div className="col-span-2 mt-4">
                <button
                  type="button"
                  onClick={addSkill}
                  className="mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
                >
                  Add Skill
                </button>
              </div>
            </div>


            {/* Resume Link */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Upload Resume(.pdf) <span className="text-red-500">*</span></h3>
            <div className="mt-3">
              <input
                type="file"
                name="resume"
                accept=".pdf" // You can specify which file types to allow
                onChange={handleResumeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
              <div className="mt-3">
                {profileData?.resume ? (
                  <div className="flex items-center gap-2">
                    {/* Button to open the modal and view resume */}
                    <button
                      type="button"
                      onClick={openModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 p-2 text-white rounded-lg border-blue-700 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semiboldshadow-lg transition duration-300 hover:shadow-lg hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 "
                    >
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      View Uploaded Resume
                    </button>
                    {/* Trash Icon to Delete Resume */}
                    <FaTrash
                      onClick={() => setOpenConfirmModal(true)}
                      className="ml-2 text-xl cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ) : (
                  <div className="mt-1 block w-full p-2">No resume uploaded</div>
                )}
              </div>
            </div>

            {/* Resume delect */}
            {/* Confirmation Modal for Resume Deletion */}
            <Transition.Root show={openConfirmModal} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={() => setOpenConfirmModal(false)}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-4 text-left shadow-xl transition-all sm:max-w-md sm:w-full">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                              Delete Resume
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Are you sure you want to delete your resume? This action cannot be undone.</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4  sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 mx-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                            onClick={removeResume}
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 mx-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpenConfirmModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>


            {/* Resume Modal */}
            {openResume && (
              <Transition.Root show={openResume} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleCloseModal}>
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto mt-4">
                    <div className="flex min-h-full items-center justify-center p-2 text-center sm:items-center sm:p-0">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:max-w-3xl w-full sm:h-auto h-3/4 p-6">
                          <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                Uploaded Resume
                              </Dialog.Title>
                            </div>
                          </div>
                          <div className="mt-3">
                            {/* Display the Base64 resume as an embedded PDF */}
                            <iframe
                              src={`data:application/pdf;base64,${profileData?.resume}`}
                              width="100%"
                              height="500px"
                              title="Resume"
                            ></iframe>
                          </div>
                          {/* Close Button */}
                          <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="w-6 h-6" />
                          </button>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            )}

            {/* About Me */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">About Me <span className="text-red-500">*</span></h3>
            <div className="mt-3">
              <textarea
                name="aboutMe"
                value={profileData?.aboutMe || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div >
      </div >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
