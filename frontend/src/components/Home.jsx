import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import postdata from "../postdata.json";

function Home() {
  const [postCard, setPostCard] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = "https://referralwala-deployment.vercel.app/job/all";
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

        const result = await response.json();
        setPostCard(result);
      } catch (err) {
        setPostCard(postdata);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex justify-center mt-2 space-x-2">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-1/4 bg-gradient-to-br from-white to-gray-50 py-6 px-8">
        <div className="border p-4 h-[80vh]">
          <div className="p-6 text-center border-b border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="rounded-full mx-auto w-20 h-20 border-4 border-blue-500"
            />
            <h2 className="mt-4 font-bold text-lg text-gray-800">John Doe</h2>
            <p className="text-sm text-gray-500">Web Developer</p>
          </div>
          <div className="mt-6">
            <h3 className="font-bold text-gray-700 text-sm mb-3">
              Recent Activities
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-700 text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                  Followed Jane Smith
                </span>
              </li>
              <li className="flex items-center space-x-2 text-gray-700 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="hover:text-green-600 transition-colors duration-200 cursor-pointer">
                  Liked a post
                </span>
              </li>
              <li className="flex items-center space-x-2 text-gray-700 text-sm">
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span className="hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
                  Updated profile
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="w-full lg:w-2/4">
        {postCard.map((post, index) => (
          <PostCard key={index} postCardData={post} />
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-1/4 bg-white p-4 rounded shadow-md">
        <div className="p-4 border-b">
          <h3 className="font-bold text-md">Recommendations</h3>
          <ul className="mt-2 space-y-2">
            <li className="text-blue-500 text-sm cursor-pointer">
              Follow Jane Smith
            </li>
            <li className="text-blue-500 text-sm cursor-pointer">
              Follow Peter Johnson
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-sm mb-2">Sponsored</h3>
          <img
            src="https://via.placeholder.com/250x150"
            alt="Ad"
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
