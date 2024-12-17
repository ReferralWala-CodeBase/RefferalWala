import React, { useState, useEffect } from 'react';
import SidebarNavigation from '../SidebarNavigation';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    education: [{ level: '', schoolName: '', yearOfPassing: '' }],
    experience: [{ companyName: '', position: '', yearsOfExperience: '' }],
    presentCompany: {},
    preferences: {},
    links: {},
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

  // Fetching the existing profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const bearerToken = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://referralwala-deployment.vercel.app/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('Error fetching profile details.');
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      const response = await fetch(`https://referralwala-deployment.vercel.app/user/profile/${userId}`, {
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
  
      alert('Profile updated successfully');
      navigate('/viewprofile'); 
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex">
      <div className="w-1/4">
        <SidebarNavigation />
      </div>
      <div className="w-3/4 px-4 sm:px-6">
        <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
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
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={profileData.mobileNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
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
          </div>

          {/* Present Company */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Present Company</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={profileData.presentCompany.role || ''}
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
                value={profileData.presentCompany.companyName || ''}
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
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={profileData.presentCompany.location || ''}
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
              <label className="block text-sm font-medium text-gray-700">Current CTC</label>
              <input
                type="text"
                name="currentCTC"
                value={profileData.presentCompany.currentCTC || ''}
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
    <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Education</h3>
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
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="p-2 text-xs bg-red-500 text-white rounded"
          >
            Remove
          </button>
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
          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="p-2 text-xs bg-red-500 text-white rounded"
          >
            Remove
          </button>
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
        value={profileData.links[link] || ''}
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
    <input
      type="text"
      name="achievements"
      placeholder="Enter achievements separated by commas"
      value={profileData.achievements.join(', ')}
      onChange={(e) =>
        setProfileData({
          ...profileData,
          achievements: e.target.value.split(',').map((achievement) => achievement.trim())
        })
      }
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
    />
  </div>
  {/* Add Button for Achievements */}
  <div className="col-span-2 mt-4">
    <button
      type="button"
      onClick={() => setProfileData({ ...profileData, achievements: [...profileData.achievements, 'New Achievement'] })}
      className="p-2 bg-blue-500 text-white rounded"
    >
      Add Achievement
    </button>
  </div>
</div>

{/* Skills */}
<h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Skills</h3>
<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div className="col-span-2">
    <input
      type="text"
      name="skills"
      placeholder="Enter skills separated by commas"
      value={profileData.skills.join(', ')}
      onChange={(e) =>
        setProfileData({
          ...profileData,
          skills: e.target.value.split(',').map((skill) => skill.trim())
        })
      }
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
    />
  </div>
  {/* Add Button for Skills */}
  <div className="col-span-2 mt-4">
    <button
      type="button"
      onClick={() => setProfileData({ ...profileData, skills: [...profileData.skills, 'New Skill'] })}
      className="p-2 bg-blue-500 text-white rounded"
    >
      Add Skill
    </button>
  </div>
</div>


          {/* Resume Link */}
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">Resume Link</h3>
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
          <h3 className="mt-6 text-lg font-medium leading-7 text-gray-900">About Me</h3>
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
      </div>
    </div>
  );
}
