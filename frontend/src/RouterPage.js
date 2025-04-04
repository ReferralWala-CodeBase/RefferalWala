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
import WishlistJobsList from "./components/Post/WishlistJobsList";
import SidebarNavigation from "./components/SidebarNavigation";
import Navbar from "./components/Navbar";
import ViewPostedJob from "./components/Post/ViewPostedJob";
import EditPostedJob from "./components/Post/EditPostedJob";
import JobApplicantsList from "./components/Post/JobApplicantsList";
import PostedJobsCard from "./components/Post/PostedJobsCard";
import ViewApplicantProfile from "./components/Post/ViewApplicantProfile";
import AppliedJobs from "./components/Post/AppliedJobs";
import AppliedJobDetails from "./components/Post/AppliedJobDetails";
import FollowingList from "./components/Profile/FollowingList";
import FollowerList from "./components/Profile/FollowerList";
import CheckUserProfile from "./components/Profile/CheckUserProfile";
import NotificationsPage from "./components/Profile/NotificationsPage";
import SearchPage from "./components/Search";
import WhyDifferent from "./components/LandingPage/WhyDifferent";
import Faq from "./components/LandingPage/Faq";
import About from "./components/LandingPage/About";
import Stats from "./components/LandingPage/Stats";
import ContactUs from "./components/LandingPage/ContactUs";
import Jobs from "./components/OpenJobs/Jobs";
import JobDetails from "./components/OpenJobs/JobDetails";

export default function RouterPage() {
  return (
    <>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/user-login" element={<LoginPage />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/viewapplicantprofile/:applicantId" element={<ViewApplicantProfile />} />
        <Route path="/checkuserprofile/:applicantId" element={<CheckUserProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/postjob" element={<PostJob />} />
        <Route path="/appliedjobs" element={<AppliedJobs />} />
        <Route path="/appliedjobdetails/:jobId" element={<AppliedJobDetails />} />
        <Route path="/postedjobslist" element={<PostedJobsList />} />
        <Route path="/wishlistjobslist" element={<WishlistJobsList />} />
        <Route path="/postedjobscard" element={<PostedJobsCard />} />
        <Route path="/viewpostedjob/:jobId" element={<ViewPostedJob />} />
        <Route path="/editpostedjob/:jobId" element={<EditPostedJob />} />
        <Route path="/jobapplicantslist/:jobId" element={<JobApplicantsList />} />
        <Route path="/followinglist" element={<FollowingList />} />
        <Route path="/followerlist" element={<FollowerList />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/whyDifferent" element={<WhyDifferent />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/about" element={<About />} />
        <Route path="/stats" element={<Stats />} />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />

      </Routes>
    </>
  )
}
