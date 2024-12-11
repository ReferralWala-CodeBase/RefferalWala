import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AboutUs from "./pages/AboutUs";
import SignupPage from "./pages/SignupPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HomePage from "./pages/HomePage";
import ViewProfile from "./components/Profile/ViewProfile";
import EditProfile from "./components/Profile/EditProfile";
import ForgotPage from "./pages/ForgotPage";
import PostJob from "./components/Post/PostJob";
import PostedJobsList from "./components/Post/PostedJobsList";
import SidebarNavigation from "./components/SidebarNavigation";
import Navbar from "./components/Navbar";
import ViewPostedJob from "./components/Post/ViewPostedJob";
import EditPostedJob from "./components/Post/EditPostedJob";
import JobApplicantsList from "./components/Post/JobApplicantsList";
import PostedJobsCard from "./components/Post/PostedJobsCard";
import ViewApplicantProfile from "./components/Post/ViewApplicantProfile";

function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/viewapplicantprofile/:applicantId" element={<ViewApplicantProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/postjob" element={<PostJob />} />
        {/* <Route path="/viewpostedjob" element={<ViewPostedJob />} /> */}
        <Route path="/postedjobslist" element={<PostedJobsList />} />
        <Route path="/postedjobscard" element={<PostedJobsCard />} />
        <Route path="/viewpostedjob/:jobId" element={<ViewPostedJob />} />
        <Route path="/editpostedjob/:jobId" element={<EditPostedJob />} />
        <Route path="/jobapplicantslist/:jobId" element={<JobApplicantsList />} />

      </Routes>
    </>

  );
}

export default App;
