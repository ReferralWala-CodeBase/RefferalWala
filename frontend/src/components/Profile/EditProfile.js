import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck } from 'react-icons/fa';
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const Cloudinary_URL = process.env.REACT_APP_CLOUDINARY_URL; // Cloudinary API
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    profilePhoto: '',
    education: [{ level: '', schoolName: '', yearOfPassing: '' }],
    experience: [{ companyName: '', position: '', yearsOfExperience: '' }],
    presentCompany: [{ role: '', companyName: '', location: '', currentCTC: '', companyEmail: '', yearsOfExperience: '' }],
    preferences: {},
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

  const [newEducation, setNewEducation] = useState({ level: '', schoolName: '', yearOfPassing: '' });
  const [newExperience, setNewExperience] = useState({ companyName: '', position: '', yearsOfExperience: '' });
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalCompanyEmail, setOriginalCompanyEmail] = useState('');
  const [isCompanyEmailVerified, setIsCompanyEmailVerified] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
          body: JSON.stringify({ email: profileData.presentCompany.companyEmail, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Company Email verified successfully! ");
        const isVerified = data?.presentCompany?.CompanyEmailVerified;
        setIsCompanyEmailVerified(isVerified);
        setOriginalCompanyEmail(profileData.presentCompany?.companyEmail);
        setShowOtpModal(false);
      } else {
        toast.error(data.message || "Company Email verification failed. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCompanyVerification = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(`${Fronted_API_URL}/user/sendOTP`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: profileData.presentCompany.companyEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpModal(true);
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
    const updatedAchievements = [...profileData.achievements];
    updatedAchievements[index] = value;
    setProfileData({ ...profileData, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    setProfileData({
      ...profileData,
      achievements: [...profileData.achievements, ''] // Add a new empty input for achievements
    });
  };

  const removeAchievement = (index) => {
    const newAchievements = profileData.achievements.filter((_, i) => i !== index);
    setProfileData({ ...profileData, achievements: newAchievements });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  // Add a new skill input field
  const addSkill = () => {
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, ""] // Add a new empty input for skills
    });
  };

  // Remove a skill from the list
  const removeSkill = (index) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData({ ...profileData, skills: updatedSkills });
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
        setOriginalCompanyEmail(data?.presentCompany?.companyEmail);
        setIsCompanyEmailVerified(data?.presentCompany?.CompanyEmailVerified);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
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
    setNewExperience({ companyName: '', position: '', yearsOfExperience: '' });

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

      // Direct image upload if the profile photo is provided
      if (profileData.profilePhoto) {
        const uploadResponse = await uploadImageToCloudinary(profileData.profilePhoto);
        profileData.profilePhoto = uploadResponse.secure_url;
      }

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create a preview URL for the selected image
        const previewURL = URL.createObjectURL(file);

        // Show the image preview in the state
        setImagePreview(previewURL);

        // Update profileData with the file (this is the file object, not the preview URL)
        setProfileData((prevData) => ({
          ...prevData,
          profilePhoto: file, // Store the actual file in profileData for uploading later
        }));
      } catch (error) {
        console.error('Error uploading image:', error.message);
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

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <div className="flex">
        <div className="w-2/12 md:w-1/4 fixed lg:relative">
          <SidebarNavigation />
        </div>
        <div className="w-10/12 md:w-3/4 px-4 sm:px-6 mx-auto">
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email || ''}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileData.mobileNumber || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-full shadow border-2 border-gray-500 p-1"
                  />
                ) : (<img
                  src={profileData.profilePhoto}
                  alt="Profile"
                  className="h-16 w-16 rounded-full shadow border-2 border-gray-500 p-1"
                />)}
              </div>

            </div>

            {/* Present Company */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Present Company</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={profileData.presentCompany?.role || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData.presentCompany,
                        role: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={profileData.presentCompany?.companyName || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData.presentCompany,
                        companyName: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Email</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="companyEmail"
                    value={profileData.presentCompany?.companyEmail || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        presentCompany: {
                          ...profileData.presentCompany,
                          companyEmail: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                  {profileData.presentCompany?.companyEmail === originalCompanyEmail &&
                    isCompanyEmailVerified && (
                      <FaCheck
                        className="ml-2 text-green-500"
                        size={30}
                        title="Verified"
                      />
                    )}
                  <button
                    type="button"
                    onClick={handleCompanyVerification}
                    className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* OTP Modal */}
              {showOtpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Verify OTP</h3>
                    <form onSubmit={handleOtpSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.presentCompany.companyEmail}
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
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Year of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  min="0"
                  value={profileData.presentCompany?.yearsOfExperience || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData.presentCompany,
                        yearsOfExperience: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.presentCompany?.location || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData.presentCompany,
                        location: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current CTC (INR-Lakhs)</label>
                <input
                  type="number"
                  name="currentCTC"
                  min="0"
                  value={profileData.presentCompany?.currentCTC || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      presentCompany: {
                        ...profileData.presentCompany,
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
            {profileData.education.map((edu, index) => (
              <div key={index} className="mt-3 flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="text"
                    name="level"
                    value={edu.level}
                    onChange={(e) => {
                      const updatedEducation = [...profileData.education];
                      updatedEducation[index].level = e.target.value;
                      setProfileData({ ...profileData, education: updatedEducation });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">School Name</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={edu.schoolName}
                    onChange={(e) => {
                      const updatedEducation = [...profileData.education];
                      updatedEducation[index].schoolName = e.target.value;
                      setProfileData({ ...profileData, education: updatedEducation });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Year of Passing</label>
                  <input
                    type="text"
                    name="yearOfPassing"
                    value={edu.yearOfPassing}
                    onChange={(e) => {
                      const updatedEducation = [...profileData.education];
                      updatedEducation[index].yearOfPassing = e.target.value;
                      setProfileData({ ...profileData, education: updatedEducation });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                {/* Remove Button in Same Row */}
                <FaTrash onClick={() => removeEducation(index)} className="m-2 mt-5 text-2xl" />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowEducationForm(true)}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Add Education
            </button>

            {/* New Education Form */}
            {showEducationForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Education</h4>
                <div className="flex gap-6 mt-3">
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
            {profileData.experience.map((exp, index) => (
              <div key={index} className="mt-3 flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={exp.companyName || ''}
                    onChange={(e) => {
                      const updatedExperience = [...profileData.experience];
                      updatedExperience[index].companyName = e.target.value;
                      setProfileData({ ...profileData, experience: updatedExperience });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={exp.position || ''}
                    onChange={(e) => {
                      const updatedExperience = [...profileData.experience];
                      updatedExperience[index].position = e.target.value;
                      setProfileData({ ...profileData, experience: updatedExperience });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={exp.yearsOfExperience || ''}
                    onChange={(e) => {
                      const updatedExperience = [...profileData.experience];
                      updatedExperience[index].yearsOfExperience = e.target.value;
                      setProfileData({ ...profileData, experience: updatedExperience });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
                {/* Remove Button in Same Row */}
                <FaTrash onClick={() => removeExperience(index)} className="m-2 mt-5 text-2xl" />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowExperienceForm(true)}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Add Experience
            </button>

            {/* New Experience Form */}
            {showExperienceForm && (
              <div className="mt-6 p-4 border border-gray-300 rounded">
                <h4 className="text-lg font-medium text-gray-900">Add New Experience</h4>
                <div className="flex gap-6 mt-3">
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
                    <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={newExperience.yearsOfExperience}
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
            {/* Preferences */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Preferences</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Company Name</label>
                <input
                  type="text"
                  name="preferredCompanyName"
                  value={profileData.preferences?.preferredCompanyName || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        preferredCompanyName: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Position</label>
                <input
                  type="text"
                  name="preferredPosition"
                  value={profileData.preferences?.preferredPosition || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        preferredPosition: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected CTC Range</label>
                <input
                  type="text"
                  name="expectedCTCRange"
                  value={profileData.preferences?.expectedCTCRange || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences,
                        expectedCTCRange: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                />
              </div>
            </div>

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
                    value={profileData.links?.[link] || ''}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        links: {
                          ...profileData.links,
                          [link]: e.target.value,
                        },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                  />
                </div>
              ))}
            </div>

            {/* Achievements */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Achievements</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                {profileData.achievements.map((achievement, index) => (
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
                      className="ml-2 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              {/* Add Button for Achievements */}
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={addAchievement}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Add Achievement
                </button>
              </div>
            </div>

            {/* Skills */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Skills <span className="text-red-500">*</span></h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2 flex flex-wrap gap-4">
                {profileData.skills.map((skill, index) => (
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
                      className="ml-2 cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {/* Add Button for Skills */}
              <div className="col-span-2 mt-4">
                <button
                  type="button"
                  onClick={addSkill}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Add Skill
                </button>
              </div>
            </div>


            {/* Resume Link */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Resume Link <span className="text-red-500">*</span></h3>
            <div className="mt-3">
              <input
                type="text"
                name="resume"
                value={profileData.resume || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
            </div>


            {/* About Me */}
            <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">About Me <span className="text-red-500">*</span></h3>
            <div className="mt-3">
              <textarea
                name="aboutMe"
                value={profileData.aboutMe || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                rows="4"
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
