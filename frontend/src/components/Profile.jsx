import React, { useEffect, useState, useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function Profile() {
  const [email, setEmail] = useState("");
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    application: "Backend Developer",
    email: "margot.foster@example.com",
    salary: "120,000",
    about:
      "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.",
    attachments: [
      { name: "resume_back_end_developer.pdf", size: "2.4mb" },
      { name: "coverletter_back_end_developer.pdf", size: "4.5mb" },
    ],
    education: [
      {
        level: "Bachelor's Degree",
        schoolName: "Stanford University",
        yearOfPassing: 2018,
      },
    ], // Example education entries
    experience: [
      {
        companyName: "TechCorp",
        position: "Software Engineer",
        yearsOfExperience: 3,
      },
      {
        companyName: "CodeWorks",
        position: "Junior Developer",
        yearsOfExperience: 2,
      },
    ], // Example experience entries
  });

  var result='';
  useEffect(() => {
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) setEmail(storedEmail);

    const fetchData = async () => {
      const apiUrl = "https://referralwala-deployment.vercel.app/user/profile/66eb5081f957a0238fc98339";
      const bearerToken = localStorage.getItem('token');
      try {
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
        
        setFormData({
          fullName: result.firstName+" "+result.lastName,
          application: "Backend Developer",
          email: result.email,
          salary: "120,000",
          about:
            "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.",
          attachments: [
            { name: "resume_back_end_developer.pdf", size: "2.4mb" },
            { name: "coverletter_back_end_developer.pdf", size: "4.5mb" },
          ],
          education: [
            {
              level: "Bachelor's Degree",
              schoolName: "Stanford University",
              yearOfPassing: 2018,
            },
          ], // Example education entries
          experience: [
            {
              companyName: "TechCorp",
              position: "Software Engineer",
              yearsOfExperience: 3,
            },
            {
              companyName: "CodeWorks",
              position: "Junior Developer",
              yearsOfExperience: 2,
            },
          ], // Example experience entries
        })
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();

  }, []);

  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttachmentChange = (index, value) => {
    const updatedAttachments = [...formData.attachments];
    updatedAttachments[index].name = value;
    setFormData({ ...formData, attachments: updatedAttachments });
  };

  const handleAddAttachment = () => {
    fileInputRef.current.click();
  };

  // Removes an attachment by index
  const handleRemoveAttachment = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, i) => i !== index),
    }));
  };

  // Processes the selected file
  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        attachments: [
          ...prevData.attachments,
          { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` },
        ],
      }));
    }
  };
  // Function to handle adding a new education entry
  const handleAddEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { level: "", schoolName: "", yearOfPassing: "" }, // Default values for new education
      ],
    }));
  };

  // Function to handle removing an education entry
  const handleRemoveEducation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };

  // Function to handle adding a new experience entry
  const handleAddExperience = () => {
    setFormData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        { companyName: "", position: "", yearsOfExperience: "" }, // Default values for new experience
      ],
    }));
  };

  // Function to handle removing an experience entry
  const handleRemoveExperience = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      experience: prevData.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <div class="bg-gray-100">
      <div class="container mx-auto py-8">
        <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div class="col-span-4 sm:col-span-3">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex flex-col items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/94.jpg"
                  class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  alt="bg"
                />
                <h1 class="text-xl font-bold">{formData.fullName}</h1>
                <p class="text-gray-700">Software Developer</p>
                <div class="mt-6 flex flex-wrap gap-4 justify-center">
                  <a
                    href="/"
                    class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Contact
                  </a>
                </div>
              </div>
              <hr class="my-6 border-t border-gray-300" />
              <div class="flex flex-col">
                <span class="text-gray-700 uppercase font-bold tracking-wider mb-2">
                  Skills
                </span>
                <ul>
                  <li class="mb-2">JavaScript</li>
                  <li class="mb-2">React</li>
                </ul>
              </div>

              <hr class="my-6 border-t border-gray-300" />
              <div>
                <h3 class="font-semibold text-start mt-3 -mb-2">Applied for</h3>
              </div>
              <hr class="my-6 border-t border-gray-300" />
              <div>
                <h3 class="font-semibold text-center mt-3 -mb-2">Find me on</h3>
                <div class="flex justify-center items-center gap-6 my-6">
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds LinkedIn"
                    href="/"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds YouTube"
                    href="/"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Facebook"
                    href="/"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Instagram"
                    href="/"
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                      ></path>
                    </svg>
                  </a>
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Twitter"
                    href="/"
                    target="_blank"
                  >
                    <svg
                      class="h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-9">
            <div className="bg-white shadow rounded-lg p-6">
              <div>
                <div className="px-4 sm:px-0 relative">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute right-0 text-blue-500 hover:text-blue-700"
                  >
                    {isEditing ? "Save" : "Update"}
                  </button>
                  <h3 className="text-base/7 font-semibold text-gray-900">
                    Applicant Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Cupiditate, necessitatibus, rem vero veniam minus quos quam
                    voluptate illo.
                  </p>
                </div>
                <div className="mt-6 border-t border-gray-100">
                  <dl className="divide-y divide-gray-100">
                    {/* Full Name and Application */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <div className="">
                        <dt className="text-sm/6 font-medium text-gray-900">
                          Full name
                        </dt>
                        <dd className="text-sm/6 text-gray-700 sm:mt-0">
                          {isEditing ? (
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className="border rounded p-1"
                            />
                          ) : (
                            formData.fullName
                          )}
                        </dd>
                      </div>
                      <div className="">
                        <dt className="text-sm/6 font-medium text-gray-900">
                          Application for
                        </dt>
                        <dd className="text-sm/6 text-gray-700 sm:mt-0">
                          {isEditing ? (
                            <input
                              type="text"
                              name="application"
                              value={formData.application}
                              onChange={handleInputChange}
                              className="border rounded p-1"
                            />
                          ) : (
                            formData.application
                          )}
                        </dd>
                      </div>
                    </div>
                    {/* Email and Salary */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                      <div>
                        <dt className="text-sm/6 font-medium text-gray-900">
                          Email address
                        </dt>
                        <dd className="text-sm/6 text-gray-700 sm:mt-0">
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="border rounded p-1"
                            />
                          ) : (
                            formData.email
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm/6 font-medium text-gray-900">
                          Salary expectation
                        </dt>
                        <dd className="text-sm/6 text-gray-700 sm:mt-0">
                          {isEditing ? (
                            <input
                              type="text"
                              name="salary"
                              value={formData.salary}
                              onChange={handleInputChange}
                              className="border rounded p-1"
                            />
                          ) : (
                            `$${formData.salary}`
                          )}
                        </dd>
                      </div>
                    </div>
                    {/* Education */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-medium text-gray-900">
                        Education
                      </dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:mt-0 ">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Level
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name={`education[${index}].level`}
                                  value={edu.level}
                                  onChange={handleInputChange}
                                  className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <p className="text-gray-900">{edu.level}</p>
                              )}
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                School Name
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name={`education[${index}].schoolName`}
                                  value={edu.schoolName}
                                  onChange={handleInputChange}
                                  className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <p className="text-gray-900">
                                  {edu.schoolName}
                                </p>
                              )}
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year of Passing
                              </label>
                              {isEditing ? (
                                <input
                                  type="number"
                                  name={`education[${index}].yearOfPassing`}
                                  value={edu.yearOfPassing}
                                  onChange={handleInputChange}
                                  className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              ) : (
                                <p className="text-gray-900">
                                  {edu.yearOfPassing}
                                </p>
                              )}
                            </div>
                            {isEditing && (
                              <button
                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                                onClick={() => handleRemoveEducation(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <button
                            onClick={handleAddEducation}
                            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                          >
                            Add Education
                          </button>
                        )}
                      </dd>
                    </div>
                    {/* About */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-medium text-gray-900">
                        About
                      </dt>
                      <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {isEditing ? (
                          <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            className="border rounded p-1 w-full"
                          />
                        ) : (
                          formData.about
                        )}
                      </dd>
                    </div>
                    {/* Attachments */}
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm/6 font-medium text-gray-900">
                        Attachments
                      </dt>
                      <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul
                          role="list"
                          className="divide-y divide-gray-100 rounded-md border border-gray-200"
                        >
                          {formData.attachments.map((attachment, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                            >
                              <div className="flex w-0 flex-1 items-center">
                                <svg
                                  className="h-5 w-5 shrink-0 text-gray-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                  <span className="truncate font-medium">
                                    {attachment.name}
                                  </span>
                                  <span className="shrink-0 text-gray-400">
                                    {attachment.size}
                                  </span>
                                </div>
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveAttachment(index)}
                                  className="ml-4 shrink-0 text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              )}
                              {!isEditing && (
                                <div className="ml-4 shrink-0">
                                  <a
                                    href="#"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Download
                                  </a>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        {isEditing && (
                          <div className="mt-4">
                            <button
                              onClick={handleAddAttachment}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Add Attachment
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileSelection}
                            />
                          </div>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
