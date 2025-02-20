import React from "react";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import PostedJobsCard from "../components/Post/PostedJobsCard";

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Home /> */}
      <PostedJobsCard />
    </div>
  );
}

export default HomePage;
